import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config.js";

class UserMiddleware {
  async isUserLogin(
    req: Request,
    res: Response,
    nest: NextFunction,
  ): Promise<void> {
    const token = req.headers.authorization;
    if (!token) {
      res.status(403).json({
        message: "Token not found",
      });

      return;
    }
    jwt.verify(token, envConfig.secretKey as string, async (err, result) => {
      if (err) {
        res.status(403).json({
          message: "Invalid Token !",
        });

        return;
      } else {
        console.log(result);
      }
    });
  }
}

export default UserMiddleware
