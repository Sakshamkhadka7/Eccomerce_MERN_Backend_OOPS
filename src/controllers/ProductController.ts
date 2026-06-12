import { Request, Response } from "express";

class ProductController {
    async createController(req:Request,res:Response){
        const {productName,productDescriptions,productPrice,productTotalStock,productDiscount}=req.body;
        

    }
}