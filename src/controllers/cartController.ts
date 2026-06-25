import { Request, Response } from "express";
import Cart from "../database/models/cartModel.js";

interface IRequest extends Request {
  user?: {
    userId: string;
  };
}

class CartController {
  static async createCart(req: IRequest, res: Response) {
    const userId = req.user?.userId;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      res.status(400).json({
        message: "Please provide productId , quantity",
      });
      return;
    }

    let cartExists = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });

    if (cartExists) {
      cartExists.quantity += quantity;
      cartExists.save()
    } else {
      await Cart.create({
        userId,
        productId,
        quantity,
      });
    }
  }
}
