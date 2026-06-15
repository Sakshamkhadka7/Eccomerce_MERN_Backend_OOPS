import { Table, Column, DataType, Model } from "sequelize-typescript";
import { OrderStaus } from "../../globalTypes/index.js";

@Table({
  tableName: "order",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare orderId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [10, 10],
        msg: "Phone number must be 10 digits",
      },
    },
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
  })
  declare addressLine: string;

  @Column({
    type: DataType.STRING,
  })
  declare state: string;

  @Column({
    type: DataType.STRING,
  })
  declare zipcode: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM(
      OrderStaus.Cancelled,
      OrderStaus.Delivered,
      OrderStaus.OntheWay,
      OrderStaus.Pending,
      OrderStaus.Prepration,
    ),
    defaultValue: OrderStaus.Pending,
  })
  declare orderStaus: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "Anonymous",
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "Anonymous",
  })
  declare lastName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "anonymous@gmail.com",
  })
  declare email: string;
}

export default Order;
