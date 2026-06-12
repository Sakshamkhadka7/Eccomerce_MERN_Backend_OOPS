import express from "express";

const app=express();

import "./database/connection.js";
import userRouter from "./routes/userRoute.js";
app.use(express.json())
app.use("/api/auth",userRouter)

export default app