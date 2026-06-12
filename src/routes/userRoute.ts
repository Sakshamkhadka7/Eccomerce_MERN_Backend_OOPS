import express, { Router } from "express"
import UserController from "../controllers/UserController.js"


const userRouter:Router=express.Router()

userRouter.route("/register").post(UserController.register)
userRouter.route("/login").post(UserController.login);
userRouter.route("/forgot_password").post(UserController.forgetPassword)
userRouter.route("/verify_otp").post(UserController.verifyOtp)
userRouter.route("/resetPassword").post(UserController.resetPassword);

export default userRouter