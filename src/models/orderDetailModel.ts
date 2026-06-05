import { Table,Column,Model,DataType, AllowNull } from "sequelize-typescript";

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
    orderDetails!:string

    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    quantity!:number
}

export default OrderDetails