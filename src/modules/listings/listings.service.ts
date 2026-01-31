import { Property } from "./listings.types";
import { randomUUID } from "crypto";

// MVP in-memory store
const properties: Property[] = [];

export const createProperty = (
  realtorId: string,
  data: Omit<Property, "id" | "realtorId" | "createdAt">
) => {
  const property: Property = {
    id: randomUUID(),
    realtorId,
    title: data.title,
    description: data.description,
    price: data.price,
    createdAt: new Date(),
  };

  properties.push(property);
  return property;
};

export const getMyProperties = (realtorId: string) => {
  return properties.filter(p => p.realtorId === realtorId);
};

export const getPropertyById = (id: string) => {
  return properties.find(p => p.id === id);
};

