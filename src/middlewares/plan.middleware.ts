
export const requirePropertyLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const plan = PLANS[user.plan];

  
const propertyCount = await prisma.property.count({
  where: { realtorId: user.userId },
});

if (propertyCount >= plan.maxProperties) 
 {
    return res.status(403).json({
      error: "Property limit reached. Upgrade your plan.",
    });
  }

  next();
};

