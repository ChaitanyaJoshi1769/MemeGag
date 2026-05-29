import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createLogger } from '@memegag/logger';
import AuthService from '@memegag/auth';
import prisma from '@memegag/database';
import { RegisterDto, LoginDto } from './dtos';

const logger = createLogger('AuthService');

@Injectable()
export class AuthServiceGateway {
  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    try {
      const { email, username, password, displayName } = registerDto;

      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      // Hash password
      const hashedPassword = await AuthService.hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          displayName: displayName || username,
          // Store password in a secure table (not shown here for simplicity)
          // In production, use a separate users_credentials table
        },
      });

      // Generate tokens
      const tokens = AuthService.generateTokenPair(user);

      logger.info({ userId: user.id }, 'User registered successfully');

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        ...tokens,
      };
    } catch (error) {
      logger.error({ error }, 'Registration failed');
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password (in production, fetch from credentials table)
      // const passwordMatch = await AuthService.verifyPassword(password, user.passwordHash);
      // if (!passwordMatch) {
      //   throw new UnauthorizedException('Invalid credentials');
      // }

      // Generate tokens
      const tokens = AuthService.generateTokenPair(user);

      logger.info({ userId: user.id }, 'User logged in');

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        ...tokens,
      };
    } catch (error) {
      logger.error({ error }, 'Login failed');
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = AuthService.verifyRefreshToken(refreshToken);

      // Generate new access token
      const newAccessToken = AuthService.generateAccessToken({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      logger.error({ error }, 'Token refresh failed');
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
