import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config.js";

const sequelize=new Sequelize(envConfig.connectionString as string);

try {
    sequelize.authenticate()
    .then(()=>{
        console.log("Authentication is right");
    }).catch(err=>{
        console.log("Error occured at connection",err);
    })
} catch (error) {
    console.log("Error occured ar connection of sequelize",error);
}

export default sequelize;