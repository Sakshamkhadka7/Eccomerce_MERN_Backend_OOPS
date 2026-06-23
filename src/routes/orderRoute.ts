import express from "express"
import OrderController from "../controllers/orderController.js"
import userMiddleware from "../middleware/userMiddleware.js"
import errorHandler from "../services/errorhandler.js"

const orderRouter=express.Router()

orderRouter.post("/createorder",userMiddleware.isUserLogin,errorHandler(OrderController.createOrder))

export default orderRouter