import "reflect-metadata";

import app from "./src/app.js";
import { envConfig } from "./src/config/config.js";
import adminSeeder from "./adminSeeder.js";
import categoryController from "./src/controllers/categoryController.js";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./src/database/models/userModel.js";
import Order from "./src/database/models/orderModel.js";

function startServer() {
  const PORT = envConfig.port || 6000;

  const server = app.listen(PORT, () => {
    categoryController.seedCategory();
    console.log(`port is running on ${PORT} port`);
    adminSeeder();
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  let onlineUsers: { socketId: string; userId: string; role: string }[] = [];

  const addToOnlineUser = (socketId: string, userId: string, role: string) => {
    onlineUsers = onlineUsers.filter((online) => online.userId !== userId);
    onlineUsers.push({
      socketId,
      userId,
      role,
    });
  };

  io.on("connection", (socket) => {
    const token = socket.handshake.headers.token;
    if (token) {
      jwt.verify(
        token as string,
        envConfig.secretKey as string,
        async (err: any, result: any) => {
          console.log("Result -> ", result);
          if (err) {
            socket.emit("error", err);
          } else {
            const userData = await User.findByPk(result.userId);
            if (!userData) {
              socket.emit("Error , No user found with that token");
              return;
            }

            addToOnlineUser(socket.id, result.userId, userData.role);
            console.log(onlineUsers);
          }
        },
      );
    } else {
      socket.emit("error", "Please provide a token");
    }

    socket.on("updateOrderStatus", async(data) => {
      const { status, orderId, userId } = data;

      const findUser = onlineUsers.find((user) => user.userId == userId);
      if (findUser) {
      await  Order.update(
          {
            orderStaus:status,
          },
          {
            where: {
              orderId: orderId,
            },
          },
        );
        io.to(findUser.socketId).emit(
          "success",
          "Order status updated successfully",
        );
      } else {
        socket.emit("error", "User is not online");
      }
    });
  });
}

startServer();
