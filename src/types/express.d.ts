
import { Role, Plan } from "../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
        plan: Plan;
      };
    }
  }
}
