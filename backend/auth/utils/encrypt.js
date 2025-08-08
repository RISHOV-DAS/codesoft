import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (inputPassword, hashPassword) => {
  return await bcrypt.compare(inputPassword, hashPassword);
};
