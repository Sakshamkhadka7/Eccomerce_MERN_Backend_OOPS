import express, { Router } from "express"
import UserController from "../controllers/UserController.js"


const userRouter:Router=express.Router()

userRouter.route("/register").post(UserController.register)

export default userRouter