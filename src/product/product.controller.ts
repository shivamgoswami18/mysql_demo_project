import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/service/auth/jwt-auth.guard';
import { RolesGuard } from 'src/libs/service/auth/roles.guard';
import { ApiTag } from 'src/libs/utility/constants/enums';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';

@ApiTags(ApiTag.USER)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Product',
    description: 'This API allows to create a new product.',
  })
  @Post('createProduct')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }
}
