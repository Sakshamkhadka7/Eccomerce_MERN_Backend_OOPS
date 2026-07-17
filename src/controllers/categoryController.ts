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

    const category = await Category.create({
      categoryName,
    });

    res.status(200).json({
      message: "Category is added",
      data: category,
    });
  }

  async getCategory(req: Request, res: Response) {
    const data = await Category.findAll();
    res.status(200).json({
      message: "Fetched categorty",
      data: data,
    });
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    console.log("Delete Id : ", id);
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
          categoryId: id,
        },
      });

      res.status(200).json({
        message: "category deleted successfully",
      });
    }
  }

  async updateCategory(req: Request, res: Response) {
    const { categoryId } = req.params;
    const { categoryName } = req.body;
    if (!categoryId || !categoryName) {
      res.status(400).json({
        message: "Please provide a ID and categoryName",
      });

      return;
    }
    const data = await Category.findAll({
      where: {
        categoryId: categoryId,
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
            categoryId: categoryId,
          },
        },
      );

      const updatedCategory = await Category.findByPk(categoryId);

      res.status(200).json({
        message: "Category updated successfully",
        data: updatedCategory,
      });
    }
  }
}

export default new CategoryController();
