import { Request, Response } from "express";
import Product from "../database/models/productModel.js";
import Category from "../database/models/categoryModel.js";

// interface ProductRequest extends Request {
//   file?: {
//     filename: string;
//     fieldname:string,
//   };
// }

interface Update {
  productName?: string;
  productDescriptions?: string;
  productPrice?: string;
  productTotalStock?: string;
  productDiscount?: string;
  categoryId?: string;
  productImage?: string;
}

class ProductController {
  async createProduct(req: Request, res: Response): Promise<void> {
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
        attributes:['categoryId','categoryName']
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
        attributes:['categoryId','categoryName']

      },
    });

    res.status(200).json({
      message: "Product fetched successfully",
      data: datas,
    });
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      res.status(403).json({
        message: "Id is required",
      });

      return;
    }

    const product = await Product.findOne({
      where: {
        productId: id,
      },
    });

    if (!product) {
      res.status(404).json({
        message: "Product with that Id could not be found",
      });
      return;
    }
    const {
      productName,
      productDescriptions,
      productPrice,
      productTotalStock,
      productDiscount,
      categoryId,
    } = req.body;

    const updateData: Update = {
      productName,
      productDescriptions,
      productPrice,
      productTotalStock,
      productDiscount,
      categoryId,
    };

    if (req.file) {
      updateData.productImage = req.file.filename;
    }

    await Product.update(updateData, {
      where: {
        productId: id,
      },
    });

    res.status(200).json({
      message: "Product updated successfully",
    });
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const datas = await Product.findAll({
      where: {
        productId: id,
      },
    });

    if (datas.length === 0) {
      res.status(404).json({
        message: "Products fetched successfully",
      });
      return;
    } else {
      await Product.destroy({
        where: {
          productId: id,
        },
      });
      res.status(200).json({
        message: "Product deleted successfully",
      });
    }
  }
}

export default new ProductController;
