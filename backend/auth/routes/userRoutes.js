import express from "express";
import Authcontroller from "../controllers/authcontroller.js";

const router = express.Router();
const authController = new Authcontroller();

//register
router.post("/register", authController.register);
//login
router.post("/login", authController.login);
//get user
router.get("/user/:id", authController.getUserById);
//logout
router.post("/logout", authController.logout);

export default router;
