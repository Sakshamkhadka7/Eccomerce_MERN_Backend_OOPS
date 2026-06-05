import {Table,Column,Model,DataType} from 'sequelize-typescript'


@Table({
    tableName : "users", 
    modelName : "User", 
    timestamps : true
})

class User extends Model{
    @Column({
        primaryKey : true, 
        type : DataType.UUID, 
        defaultValue : DataType.UUIDV4
    })
    userId!: string

    @Column({
        type : DataType.STRING
    })
    username!: string

    @Column({
        type : DataType.STRING
    })
    email!: string

    @Column({
        type : DataType.STRING
    })
    password!: string 

    @Column({
        type : DataType.ENUM('customer','admin'), 
        defaultValue : 'customer'
    })
    role!: string

    @Column({
        type : DataType.STRING
    })
    otp!: string

    @Column({
        type : DataType.STRING
    })
    otpGeneratedTime!: string
}

export default User