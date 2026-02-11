
import { Router } from "express";
import { requestOTP, confirmOTP } from "./otp.controller";

const router = Router();

router.post("/request", requestOTP);
router.post("/verify", confirmOTP);

export default router;
