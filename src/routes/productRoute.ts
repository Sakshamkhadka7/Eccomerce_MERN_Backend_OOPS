import express from "express"
import ProductController from "../controllers/ProductController.js";
import userMiddleware, { Role } from "../middleware/userMiddleware.js";
import upload from "../middleware/upload.js";

 



const productRoute=express.Router();

productRoute.route("/addProduct").post(userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Admin),upload.single("image"),ProductController.createProduct)
productRoute.route("/getProduct").get(ProductController.getAllProduct)
productRoute.route("/updateProduct/:id").put(userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Admin),ProductController.updateProduct)
productRoute.route("/deleteProduct/:id").delete(userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Admin),ProductController.deleteProduct)





export default productRoute