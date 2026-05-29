import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createLogger } from '@memegag/logger';
import config from '@memegag/config';
import { User } from '@memegag/shared-types';

const logger = createLogger('auth');

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Generate JWT access token
   */
  static generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRATION,
      algorithm: 'HS256',
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRATION,
      algorithm: 'HS256',
    });
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokenPair(user: User): TokenPair {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify JWT access token
   */
  static verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    } catch (error) {
      logger.error({ error }, 'Failed to verify access token');
      throw new Error('Invalid token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.REFRESH_TOKEN_SECRET) as JwtPayload;
    } catch (error) {
      logger.error({ error }, 'Failed to verify refresh token');
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Hash password
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Extract token from authorization header
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Decode token without verification (for inspection)
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    return Date.now() >= decoded.exp * 1000;
  }

  /**
   * Generate random token for email verification/password reset
   */
  static generateRandomToken(length: number = 32): string {
    return require('crypto')
      .randomBytes(length)
      .toString('hex');
  }
}

export default AuthService;
