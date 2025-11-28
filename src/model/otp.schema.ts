import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'otp',
  timestamps: true,
})
export class Otp extends Model<Otp> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  otp: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  otp_expire: Date;
}
