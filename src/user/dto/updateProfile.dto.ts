import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John Doe',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: '1234567890',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: 25,
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  age: number;
}
