import express from "express";
import { createProject } from "../controller/project.controller.js";
import userAuthentication from "../middleware/userAuthentication.js";
const router = express.Router();
router.route("/create-project").post(userAuthentication, createProject);
export default router;
