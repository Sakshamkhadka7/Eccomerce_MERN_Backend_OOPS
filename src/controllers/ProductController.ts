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
  productPrice?: number;
  productTotalStock?: number;
  productDiscount?: number;
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
      !productTotalStock
    ) {
      res.status(400).json({
        message: "All fields are mandatory",
      });
      return;
    }

    const payload: Record<string, unknown> = {
      productName,
      productDescriptions,
      productPrice: Number(productPrice),
      productTotalStock: Number(productTotalStock),
      productDiscount: Number(productDiscount || 0),
      productImage: fileName,
    };

    if (categoryId && Object.prototype.hasOwnProperty.call(Product.rawAttributes, "categoryId")) {
      payload.categoryId = categoryId;
    }

    const product = await Product.create(payload);

    res.status(200).json({
      message: "Product created successfully",
      data: product,
    });
  }

  async getAllProduct(req: Request, res: Response) {
    const datas = await Product.findAll({
      include: {
        model: Category,
        attributes: ["categoryId", "categoryName"],
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
        attributes: ["categoryId", "categoryName"],
      },
    });

    res.status(200).json({
      message: "Product fetched successfully",
      data: datas,
    });
  }

  async updateProduct(req: Request, res: Response) {
    const { productId } = req.params;
    if (!productId) {
      res.status(403).json({
        message: "Id is required",
      });

      return;
    }

    const product = await Product.findOne({
      where: {
        productId: productId,
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

    const updateData: Record<string, unknown> = {
      productName,
      productDescriptions,
      productPrice: productPrice !== undefined ? Number(productPrice) : undefined,
      productTotalStock:
        productTotalStock !== undefined ? Number(productTotalStock) : undefined,
      productDiscount:
        productDiscount !== undefined ? Number(productDiscount) : undefined,
    };

    if (categoryId && Object.prototype.hasOwnProperty.call(Product.rawAttributes, "categoryId")) {
      updateData.categoryId = categoryId;
    }

    if (req.file) {
      updateData.productImage = req.file.filename;
    }

    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined && value !== ""),
    );

    await Product.update(cleanUpdateData, {
      where: {
        productId: productId,
      },
    });

    const updatedProduct = await Product.findByPk(productId, {
      include: {
        model: Category,
        attributes: ["categoryId", "categoryName"],
      },
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
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

export default new ProductController();
