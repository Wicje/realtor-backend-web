import { Request, Response } from "express";
import { getPublicRealtorPage } from "./public.service";
import { trackEvent } from "../analytics/analytics.service";

export const publicRealtorPage = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { type, priceMode, minPrice, maxPrice } = req.query;

  try {
    const result = await getPublicRealtorPage(slug, {
      type: type as string,
      priceMode: priceMode as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });

    res.json(result);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const publicProperty = async (req: Request, res: Response) => {
  const { slug, id } = req.params;

  try {
    const property = await getPublicProperty(slug, id);

    await trackEvent("VISIT", property.realtorId, property.id);

    res.json(property);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
