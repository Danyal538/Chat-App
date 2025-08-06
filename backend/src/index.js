import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

const Port = process.env.PORT;
const __dirName = path.resolve()

app.use(express.json({ limit: "10mb" }));
app.use(cors({
    origin: "https://chat-app-sigma-azure.vercel.app",
    credentials: true,
}))
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(Port, () => {
    console.log("Server is running at port:" + Port);
    connectDB();
});