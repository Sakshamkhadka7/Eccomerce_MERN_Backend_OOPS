import { Request, Response } from "express";
import Product from "../database/models/productModel.js";
import Category from "../database/models/categoryModel.js";

interface ProductRequest extends Request {
  file: {
    filename: string;
  };
}

class ProductController {
  async createController(req: ProductRequest, res: Response): Promise<void> {
    const {
      productName,
      productDescriptions,
      productPrice,
      productTotalStock,
      productDiscount,
      categoryId,
    } = req.body;
    const fileName = req.file
      ? req.file.filename
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEDgZzszAtkd1ziMCL2WTgmkjb3bIiVEbZLfxpDEtoMZoo3HpahQ3gXpE&s";
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
      productDiscount: productDiscount || 0,
      categoryId,
      productImage: fileName,
    });

    res.status(200).json({
      message: "Product created successfully",
    });
  }

  async getAllProduct(req: Request, res: Response) {
    const datas = await Product.findAll({
      include: {
        model: Category,
      },
    });

    res.status(200).json({
      message: "Product fetched successfully",
      data: datas,
    });
  }

  async getSingleProduct(req: Request, res: Response) {
    const { id } = req.params;
    const datas = await Product.findAll({
      where: {
        productId: id,
      },
      include: {
        model: Category,
      },
    });

    res.status(200).json({
      message: "Product fetched successfully",
      data: datas,
    });
  }
}
