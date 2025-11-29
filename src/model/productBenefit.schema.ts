import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from './product.schema';

@Table({ tableName: 'product_benefit', timestamps: false })
export class ProductBenefit extends Model<ProductBenefit> {
  @Column({ type: DataType.STRING, allowNull: false })
  product_benefit: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  product_id: number;

  @BelongsTo(() => Product, { foreignKey: 'product_id' })
  product: Product;
}
