import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config.js";
import path from "path";
import { fileURLToPath } from "url";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize=new Sequelize(envConfig.connectionString as string,{
    models:[__dirname + '/models']
});

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