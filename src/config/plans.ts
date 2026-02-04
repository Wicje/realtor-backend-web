export type PlanName = "FREE" | "BASIC" | "PRO";

interface PlanLimits {
  maxProperties: number;
}

export const PLANS: Record<PlanName, PlanLimits> = {
  FREE: {
    maxProperties: 3,
  },
  BASIC: {
    maxProperties: 50,
  },
  PRO: {
    maxProperties: 500,
  },
};

