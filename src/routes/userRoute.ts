import express, { Router } from "express";
import UserController from "../controllers/UserController.js";
import errorHandler from "../services/errorhandler.js";
import userMiddleware, { Role } from "../middleware/userMiddleware.js";

const userRouter: Router = express.Router();

userRouter.route("/register").post(errorHandler(UserController.register));
userRouter.route("/login").post(errorHandler(UserController.login));
userRouter
  .route("/forgot_password")
  .post(errorHandler(UserController.forgetPassword));
userRouter.route("/verify_otp").post(errorHandler(UserController.verifyOtp));
userRouter
  .route("/resetPassword")
  .post(errorHandler(UserController.resetPassword));
userRouter
  .route("/getusers")
  .get(
    userMiddleware.isUserLogin,
    userMiddleware.accessTo(Role.Admin),
    UserController.fetchUsers,
  );
userRouter
  .route("/deleteusers/:id")
  .get(
    userMiddleware.isUserLogin,
    userMiddleware.accessTo(Role.Admin),
    UserController.deleteUsers,
  );
userRouter
  .route("/getme")
  .get(userMiddleware.isUserLogin, UserController.getMe);

userRouter.route("/logout").post(userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Admin),UserController.logout);

export default userRouter;
