import express from "express";
import categoryController from "../controllers/categoryController.js";
import userMiddleware from "../middleware/userMiddleware.js";

const categoryRoute=express.Router()

categoryRoute.route("/addCategory").post(userMiddleware.isUserLogin,categoryController.addCategory)
categoryRoute.route("/deleteCategory/:id").delete(categoryController.deleteCategory)
categoryRoute.route("/getCategory").get(categoryController.getCategory)
categoryRoute.route("/deleteCategory/:id").put(categoryController.updateCategory)

export default categoryRoute