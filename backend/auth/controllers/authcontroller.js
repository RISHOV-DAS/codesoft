import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/encrypt.js";
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

  login = async (req, res) => {};
}

export default Authcontroller;
