import { randomInt, timingSafeEqual } from "crypto";

const otpStore = new Map<string, { code: string; expiresAt: number }>();
const otpRequestWindow = new Map<string, { count: number; resetAt: number }>();
const otpVerifyWindow = new Map<string, { count: number; resetAt: number }>();

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_REQUEST_LIMIT = 5;
const OTP_REQUEST_WINDOW_MS = 15 * 60 * 1000;
const OTP_VERIFY_LIMIT = 10;
const OTP_VERIFY_WINDOW_MS = 15 * 60 * 1000;

const hitWindow = (
  store: Map<string, { count: number; resetAt: number }>,
  key: string,
  limit: number,
  windowMs: number
) => {
  const current = store.get(key);
  const currentTs = Date.now();

  if (!current || currentTs > current.resetAt) {
    store.set(key, { count: 1, resetAt: currentTs + windowMs });
    return;
  }

  if (current.count >= limit) {
    throw new Error("Rate limit exceeded. Please try later.");
  }

  current.count += 1;
};

export const generateOTP = (phone: string) => {
  hitWindow(otpRequestWindow, phone, OTP_REQUEST_LIMIT, OTP_REQUEST_WINDOW_MS);

  const code = randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  otpStore.set(phone, { code, expiresAt });

  if (process.env.NODE_ENV !== "production") {
    console.log(`OTP generated for ${phone}`);
  }

  return true;
};

export const verifyOTP = (phone: string, code: string) => {
  hitWindow(otpVerifyWindow, phone, OTP_VERIFY_LIMIT, OTP_VERIFY_WINDOW_MS);

  const entry = otpStore.get(phone);

  if (!entry) {
    throw new Error("OTP not found or expired");
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    throw new Error("OTP expired");
  }

  const codeBuffer = Buffer.from(entry.code);
  const inputBuffer = Buffer.from(code);
  if (codeBuffer.length !== inputBuffer.length || !timingSafeEqual(codeBuffer, inputBuffer)) {
    throw new Error("Invalid OTP");
  }

  otpStore.delete(phone);
  return true;
};
