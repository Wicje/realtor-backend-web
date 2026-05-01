import { Response } from "express";

type Client = {
  key: string;
  res: Response;
};

const clients = new Map<string, Set<Client>>();

export const addRealtimeClient = (roomId: string, key: string, res: Response) => {
  const set = clients.get(roomId) ?? new Set<Client>();
  const client = { key, res };
  set.add(client);
  clients.set(roomId, set);

  return () => {
    const current = clients.get(roomId);
    if (!current) return;

    for (const c of current) {
      if (c.key === key) {
        current.delete(c);
      }
    }

    if (current.size === 0) clients.delete(roomId);
  };
};

export const broadcastRealtime = (roomId: string, event: string, payload: unknown) => {
  const set = clients.get(roomId);
  if (!set) return;

  const message = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of set) {
    client.res.write(message);
  }
};
