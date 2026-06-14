import express from "express"
import ProductController from "../controllers/ProductController.js";
import userMiddleware, { Role } from "../middleware/userMiddleware.js";

const productRoute=express.Router();

productRoute.route("/addProduct").post(userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Admin),ProductController.createProduct)
productRoute.route("/getProduct").post(ProductController.createProduct)





export default productRoute