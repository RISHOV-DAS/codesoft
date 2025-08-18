import express from "express";
import Authcontroller from "../controllers/authcontroller.js";

const router = express.Router();
const authController = new Authcontroller();

//register
router.post("/register", authController.register);
//verify email
router.get("/verify-email/:token", authController.verify_email);
//login
router.post("/login", authController.login);
//get user
router.get("/user/:id", authController.getUserById);
//logout
router.post("/logout", authController.logout);

export default router;
