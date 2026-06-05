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
  productId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  productName!: string;

  @Column({
    type: DataType.TEXT,
  })
  productDescriptions!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  productPrice!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productTotalStock!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  productDiscount!: number;

  @Column({
    type: DataType.STRING,
  })
  productImage!: string;
}

export default Product
