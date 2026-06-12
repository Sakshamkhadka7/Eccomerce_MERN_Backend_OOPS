import { Request, Response } from "express";
import User from "../database/models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../services/generateToken.js";
import generateOtp from "../services/generateOtp.js";
import sendEmail from "../services/sendMail.js";

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

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log("User password", password);
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });

      return;
    }
    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "User not found please register",
      });
      return;
    } else {
      console.log("USer json", user);
      const equal = await bcrypt.compare(password, user.dataValues.password);
      if (!equal) {
        res.status(400).json({
          message: "Invalid credentials",
        });
        return;
      } else {
        const token = generateToken(user.userId);

        res.status(200).json({
          message: "Login successfully",
          token,
        });

        return;
      }
    }
  }

  static async forgetPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Please provide a email" });
      return;
    }

    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({ message: "email not register" });
      return;
    }

    const otp = generateOtp();
    await sendEmail({
      to: email,
      subject: "Change password by digital website",
      text: `You request to change a password ${otp} `,
    });

    res.status(200).json({
      message:"Password Reset OTP sent !!"
    })
  }
}

export default UserController;
