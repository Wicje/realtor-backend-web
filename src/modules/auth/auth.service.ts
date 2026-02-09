import { User } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/token";
import { randomUUID } from "crypto";
import { prisma } from "../../config/db";


export const signupService = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "REALTOR",
      plan: "FREE",
    },
  });

  const token = generateToken({
    userId: user.id,
    role: user.role,
    plan: user.plan,
  });

  return { user, token };
};


export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
    plan: user.plan,
  });

  return { user, token };
};

