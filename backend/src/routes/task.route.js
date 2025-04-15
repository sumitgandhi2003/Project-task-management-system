import express from "express";
import { createTask, getAllTask } from "../controller/task.controller.js";
import userAuthentication from "../middleware/userAuthentication.js";
const router = express.Router();

router.route("/create-task").post(userAuthentication, createTask);
router.route("/get-all-task").get(userAuthentication, getAllTask);
export default router;
