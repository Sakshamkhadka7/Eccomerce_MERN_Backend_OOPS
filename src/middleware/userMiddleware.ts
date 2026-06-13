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
    const token = req.headers.authorization;
    if (!token) {
      res.status(403).json({
        message: "Token not found",
      });

      return;
    }
    jwt.verify(
      token,
      envConfig.secretKey as string,
      async (err, result: any) => {
        if (err) {
          res.status(403).json({
            message: "Invalid Token !",
          });

          return;
        } else {
          console.log(result);
          const userData = await User.findByPk(result.userId);
          if (!userData) {
            res.status(404).json({
              message: "No user with that ID found",
            });
            return;
          }
          req.user = userData;
          next();
        }
      },
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
