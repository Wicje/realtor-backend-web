import { Request, Response } from "express";
import { signupService, loginService } from "./auth.service";
import { signupSchema, loginSchema } from "./auth.validator";

export const signup = async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);
    const result = await signupService(data.email, data.password);

    const slug = email.split("@")[0] + "-" + Date.now(); ///this slug should be moved i think

    res.status(201).json({
      message: "Realtor account created",
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginService(data.email, data.password);

    res.json({
      message: "Login successful",
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

