import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Match } from 'src/libs/helpers/decorators/match.decorator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    type: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 123456,
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.toString())
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6 digit code' })
  otp: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    type: 'string',
    format: 'password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain at least one letter and one number.',
  })
  new_password: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    type: 'string',
    format: 'password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain at least one letter and one number.',
  })
  @Match('new_password', {
    message: 'New Password and Confirm Password do not match',
  })
  confirm_new_password: string;
}
