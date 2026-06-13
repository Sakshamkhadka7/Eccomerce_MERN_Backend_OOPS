import "reflect-metadata"

import app from "./src/app.js";
import { envConfig } from "./src/config/config.js";
import adminSeeder from "./adminSeeder.js";

function startServer() {
  const PORT = envConfig.port || 5000;
  adminSeeder()
  app.listen(PORT, () => {
    console.log(`${PORT} is running on 4000 port`);
  });
}

startServer();
