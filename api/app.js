import express from "express";
import postRouter from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
app.use(express.json());

app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})


