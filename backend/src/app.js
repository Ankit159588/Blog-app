import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import postRouter from "./routes/post.router.js";
import authRouter from "./routes/auth.router.js";
import cors from "cors";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("App is working");
});

app.use("/api", postRouter);
app.use("/api/auth", authRouter)

export default app;
