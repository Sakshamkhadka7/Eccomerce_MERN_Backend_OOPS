import express from "express";
import OrderController from "../controllers/orderController.js";
import userMiddleware, { Role } from "../middleware/userMiddleware.js";
import errorHandler from "../services/errorhandler.js";

const orderRouter = express.Router();

orderRouter.post(
  "/createorder",
  userMiddleware.isUserLogin,
  errorHandler(OrderController.createOrder),
);
orderRouter.post(
  "/verify-order",
  userMiddleware.isUserLogin,
  errorHandler(OrderController.verfiyTransaction),
);
orderRouter.get(
  "/getmyorder",
  userMiddleware.isUserLogin,
  errorHandler(OrderController.fetchMyOrder),
);
orderRouter.patch(
  "/cancel-order/:orderId",
  userMiddleware.isUserLogin,
  userMiddleware.accessTo(Role.Customer),
  OrderController.cancelOrder,
);
orderRouter.delete(
  "/admim/delete-order/:id",
  userMiddleware.isUserLogin,
  userMiddleware.accessTo(Role.Admin),
  OrderController.deleteOrder,  
);
orderRouter.patch(
  "/admin/change-status",
  userMiddleware.isUserLogin,
  userMiddleware.accessTo(Role.Admin),
  OrderController.changeOrderStatus,
);

orderRouter.get(
  "/getmyorderdetails/:id",
  userMiddleware.isUserLogin,
  errorHandler(OrderController.fetchMyOrderDetail),
);
orderRouter.get("/fetchallorders",userMiddleware.isUserLogin,userMiddleware.accessTo(Role.Admin),OrderController.fetchAllOrder)
export default orderRouter;
