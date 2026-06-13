import "reflect-metadata";

import app from "./src/app.js";
import { envConfig } from "./src/config/config.js";
import adminSeeder from "./adminSeeder.js";
import categoryController from "./src/controllers/categoryController.js";

function startServer() {
  const PORT = envConfig.port || 5000;

  app.listen(PORT, () => {
    categoryController.seedCategory();
    console.log(`${PORT} is running on 4000 port`);
    adminSeeder();
  });
}

startServer();
