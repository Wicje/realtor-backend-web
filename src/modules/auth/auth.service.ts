import { User } from "./auth.types";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/token";
import { randomUUID } from "crypto";

// Temporary in-memory store (MVP ONLY)
const users: User[] = [];

export const signupService = async (email: string, password: string) => {
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const user: User = {
    id: randomUUID(),
    email,
    passwordHash,
    role: "REALTOR",
    createdAt: new Date(),
  };

  users.push(user);

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return { user, token };
};

export const loginService = async (email: string, password: string) => {
  const user = users.find(u => u.email === email);
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
  });

  return { user, token };
};

