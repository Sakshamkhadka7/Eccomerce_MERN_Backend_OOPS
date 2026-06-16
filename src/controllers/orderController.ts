import { Request, Response } from "express";
import sendResponse from "../services/sendResponse.js";
import Order from "../database/models/orderModel.js";
import OrderDetails from "../database/models/orderDetailModel.js";

interface IProduct {
  productId: string;
  productQty: string;
}

class OrderController {
  static async createOrder(req: Request, res: Response) {
    const { phoneNumber, addressLine, totalAmount } = req.body;
    const products: IProduct[] = req.body;

    if (!phoneNumber || !addressLine || !totalAmount || products.length == 0) {
      return sendResponse(res, 403, "All fields are mandatory to filled");
    }

    const orderData = await Order.create({
      phoneNumber,
      addressLine,
      totalAmount,
    });

    products.forEach(async(product) => {
    await  OrderDetails.create({
        orderDetails: product.productQty,
        productId: product.productId,
        orderId: orderData.orderId,
      });
    });

    return sendResponse(res, 201, "Order created successfully", orderData);
  }
}

export default OrderController;
