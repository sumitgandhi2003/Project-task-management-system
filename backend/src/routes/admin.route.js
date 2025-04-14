import express from "express";
const router = express.Router();
import {
  getTeamUser,
  getTeamMemberOfProject,
} from "../controller/admin.contoller.js";
import userAuthentication from "../middleware/userAuthentication.js";
router.route("/get-team-user").get(userAuthentication, getTeamUser);
router
  .route("/get-project-members")
  .get(userAuthentication, getTeamMemberOfProject);
export default router;
