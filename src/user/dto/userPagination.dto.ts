import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserPaginationDto {
  @ApiProperty({
    example: 1,
    type: 'number',
    format: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    example: 10,
    type: 'number',
    format: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({
    example: 'desc',
    type: 'string',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsString()
  @IsOptional()
  sortOrder: string;

  @ApiProperty({
    example: 'createdAt',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortKey: string;

  @ApiProperty({
    example: '',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  search: string;
}
