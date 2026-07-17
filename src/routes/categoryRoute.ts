import express from "express";
import categoryController from "../controllers/categoryController.js";
import userMiddleware, { Role } from "../middleware/userMiddleware.js";

const categoryRoute=express.Router()

categoryRoute.route("/addCategory").post(userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Admin),categoryController.addCategory)
categoryRoute.route("/deleteCategory/:id").delete(userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Admin),categoryController.deleteCategory)
categoryRoute.route("/getCategory").get(categoryController.getCategory)
categoryRoute.route("/updateCategory/:categoryId").put(userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Admin),categoryController.updateCategory)

export default categoryRoute    