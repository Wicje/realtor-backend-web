import { Request, Response } from "express";
import { getPublicRealtorPage, getPublicProperty } from "./public.service";
import { trackEvent } from "../analytics/analytics.service";

export const publicRealtorPage = async (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const { type, priceMode, minPrice, maxPrice } = req.query;

  try {
    const result = await getPublicRealtorPage(slug, {
      type: typeof type === "string" ? type : undefined,
      priceMode: typeof priceMode === "string" ? priceMode : undefined,
      minPrice: typeof minPrice === "string" ? Number(minPrice) : undefined,
      maxPrice: typeof maxPrice === "string" ? Number(maxPrice) : undefined,
    });

    return res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Resource not found";
    return res.status(404).json({ error: message });
  }
};

export const publicProperty = async (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  try {
    const property = await getPublicProperty(slug, id);

    await trackEvent("VISIT", property.realtorId, property.id);

    return res.json(property);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Resource not found";
    return res.status(404).json({ error: message });
  }
};
