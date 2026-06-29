import express from "express"
import OrderController from "../controllers/orderController.js"
import userMiddleware from "../middleware/userMiddleware.js"
import errorHandler from "../services/errorhandler.js"

const orderRouter=express.Router()

orderRouter.post("/createorder",userMiddleware.isUserLogin,errorHandler(OrderController.createOrder))
orderRouter.post("/verify-order",userMiddleware.isUserLogin,errorHandler(OrderController.verfiyTransaction))
orderRouter.get("/getmyorder",userMiddleware.isUserLogin,errorHandler(OrderController.fetchMyOrder))
orderRouter.get("/getmyorderdetails/:id",userMiddleware.isUserLogin,errorHandler(OrderController.fetchMyOrderDetail))


export default orderRouter