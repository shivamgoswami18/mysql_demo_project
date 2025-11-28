import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'SecurePassword123!',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({
    example: 'SecurePassword1234!',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
