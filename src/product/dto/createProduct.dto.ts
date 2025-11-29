import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class ProductBenefitDto {
  @ApiProperty({
    example: 'Helps reduce hair fall',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  product_benefit: string;
}

export class CreateProductDto {
  @ApiProperty({
    example: 'Herbal Hair Oil',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty({
    example: 'Ayurvedic formulation for hair strengthening',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  product_description: string;

  @ApiProperty({
    type: [ProductBenefitDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBenefitDto)
  product_benefits: ProductBenefitDto[];
}
