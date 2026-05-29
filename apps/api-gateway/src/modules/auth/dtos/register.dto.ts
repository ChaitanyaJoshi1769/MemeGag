import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'username123',
    description: 'Unique username',
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'Password',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Display name',
    required: false,
  })
  @IsOptional()
  @IsString()
  displayName?: string;
}
