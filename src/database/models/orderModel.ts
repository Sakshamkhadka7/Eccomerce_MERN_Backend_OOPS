import { Table,Column,DataType,Model } from "sequelize-typescript";
import { OrderStaus } from "../../globalTypes/index.js";

@Table({
    tableName:"order",
    modelName:"Order",
    timestamps:true
})

class Order extends Model{
  
    @Column({
        primaryKey:true,
        type:DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
    orderId!:string

    @Column({
        type:DataType.STRING,
        allowNull:false,
        validate:{
            len:{
                args:[10,10],
                msg:"Phone number must be 10 digits"
            }
        }
    })
    phoneNumber!:string

    @Column({
        type:DataType.STRING
    })
    addressLine!:string

    @Column({
        type:DataType.STRING
    })
    state!:string

    @Column({
        type:DataType.STRING
    })
    zipcode!:string

    @Column({
        type:DataType.FLOAT,
        allowNull:false
    })
    totalAmount!:number

    @Column({
        type:DataType.ENUM(OrderStaus.Cancelled,OrderStaus.Delivered,OrderStaus.OntheWay,OrderStaus.Pending,OrderStaus.Prepration),
        defaultValue:OrderStaus.Pending
    })
    orderStaus!:string

    @Column({
        type:DataType.STRING,
        allowNull:false,
        defaultValue:"Anonymous"
    })
    firstName!:string

     @Column({
        type:DataType.STRING,
        allowNull:false,
        defaultValue:"Anonymous"
    })
    lastName!:string
  @Column({
        type : DataType.STRING, 
        allowNull : false, 
        defaultValue : "anonymous@gmail.com"
    })
 email! : string 

}

export default Order