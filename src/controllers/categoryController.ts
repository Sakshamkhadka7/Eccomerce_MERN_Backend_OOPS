import { Request, Response } from "express";
import Category from "../database/models/categoryModel.js";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronic",
    },
    {
      categoryName: "Foods",
    },
    {
      categoryName: "Groceries",
    },
  ];

  async seedCategory(): Promise<void> {
    const datas = await Category.findAll();
    if (datas.length === 0) {
      await Category.bulkCreate(this.categoryData);
      console.log("Category is seeded");
    } else {
      console.log("Categories already seed");
    }
  }

  async addCategory(req: Request, res: Response): Promise<void> {
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(403).json({
        message: "CategoryName is required",
      });
      return;
    }

    await Category.create({
      categoryName,
    });

    res.status(200).json({
      message: "Category is added",
    });
  }

  async getCategory(req: Request, res: Response) {
    const data = await Category.findAll();
    res.status(200).json({
      message: "Fetched categorty",
      data: data,
    });
  }

  async deleteCategory(req: Request, res: Response):Promise<void> {
    const { id } = req.params;
    console.log("Delete Id : ",id);
    if (!id) {
      res.status(400).json({
        message: "Please provide a ID",
      });

      return;
    }
    const data = await Category.findAll({
      where: {
        categoryId: id,
      },
    });

    if (data.length === 0) {
      res.status(404).json({
        message: "No category with that Id found",
      });
      return;
    } else {
      await Category.destroy({
        where: {
          categoryId:id,
        },
      });

      res.status(200).json({
        message: "category deleted successfully",
      });
    }
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { categoryName } = req.body;
    if (!id || !categoryName) {
      res.status(400).json({
        message: "Please provide a ID and categoryName",
      });

      return;
    }
    const data = await Category.findAll({
      where: {
        categoryId: id,
      },
    });

    if (data.length === 0) {
      res.status(404).json({
        message: "No category with that Id found",
      });
      return;
    } else {
      await Category.update(
        {
          categoryName: categoryName,
        },
        {
          where: {
            categoryId: id,
          },
        },
      );
    }
  }
}

export default new CategoryController();
