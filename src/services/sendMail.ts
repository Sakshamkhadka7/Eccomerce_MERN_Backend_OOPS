import nodemailer from "nodemailer";
import { envConfig } from "../config/config.js";

const sendEmail=()=>{
     nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:envConfig.sendMail
        }
     })
}

export default sendEmail