import { Request, Response } from "express";
import Cart from "../database/models/cartModel.js";
import Product from "../database/models/productModel.js";
import { model } from "mongoose";
import Category from "../database/models/categoryModel.js";

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
      cartExists.save();
    } else {
     await Cart.create({
        userId,
        productId,
        quantity,
      });

     const cart=await Cart.findAll({
      where:{
        userId
      },
      include:[
        {
          model:Product,
          include:[
            {
              model:Category
            }
          ]
        }
      ]
     })

      res.status(200).json({
        message: "Product is added to cart",
        data:cart
      });
    }
  }

  static async getMyCarts(req: IRequest, res: Response) {
    const userId = req.user?.userId;

    const carrItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          attributes: ["productName", "productPrice", "productImage","productId"],
        },
      ],
    });

    if (carrItems.length === 0) {
      res.status(400).json({
        message: "No cart item is found",
      });
      return;
    } else {
      res.status(200).json({
        message: "Cart Items fetched",
        data: carrItems,
      });
    }
  }

  static async deleteCarts(req: IRequest, res: Response) {
    const userId = req.user?.userId;
    const { productId } = req.params;

    if (!productId) {
      res.status(404).json({
        message: "productId not found",
      });
      return;
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        message: "product not found",
      });
      return;
    }
    await Cart.destroy({
      where: {
        productId,
        userId,
      },
    });

    res.status(200).json({
      message: "Cart is deleted successfully",
    });
  }


  static async clearCart(req:IRequest,res:Response){
    const userId=req.user?.userId;
    if(!userId){
      res.status(400).json({
        message:"User id not found"
      })
      return
    }

    await Cart.destroy({
    where: {
        userId: req.user?.userId
    }
});

res.status(200).json({
    message: "Cart cleared successfully"
});
  }

  static async updateItemsQuantity(req: IRequest, res: Response) {
    const userId = req.user?.userId;
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!quantity) {
      res.status(400).json({
        message: "Please provide quantity",
      });
      return;
    }
    const cartItems = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (!cartItems) {
      res.status(404).json({
        message: "cartItems is not available",
      });
      return;
    } else {
      cartItems.quantity = quantity;
      await cartItems.save();
      res.status(200).json({
        message:"Cart updated !", 
      })
    }
  }
}

export default  CartController