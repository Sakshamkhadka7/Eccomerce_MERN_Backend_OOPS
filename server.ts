import "reflect-metadata";

import app from "./src/app.js";
import { envConfig } from "./src/config/config.js";
import adminSeeder from "./adminSeeder.js";
import categoryController from "./src/controllers/categoryController.js";

function startServer() {
  const PORT = envConfig.port || 6000;

  app.listen(PORT, () => {
    categoryController.seedCategory();
    console.log(`port is running on ${PORT} port`);
    adminSeeder();
  });
}

startServer();
