import { Table,Column,Model,DataType, AllowNull } from "sequelize-typescript";
import { PaymentMethod, PaymentStatus } from "../../globalTypes/index.js";

@Table({
    tableName:"payment",
    modelName:"Table",
    timestamps:true
})

class Payment extends Model{
    @Column({
        primaryKey:true,
        type:DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
   declare paymentId:string

    @Column({
        type:DataType.ENUM(PaymentMethod.COD,PaymentMethod.Esewa,PaymentMethod.khalti),
        defaultValue:PaymentMethod.COD
    })
   declare paymentMethod:string

    @Column({
        type:DataType.ENUM(PaymentStatus.Paid,PaymentStatus.Unpaid),
        defaultValue:PaymentStatus.Unpaid
    })
   declare paymentStatus:string

    @Column({
        type:DataType.STRING
    })

   declare pidx:string
}

export default Payment