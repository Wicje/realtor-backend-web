
import { Request, Response } from "express";
import { createLeadSchema } from "./leads.validator";
import { createLead, getLeadsForRealtor } from "./leads.service";

export const submitLead = async (req: Request, res: Response) => {
  try {
    const data = createLeadSchema.parse(req.body);

    const lead = await createLead(
      data.propertyId,
      data.phone,
      data.message
    );

    res.status(201).json({
      message: "Lead submitted successfully",
      leadId: lead.id,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const myLeads = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const leads = await getLeadsForRealtor(user.userId);

  res.json(leads);
};
