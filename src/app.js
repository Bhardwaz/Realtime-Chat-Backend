import expres from "express";
const app = expres();
import cors from "cors";
import { errorHandler, notFound } from "./misc/error.middleware.js";
// import router
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import dotenv from "dotenv";
dotenv.config();
// middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(expres.json({ limit: "20kb" }));
app.use(expres.urlencoded({ extended: true }));

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

app.use(notFound);
app.use(errorHandler);
export { app };
