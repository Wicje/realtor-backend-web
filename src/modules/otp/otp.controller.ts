import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { generateOTP, verifyOTP } from "./otp.service";

export const requestOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone is required" });
  }

  generateOTP(phone);

  return res.json({ message: "OTP sent" });
};

export const confirmOTP = async (req: Request, res: Response) => {
  const { phone, code } = req.body;

  try {
    verifyOTP(phone, code);

    await prisma.phoneVerification.upsert({
      where: { phone },
      update: { verified: true },
      create: { phone, verified: true },
    });

    return res.json({ message: "Phone verified" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid OTP";
    return res.status(400).json({ error: message });
  }
};
