import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config.js";

import User from "./models/userModel.js";
import Order from "./models/orderModel.js";
import Category from "./models/categoryModel.js";
import Product from "./models/productModel.js";
import Payment from "./models/paymentModel.js";
import OrderDetails from "./models/orderDetailModel.js";
import Cart from "./models/cartModel.js";

// Create Sequelize instance
const sequelize = new Sequelize(envConfig.connectionString as string, {
  models: [
    User,
    Order,
    Category,
    Product,
    Payment,
    OrderDetails,
    Cart
  ],
});


sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Authentication successful");
  })
  .catch((err) => {
    console.log("❌ Database connection error:", err);
  });

// Sync models 
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ Database synced");
  })

  .catch((err) => {
    console.log("❌ Sync error:", err);
  });


// User → Orders (1 user has many orders)
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Category → Products (1 category has many products)
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// Payment → Order (1 payment belongs to 1 order)
Order.hasOne(Payment, { foreignKey: "orderId" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

// Order → OrderDetails (1 order has many order items)
Order.hasMany(OrderDetails, { foreignKey: "orderId" });
OrderDetails.belongsTo(Order, { foreignKey: "orderId" });

// Product → OrderDetails
Product.hasMany(OrderDetails, { foreignKey: "productId" });
OrderDetails.belongsTo(Product, { foreignKey: "productId" });

// User → Cart (1 user has 1 cart)
User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

// Product → Cart (1 product can be in many carts)
Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

export default sequelize;