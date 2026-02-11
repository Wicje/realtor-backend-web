
import {
  togglePropertyVisibility,
  allowClientAccess,
  removeClientAccess,
} from "./property.visibility.service";


export const toggleVisibility = async (req, res) => {
  const { id } = req.params;
  const { isPublic } = req.body;

  try {
    const property = await togglePropertyVisibility(
      id,
      req.user.id,
      isPublic
    );

    res.json(property);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const allowAccess = async (req, res) => {
  const { id } = req.params;
  const { phone } = req.body;

  try {
    const result = await allowClientAccess(id, req.user.id, phone);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const removeAccess = async (req, res) => {
  const { id } = req.params;
  const { phone } = req.body;

  try {
    const result = await removeClientAccess(id, req.user.id, phone);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
