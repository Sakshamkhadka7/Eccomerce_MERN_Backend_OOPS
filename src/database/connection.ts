import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config.js";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/userModel.js";
import Order from "./models/orderModel.js";
import Category from "./models/categoryModel.js";
import Product from "./models/productModel.js";
import Payment from "./models/paymentModel.js";
import OrderDetails from "./models/orderDetailModel.js";
import Cart from "./models/cartModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(envConfig.connectionString as string, {
  models: [__dirname + "/models"],
});

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Authentication is right");
    })
    .catch((err) => {
      console.log("Error occured at connection", err);
    });
} catch (error) {
  console.log("Error occured ar connection of sequelize", error);
}

sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("Synced");
});

//User and Order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "orderId" });

// Category and Product
Category.hasOne(Product, { foreignKey: "productId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// Payment and Order
Payment.hasOne(Order, { foreignKey: "orderId" });
Order.belongsTo(Payment, { foreignKey: "paymentId" });

// Product and OrderDetails
Product.hasMany(OrderDetails, { foreignKey: "orderDeatailsId" });
OrderDetails.belongsTo(Product, { foreignKey: "productId" });

// User and Cart
User.hasOne(Cart, { foreignKey: "cartId" });
Cart.belongsTo(User, { foreignKey: "userId" });

// Cart and Product
Product.hasMany(Cart, { foreignKey: "cartId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

export default sequelize;
