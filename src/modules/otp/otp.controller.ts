
import { Request, Response } from "express";
import { generateOTP, verifyOTP } from "./otp.service";

export const requestOTP = async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone is required" });
  }

  generateOTP(phone);

  res.json({ message: "OTP sent" });
};

export const confirmOTP = async (req: Request, res: Response) => {
  const { phone, code } = req.body;

  try {
    verifyOTP(phone, code);
    res.json({ message: "Phone verified" });


await prisma.phoneVerification.upsert({
  where: { phone },
  update: { verified: true },
  create: { phone, verified: true },
});// is this the right place

  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
