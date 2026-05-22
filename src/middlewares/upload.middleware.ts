import { Request, Response, NextFunction } from "express";

export const upload = {
  array: (_field: string, _maxCount: number) =>
    (_req: Request, _res: Response, next: NextFunction) => next(),
};
