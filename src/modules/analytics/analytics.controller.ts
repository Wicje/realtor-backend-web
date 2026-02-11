
import { Request, Response } from "express";
import { getRealtorStats } from "./analytics.service";

export const myAnalytics = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { from, to } = req.query;

  const stats = await getRealtorStats(
    user.userId,
    from ? new Date(from as string) : undefined,
    to ? new Date(to as string) : undefined
  );

  res.json(stats);
};
