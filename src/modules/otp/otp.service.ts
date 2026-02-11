
const otpStore = new Map<string, { code: string; expiresAt: number }>();

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export const generateOTP = (phone: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  otpStore.set(phone, { code, expiresAt });

  // MOCK sending SMS (replace later)
  console.log(`📲 OTP for ${phone}: ${code}`);

  return true;
};

export const verifyOTP = (phone: string, code: string) => {
  const entry = otpStore.get(phone);

  if (!entry) {
    throw new Error("OTP not found or expired");
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    throw new Error("OTP expired");
  }

  if (entry.code !== code) {
    throw new Error("Invalid OTP");
  }

  otpStore.delete(phone);
  return true;
};
