import { v4 as uuidv4 } from "uuid";
import prisma from "../auth/utils/prisma.js";

export const addUser = async (user) => {
  const createdUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: user.email,
      password: user.password,
    },
  });
  return createdUser;
};
