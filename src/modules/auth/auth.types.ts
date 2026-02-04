export type Role = "REALTOR";
export type Plan = "FREE" | "BASIC" | "PRO";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  plan: Plan;
  createdAt: Date;
}

