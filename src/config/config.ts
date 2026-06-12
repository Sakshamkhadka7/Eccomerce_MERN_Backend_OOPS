import { config } from "dotenv";

config();

export const envConfig = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTIONSTRING,
  secretKey: process.env.JWT_SECRET_KEY,
  expiredDay:process.env.JWT_EXPIRES_IN,
  sendMail:process.env.EMAIL,
  emailPass:process.env.EMAIL_PASSWORD,
  adminEmail:process.env.ADMIN_EMAIL,
  adminPassword:process.env.ADMIN_PASSWORD,
  adminUsername:process.env.ADMIN_USERNAME 
};
