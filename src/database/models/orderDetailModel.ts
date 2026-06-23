import { Table,Column,Model,DataType } from "sequelize-typescript";

@Table({
    tableName:"orderDetails",
    modelName:"OrderDetails",
    timestamps:true
})


class OrderDetails extends Model{
    @Column({
        primaryKey:true,
        type:DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
   declare orderDetailsId:string

    @Column({
        type:DataType.INTEGER,
        defaultValue:1
    })
   declare quantity:number
}

export default OrderDetails