import "reflect-metadata";

import app from "./src/app.js";
import { envConfig } from "./src/config/config.js";
import adminSeeder from "./adminSeeder.js";
import categoryController from "./src/controllers/categoryController.js";
import { Server } from "socket.io";

function startServer() {
  const PORT = envConfig.port || 6000;

 const server=app.listen(PORT, () => {
    categoryController.seedCategory();
    console.log(`port is running on ${PORT} port`);
    adminSeeder();
  });
   
  const io=new Server(server,{
    cors:{
      origin:'http://localhost:5173'
    }
  });

  io.on("connection",()=>{
    console.log("Client is connected");
  })


}

startServer();
