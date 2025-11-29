import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { ProductBenefit } from './productBenefit.schema';

@Table({ tableName: 'product', timestamps: true })
export class Product extends Model<Product> {
  @Column({ type: DataType.STRING, allowNull: false })
  product_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  product_description: string;

  @HasMany(() => ProductBenefit, { foreignKey: 'product_id' })
  benefits: ProductBenefit[];
}
