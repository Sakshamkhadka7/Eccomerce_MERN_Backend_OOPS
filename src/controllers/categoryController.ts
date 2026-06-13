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

  async seedCategory():Promise<void>{
    const datas=await Category.findAll();
    if(datas.length ===0){
        await Category.bulkCreate(this.categoryData)
        console.log("Category is seeded");
    }else{
        console.log("Categories already seed");
    }
  }

}
