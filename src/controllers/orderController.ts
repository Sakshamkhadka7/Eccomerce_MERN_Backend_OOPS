import { Request, Response } from "express";
import sendResponse from "../services/sendResponse.js";
import Order from "../database/models/orderModel.js";
import OrderDetails from "../database/models/orderDetailModel.js";
import { PaymentMethod } from "../globalTypes/index.js";
import Payment from "../database/models/paymentModel.js";
import axios from "axios";

interface IProduct {
  productId: string;
  productQty: string;
}
interface IRequest extends Request {
  user?: {
    userId: string;
    username: string;
    email: string;
  };
}

class OrderController {
  static async createOrder(req: IRequest, res: Response) {
    const userId = req.user?.userId;
    const { phoneNumber, addressLine, totalAmount, paymentMethod } = req.body;
    const products: IProduct[] = req.body.products;
    console.log(products);
    products.forEach((prod) => console.log(prod));

    if (!phoneNumber || !addressLine || !totalAmount || products.length == 0) {
      return sendResponse(res, 403, "All fields are mandatory to filled");
    }

    const orderData = await Order.create({
      phoneNumber,
      addressLine,
      totalAmount,
      userId,
    });

    products.forEach(async (product) => {
      await OrderDetails.create({
        quantity: product.productQty,
        productId: product.productId,
        orderId: orderData.orderId,
      });
    });

    if (paymentMethod == PaymentMethod.COD) {
      await Payment.create({
        orderId: orderData.orderId,
        paymentMethod: paymentMethod,
      });
    } else if (paymentMethod == PaymentMethod.khalti) {
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalAmount * 100,
        purchase_order_id: orderData.orderId,
        purchase_order_name: "order_" + orderData.orderId,
      };

      const response = axios.post("https://dev.khalti.com/api/v2/", data, {
        headers: {
          Authorization: "Key ",
        },
      });

      console.log(response);
    } else {
    }

    return sendResponse(res, 201, "Order created successfully", orderData);
  }
}

export default OrderController;
