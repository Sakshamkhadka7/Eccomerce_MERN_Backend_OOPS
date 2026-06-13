import express from "express";
import categoryController from "../controllers/categoryController.js";

const categoryRoute=express.Router()

categoryRoute.route("/addCategory").post(categoryController.addCategory)
categoryRoute.route("/deleteCategory/:id").post(categoryController.deleteCategory)
categoryRoute.route("/getCategory").get(categoryController.getCategory)
categoryRoute.route("/deleteCategory/:id").post(categoryController.updateCategory)

export default categoryRoute