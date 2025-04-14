import express from "express";
import {
  loginUser,
  registerUser,
  getActiveUser,
} from "../controller/auth.controller.js";
import userAuthentication from "../middleware/userAuthentication.js";
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/check-auth").get(userAuthentication, getActiveUser);
export default router;
