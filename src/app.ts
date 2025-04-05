import { DB } from "./database/database";
import express from "express";
import { responseInterceptor } from "./errorHandlers/responseInterceptor";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth";
import ProfileRouter from "./routes/profile";
import GroupRouter from "./routes/group";
import QuestionRouter from "./routes/questions";
import AnswerRouter from "./routes/answers";
import GameRouter from "./routes/game";
import cors from "cors";

const app = express();
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());
app.use(responseInterceptor);
app.use(cookieParser());

app.use("/api/auth", AuthRouter);
app.use("/api/profile", ProfileRouter);
app.use("/api/group", GroupRouter);
app.use("/api/que", QuestionRouter);
app.use("/api/ans", AnswerRouter);
app.use("/api/game", GameRouter);

const connectDB = async () => {
  try {
    await DB.connect();
    console.log("Connected to database");
    app.listen(8080, () => {
      console.log("server running");
    });
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
connectDB();
