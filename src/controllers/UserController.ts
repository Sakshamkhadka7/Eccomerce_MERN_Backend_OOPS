import { Request, Response } from "express";
import User from "../database/models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../services/generateToken.js";
import generateOtp from "../services/generateOtp.js";
import sendEmail from "../services/sendMail.js";
import checkOtpExpiration from "../services/verifyOtp.js";

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

    await sendEmail({
      to: email,
      subject: "Register Successfully",
      text: "Welcome to DigitalPasal ,You have register successfully",
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
    console.log("FORGET PASSWORD CONTROLLER HIT");
    console.log(req.body);
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
    console.log("Before Update:", user.toJSON());

    user.otp = otp.toString();
    user.otpGeneratedTime = Date.now().toString();

    console.log("After Update:", user.toJSON());
    console.log("Changed Fields:", user.changed());

    await user.save();

    console.log("After Save:", user.toJSON());

    res.status(200).json({
      message: "Password Reset OTP sent !!",
    });
  }

  static async verifyOtp(req: Request, res: Response) {
    const { otp, email } = req.body;
    if (!otp || !email) {
      res.status(400).json({
        message: "OTP and email is mandatory",
      });

      return;
    }

    const [data] = await User.findAll({
      where: {
         otp,
       email,
      },
    });

    if (!data) {
      res.status(400).json({
        message: "email not found or otp doesnot match",
      });
      return
    }
    const otpTime=data.otpGeneratedTime
    checkOtpExpiration(res,otpTime, 120000);
  }
}

export default UserController;
