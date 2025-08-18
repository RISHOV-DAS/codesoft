import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/encrypt.js";
import { verifyToken } from "../utils/generatetoken.js";
import { addUser } from "../../prisma/modify.js";
import { secreToken } from "../utils/generatetoken.js";
import { mailer } from "../utils/mailer.js";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

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
        return res.status(201).json({
          msg: "Registered successfully (verification mail has not been configured)",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  verify_email = async (req, res) => {
    const { token } = req.params;
    try {
      const verification = verifyToken(token);
      await prisma.user.update({
        where: { id: verification.id },
        data: { verified: true },
      });
      return res.status(200).json({ msg: "Email verified successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "Somwething went wrong", error: err.message });
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
