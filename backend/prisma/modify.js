import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

export const addUser = async (user) => {
  await prisma.User.create({
    data: {
      id: uuidv4(),
      email: user.email,
      password: user.password,
    },
  });
};

addUser({}).then(() => {
  prisma.$disconnect();
});
