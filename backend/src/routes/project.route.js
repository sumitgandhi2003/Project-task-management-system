import express from "express";
import {
  createProject,
  getAllProjects,
} from "../controller/project.controller.js";
import userAuthentication from "../middleware/userAuthentication.js";
const router = express.Router();
router.route("/create-project").post(userAuthentication, createProject);
router.route("/get-projects").get(userAuthentication, getAllProjects);
export default router;
