import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import projectRoute from "./routes/project.route.js";
import errorHandler from "./middleware/errorHandler.js";
import adminRoute from "./routes/admin.route.js";
import taskRoute from "./routes/task.route.js";
const app = express();
console.log(process.env.CROSS_ORIGIN_URL);
app.use(cors({ origin: process.env.CROSS_ORIGIN_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.route("/").get((req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/task", taskRoute);
app.use(errorHandler);
export default app;
