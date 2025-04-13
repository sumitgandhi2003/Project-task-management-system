import express from "express";
const router = express.Router();
import { getTeamUser } from "../controller/admin.contoller.js";
import userAuthentication from "../middleware/userAuthentication.js";
router.route("/get-team-user").get(userAuthentication, getTeamUser);
export default router;
