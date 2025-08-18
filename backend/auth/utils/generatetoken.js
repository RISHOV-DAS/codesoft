import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const secreToken = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return accessToken;
};

export const verifyToken = (token) => {
  const id = jwt.verify(token, process.env.JWT_SECRET);
  return id;
};
