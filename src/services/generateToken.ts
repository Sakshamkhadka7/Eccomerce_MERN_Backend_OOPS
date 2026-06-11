import jwt from "jsonwebtoken";
import { envConfig } from "../config/config.js";

const generateToken = (userId: string) => {
 const token= jwt.sign(
    {
      userId,
    },
    envConfig.secretKey as string,
    {
      expiresIn:"2d",
    },
  );

  return token
};

export default generateToken;
