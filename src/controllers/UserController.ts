import { Request, Response } from "express";
import User from "../database/models/userModel.js";

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
      password,
    });
    res.status(201).json({
      message: "User created successfully",
    });
  }
}

export default UserController
