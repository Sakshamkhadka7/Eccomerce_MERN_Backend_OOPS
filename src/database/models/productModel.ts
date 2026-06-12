import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  AllowNull,
} from "sequelize-typescript";

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class Product extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
 declare productId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
 declare productName: string;

  @Column({
    type: DataType.TEXT,
  })
 declare productDescriptions: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare productPrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
 declare productTotalStock: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
 declare productDiscount: number;

  @Column({
    type: DataType.STRING,
  })
 declare productImage: string;
}

export default Product
