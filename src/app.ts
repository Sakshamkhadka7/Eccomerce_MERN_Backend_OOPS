import express from "express";

const app=express();

import "./database/connection.js";
import userRouter from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
app.use(express.json())
app.use("/api/auth",userRouter)
app.use("/api/category",categoryRoute)

export default app