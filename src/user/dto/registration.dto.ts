import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  Matches,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'src/libs/utility/constants/enums';

export class RegistrationDto {
  @ApiProperty({
    example: 'John Doe',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    type: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain at least one letter and one number.',
  })
  password: string;

  @ApiProperty({
    example: '1234567890',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 25,
    type: 'number',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    example: UserRole.USER,
    type: 'string',
    enum: UserRole,
    required: true,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
