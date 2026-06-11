import { config } from "dotenv";

config();

export const envConfig = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTIONSTRING,
  secretKey: process.env.JWT_SECRET_KEY,
  expiredDay:process.env.JWT_EXPIRES_IN
};
