import { hashPassword, verifyPassword } from "../utils/encrypt.js";
import { verifyToken } from "../utils/generatetoken.js";
import { addUser } from "../../prisma/modify.js";
import { secreToken } from "../utils/generatetoken.js";
import { mailer } from "../utils/mailer.js";
import prisma from "../utils/prisma.js";
import dotenv from "dotenv";
dotenv.config();

class Authcontroller {
  register = async (req, res) => {
    const { email, password } = req.body;
    console.log(`registration attempt for ${email}`);
    try {
      console.log(`check for existing user`);
      const existUser = await prisma.user.findUnique({
        where: { email: email },
      });
      if (existUser) {
        console.log(`user already exists`);
        return res.status(400).json({ msg: "user exists" });
      }

      console.log("hashing password");
      const hashedPassword = await hashPassword(password);

      console.log("creating new user");
      const user = await addUser({ email, password: hashedPassword });
      console.log("saving user to database");
      if (user) {
        console.log(`user saved successfully ${user.id}`);
      }

      // Debug environment variables
      console.log("Environment variables check:");
      console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set");
      console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not set");
      console.log("CLIENT_URL:", process.env.CLIENT_URL ? "Set" : "Not set");

      if (
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS &&
        process.env.CLIENT_URL
      ) {
        console.log("sending verification mail");
        const token = secreToken(user.id);
        const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
        await mailer(verifyUrl, email);
        return res.status(201).json({
          msg: "Registered successfully verification mail has been sent",
        });
      } else {
        console.log("Missing environment variables for email configuration");
        return res.status(201).json({
          msg: "Registered successfully (verification mail has not been configured)",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific Prisma errors
      if (error.code === "P1001") {
        return res.status(503).json({
          msg: "Database connection timeout. Please try again.",
          error: "Connection pool exhausted",
        });
      }

      if (error.code === "P2002") {
        return res.status(400).json({
          msg: "User with this email already exists",
          error: "Duplicate email",
        });
      }

      return res.status(500).json({
        msg: "Internal server error",
        error: error.message,
      });
    }
  };

  verify_email = async (req, res) => {
    const { token } = req.params;
    try {
      console.log("Verifying token:", token);
      const verification = verifyToken(token);
      console.log("Token verification result:", verification);

      if (!verification || !verification.id) {
        return res.status(400).json({ msg: "Invalid or expired token" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: verification.id },
        data: { verified: true },
      });
      return res.status(200).json({ msg: "Email verified successfully" });
    } catch (err) {
      console.error("Email verification error:", err);
      if (err.name === "JsonWebTokenError") {
        return res.status(400).json({ msg: "Invalid token" });
      }
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({ msg: "Token has expired" });
      }
      return res
        .status(500)
        .json({ msg: "Something went wrong", error: err.message });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
      }

      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.status(400).json({ msg: "Credentials does not match" });
      }

      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ msg: "Credentials does not match" });
      }

      if (user.verified !== true) {
        return res.status(400).json({ msg: "User not verified" });
      }

      const token = secreToken(user.id);
      return res.status(200).json({ msg: "Logged in successfully", token });
    } catch (err) {
      console.error("Login error:", err);
      return res
        .status(500)
        .json({ msg: "Something went wrong", error: err.message });
    }
  };

  getUserById = async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(400).json({ msg: "User id is required" });
      }

      const user = await prisma.user.findUnique({
        where: { id: id },
        select: { id: true, email: true, verified: true },
      });
      if (!user) {
        return res.status(404).json({ msg: "User not Found!" });
      }
      return res.status(200).json(user);
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Something went wrong", error: err.message });
    }
  };

  logout = (req, res) => {
    res.status(200).json({ msg: "Logout successful (client clears token)" });
  };
}

export default Authcontroller;
