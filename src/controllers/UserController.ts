import { Request, Response } from "express";
import User from "../database/models/userModel.js";
import bcrypt from "bcryptjs";

class UserController {
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username,email and password",
      });
      return;
    }

    const [data] = await User.findAll({
      where: {
        email: email,
      },
    });

    if (data) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    res.status(201).json({
      message: "User created successfully",
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });

      return;
    }
    const user = await User.findAll({
      where: {
        email: email,
      },
    });

    if (user.length == 0) {
      res.status(400).json({
        message: "User not found please register",
      });
    } else {
      const equal = bcrypt.compareSync(password, user[0].password);
      if (!equal) {
        res.status(400).json({
          message: "Invalid credentials",
        });
        return;
      } else {
        res.status(200).json({
          message: "Login successfully",
        });

        return;
      }
    }
  }
}

export default UserController;
