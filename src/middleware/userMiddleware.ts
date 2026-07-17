import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config.js";
import User from "../database/models/userModel.js";

export enum Role {
  Admin = "admin",
  Customer = "customer",
}

interface IExtendedRequest extends Request {
  user?: {
    username: string;
    email: string;
    password: string;
    role: string;
    userId: string;
  };
}

class UserMiddleware {
async isUserLogin(
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(403).json({
      message: "Token not found",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(403).json({
      message: "Invalid Token Format",
    });
    return;
  }

  jwt.verify(
    token,
    envConfig.secretKey as string,
    async (err, result: any) => {

      if (err) {
        return res.status(403).json({
          message: "Invalid Token",
        });
      }

      const userData = await User.findByPk(result.userId);

      if (!userData) {
        return res.status(404).json({
          message: "No user found",
        });
      }

      req.user = userData;

      next();
    }
  );
}

  accessTo(...roles: Role[]) {
    return (req: IExtendedRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "You donot have permission !!!",
        });
        return;
      }
      next();
    };
  }
}

export default new UserMiddleware();
