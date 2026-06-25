import { Request, Response } from "express";
import sendResponse from "../services/sendResponse.js";
import Order from "../database/models/orderModel.js";
import OrderDetails from "../database/models/orderDetailModel.js";
import { PaymentMethod, PaymentStatus } from "../globalTypes/index.js";
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
    let paymentData;
    paymentData = await Payment.create({
      orderId: orderData.orderId,
      paymentMethod: paymentMethod,
    });
    if (paymentMethod == PaymentMethod.COD) {
    } else if (paymentMethod == PaymentMethod.khalti) {
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalAmount * 100,
        purchase_order_id: orderData.orderId,
        purchase_order_name: "order_" + orderData.orderId,
      };

      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "Key 0c7fc13f10f9470fb26dffbf4c077e27",
          },
        },
      );

      const khaltiResponse = response.data;
      paymentData.pidx = khaltiResponse.pidx;
      paymentData.save();
      return res.status(200).json({
        message: "Order Created Successfully",
        url: khaltiResponse.payment_url,
        pidx: khaltiResponse.pidx,
      });
    } else {
    }

    return sendResponse(res, 201, "Order created successfully", orderData);
  }

  static async verfiyTransaction(req: Request, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {
      return sendResponse(res, 404, "pidx is required");
    }

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        pidx: pidx,
      },
      {
        headers: {
          Authorization: "Key 0c7fc13f10f9470fb26dffbf4c077e27",
        },
      },
    );
    console.log(response);

    const data = response.data;
    if (data.status === "Completed") {
      await Payment.update(
        {
          paymentStatus: PaymentStatus.Paid,
        },
        {
          where: {
            pidx: pidx,
          },
        },
      );
      res.status(200).json({
        message: "Payment verified successfully",
      });
    } else {
      res.status(200).json({
        message: "Payment not verified or cancelled",
      });
    }
  }
}

export default OrderController;
