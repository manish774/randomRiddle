import { DB } from "./database/database";
import express from "express";
import { responseInterceptor } from "./errorHandlers/responseInterceptor";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import groupRouter from "./routes/group";
import QuestionRouter from "./routes/questions";
import AnswerRouter from "./routes/answers";

const app = express();
app.use(express.json());
app.use(responseInterceptor);
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/group", groupRouter);
app.use("/que", QuestionRouter);
app.use("/ans", AnswerRouter);

const connectDB = async () => {
  try {
    await DB.connect();
    console.log("Connected to database");
    app.listen(4000, () => {
      console.log("server running");
    });
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
connectDB();
