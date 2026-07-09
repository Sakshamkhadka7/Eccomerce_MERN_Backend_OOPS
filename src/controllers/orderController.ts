import { Request, Response } from "express";
import sendResponse from "../services/sendResponse.js";
import Order from "../database/models/orderModel.js";
import OrderDetails from "../database/models/orderDetailModel.js";
import {
  OrderStaus,
  PaymentMethod,
  PaymentStatus,
} from "../globalTypes/index.js";
import Payment from "../database/models/paymentModel.js";
import axios from "axios";
import Product from "../database/models/productModel.js";
import Category from "../database/models/categoryModel.js";

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

class OrderWithPayment extends Order{
  declare paymentId:string
}

class OrderController {
  static async createOrder(req: IRequest, res: Response) {
    const userId = req.user?.userId;
    const {
      phoneNumber,
      addressLine,
      totalAmount,
      paymentMethod,
      firstName,
      lastName,
      email,
      state,
      zipcode,
    } = req.body.data;
    const products: IProduct[] = req.body.data.products;
    console.log("products", products);

    if (
      !phoneNumber ||
      !addressLine ||
      !totalAmount ||
      products.length == 0 ||
      !firstName ||
      !lastName ||
      !email ||
      !state ||
      !zipcode
    ) {
      return sendResponse(res, 403, "All fields are mandatory to filled");
    }

    let paymentData;
    paymentData = await Payment.create({
      paymentMethod: paymentMethod,
    });

    const orderData = await Order.create({
      phoneNumber,
      addressLine,
      totalAmount,
      userId,
      firstName,
      lastName,
      email,
      state,
      zipcode,
      paymentId: paymentData.paymentId,
    });

    let data;
    products.forEach(async (product) => {
      data = await OrderDetails.create({
        quantity: product.productQty,
        productId: product.productId,
        orderId: orderData.orderId,
      });
    });

    if (paymentMethod == PaymentMethod.khalti) {
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
        data,
      });
    } else if (paymentMethod == PaymentMethod.Esewa) {
    } else {
      res.status(200).json({
        message: "Order created successfully",
        data,
      });
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

  static async fetchMyOrder(req: IRequest, res: Response) {
    const userId = req.user?.userId;
    const orders = await Order.findAll({
      where: {
        userId,
      },
      attributes: ["totalAmount", "orderStaus", "orderId"],
      include: [
        {
          model: Payment,
          attributes: ["paymentMethod", "paymentStatus"],
        },
      ],
    });

    if (orders.length > 0) {
      res.status(200).json({
        message: "Order fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No order found",
        data: null,
      });
    }
  }

  static async fetchMyOrderDetail(req: IRequest, res: Response) {
    const orderId = req.params.id;
    const userId = req.user?.userId;
    const orders = await OrderDetails.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: Order,
          include: [
            {
              model: Payment,
              attributes: ["paymentMethod", "paymentStatus"],
            },
          ],
          attributes: [
            "totalAmount",
            "addressLine",
            "orderStaus",
            "phoneNumber",
            "state",
            "firstName",
            "lastName",
            "userId"
          ],
        },
        {
          model: Product,
          include: [
            {
              model: Category,
            },
          ],
          attributes: ["productName", "productPrice", "productImage"],
        },
      ],
    });

    if (orders.length > 0) {
      res.status(200).json({
        message: "Order fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No order found",
        data: null,
      });
    }
  }

  static async cancelOrder(req: IRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const orderId = req.params.orderId;

    const [cancel] = await Order.findAll({
      where: {
        userId: userId,
        orderId: orderId,
      },
    });

    if (!cancel) {
      res.status(400).json({
        message: "No Order is found",
      });

      return;
    }
     console.log("Order status : ",cancel.orderStaus);
    if (cancel.orderStaus === OrderStaus.OntheWay || cancel.orderStaus ===  OrderStaus.Prepration) {
      res.status(403).json({
        message:
          "You cannot cancelled order , it is on the way or preparation mode",
      });
      return
    }

    await Order.update(
      {
        orderStaus: OrderStaus.Cancelled,
      },
      {
        where: {
          orderId: orderId,
        },
      },
    );

    res.status(200).json({
      message: "Order cancelled successfully",
    });
  }

  static async changeOrderStatus(req: IRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const { orderStaus } = req.body;
    if (!orderId || !orderStaus) {
      res.status(403).json({
        message: "Please provide orderId and orderStatus",
      });
    }

    await Order.update(
      {
        orderStaus: orderStaus,
      },
      {
        where: {
          orderId,
        },
      },
    );

    res.status(200).json({
      message: "Order status updated successfully",
    });
  }

  static async deleteOrder(req:IRequest,res:Response){
    const orderId=req.params.id;
     
    //@ts-ignore
    const order:OrderWithPayment=await Order.findByPk(orderId) as OrderWithPayment
    const paymentId=order?.paymentId


    if(!order){
      res.status(404).json({
        message:"you donot have that orderId"
      })
    }

    await OrderDetails.destroy({
      where:{
       orderId
      }
    })

    await Payment.destroy({
       where:{
        paymentId:paymentId
       }
    })

    await Order.destroy({
      where:{
        orderId:orderId
      }
    })

    res.status(200).json({
      message:"Order and asscoiated with or deleted"
    })
  }
  
  static async fetchAllOrder(req: IRequest, res: Response) {
   
    const orders = await Order.findAll({
      attributes: ["totalAmount", "orderStaus", "orderId"],
      include: [
        {
          model: Payment,
          attributes: ["paymentMethod", "paymentStatus"],
        },
      ],
    });

    if (orders.length > 0) {
      res.status(200).json({
        message: "Order fetched successfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No order found",
        data: null,
      });
    }
  }
  
}

export default OrderController;
