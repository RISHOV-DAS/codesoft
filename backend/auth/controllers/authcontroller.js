import { hashPassword, verifyPassword } from "../utils/encrypt.js";
import { addUser } from "../../prisma/modify.js";
import { secreToken } from "../utils/generatetoken.js";
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
      return res.status(201).json({ msg: "Registered successfully" });
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
        select: { id: true, email: true },
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
