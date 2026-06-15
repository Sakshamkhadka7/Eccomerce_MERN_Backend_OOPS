import express, { Router } from "express"
import UserController from "../controllers/UserController.js"
import errorHandler from "../services/errorhandler.js";


const userRouter:Router=express.Router()

userRouter.route("/register").post(errorHandler(UserController.register))
userRouter.route("/login").post(errorHandler(UserController.login));
userRouter.route("/forgot_password").post(errorHandler(UserController.forgetPassword))
userRouter.route("/verify_otp").post(errorHandler(UserController.verifyOtp))
userRouter.route("/resetPassword").post(errorHandler(UserController.resetPassword));

export default userRouter