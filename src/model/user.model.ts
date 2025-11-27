import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'user',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
