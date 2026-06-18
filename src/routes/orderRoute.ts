import express from "express"
import OrderController from "../controllers/orderController.js"
import userMiddleware from "../middleware/userMiddleware.js"

const orderRouter=express.Router()

orderRouter.post("/createorder",userMiddleware.isUserLogin,OrderController.createOrder)

export default orderRouter