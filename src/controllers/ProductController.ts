import { Request, Response } from "express";
import Product from "../database/models/productModel.js";


interface ProductRequest extends Request{
    file:{
        filename:string
    }
}


class ProductController {
  async createController(req: ProductRequest, res: Response): Promise<void> {
    const {
      productName,
      productDescriptions,
      productPrice,
      productTotalStock,
      productDiscount,
      categoryId
    } = req.body;
   const fileName= req.file ? req.file.filename : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEDgZzszAtkd1ziMCL2WTgmkjb3bIiVEbZLfxpDEtoMZoo3HpahQ3gXpE&s"
    if (
      !productName ||
      !productDescriptions ||
      !productPrice ||
      !productTotalStock ||
      !categoryId
    ) {
      res.status(400).json({
        message: "All fields are mandatory",
      });
      return;
    }

    await Product.create({
        productName,
      productDescriptions,
      productPrice,
      productTotalStock,
      productDiscount,
      categoryId,
      productImage:fileName
    })

  }
}
