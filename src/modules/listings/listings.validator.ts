
import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),

  type: z.enum([
    "SHOP",
    "RESIDENTIAL",
    "WAREHOUSE",
    "DUPLEX",
    "BUNGALOW",
    "LAND",
  ]),

  size: z.string().min(1),
  furnished: z.boolean(),

  price: z.number().positive(),
  priceMode: z.enum(["RENT", "LEASE", "ONE_TIME"]),

  state: z.string(),
  city: z.string(),
  street: z.string(),

  images: z.array(z.string().url()).min(1),
});
