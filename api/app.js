import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import postRouter from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import testRouter from "./routes/test.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/test", testRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
