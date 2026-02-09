
export const requirePropertyLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const plan = PLANS[user.plan];

  const myProperties = await getMyProperties(user.userId);

  if (myProperties.length >= plan.maxProperties) {
    return res.status(403).json({
      error: "Property limit reached. Upgrade your plan.",
    });
  }

  next();
};

