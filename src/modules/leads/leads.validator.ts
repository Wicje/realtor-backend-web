
import { z } from "zod";

export const createLeadSchema = z.object({
  phone: z.string().min(8),
  message: z.string().min(3),
  propertyId: z.string().uuid(),
});
