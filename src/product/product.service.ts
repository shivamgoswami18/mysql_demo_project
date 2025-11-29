import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Product } from 'src/model/product.schema';
import { ProductBenefit } from 'src/model/productBenefit.schema';
import { CreateProductDto } from './dto/createProduct.dto';
import { HandleResponse } from 'src/libs/service/handleResponse';
import { ResponseData } from 'src/libs/utility/constants/response';
import { Messages } from 'src/libs/utility/constants/message';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(ProductBenefit)
    private readonly productBenefitModel: typeof ProductBenefit,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const { product_name, product_description, product_benefits } = dto;
      const existingProduct = await this.productModel.findOne({
        where: { product_name },
      });

      if (existingProduct) {
        Logger.error(`Product ${Messages.ALREADY_EXIST}`);
        return HandleResponse(
          HttpStatus.CONFLICT,
          ResponseData.ERROR,
          `Product ${Messages.ALREADY_EXIST}`,
        );
      }

      const createdProduct = await this.productModel.create(
        {
          product_name,
          product_description,
        },
        { transaction },
      );

      if (product_benefits && product_benefits.length > 0) {
        const benefitRecords = product_benefits.map((benefit) => ({
          product_id: createdProduct.id,
          product_benefit: benefit.product_benefit,
        }));

        await this.productBenefitModel.bulkCreate(benefitRecords, {
          transaction,
        });
      }

      await transaction.commit();

      Logger.log(`Product ${Messages.CREATED_SUCCESSFULLY}`);
      return HandleResponse(
        HttpStatus.CREATED,
        ResponseData.SUCCESS,
        `Product ${Messages.CREATED_SUCCESSFULLY}`,
      );
    } catch (error) {
      await transaction.rollback();
      Logger.error(`Failed to create product. error-${error.message}`);
      throw error;
    }
  }
}
