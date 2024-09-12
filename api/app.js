import express from "express";
import postRouter from "./routes/post.route";

const app = express();

app.use("/api/posts", postRouter);

console.log("Hi");

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

app.use("/api/test", (req, res) => {
  res.send("Hi");
});

