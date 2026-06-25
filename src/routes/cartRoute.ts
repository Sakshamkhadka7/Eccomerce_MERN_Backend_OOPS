import express from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware.js";
import CartController from "../controllers/cartController.js";
import errorHandler from "../services/errorhandler.js";

const cartRouter=express.Router();

cartRouter.post("/createcart",userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Customer),errorHandler(CartController.createCart))
cartRouter.get("/getcart",userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Customer),CartController.getMyCarts)
cartRouter.delete("/deletecart/:productId",userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Customer),CartController.deleteCarts)
cartRouter.put("/updatecart/:productId",userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Customer),CartController.updateItemsQuantity)


export default cartRouter;