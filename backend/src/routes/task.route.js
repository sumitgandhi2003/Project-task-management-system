import express from "express";
import { createTask } from "../controller/task.controller.js";
const router = express.Router();

router.route("/create-task").post();
