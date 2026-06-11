import express, { Router } from "express"
import UserController from "../controllers/UserController.js"


const userRouter:Router=express.Router()

userRouter.route("/register").post(UserController.register)
userRouter.route("/login").post(UserController.login);

export default userRouter