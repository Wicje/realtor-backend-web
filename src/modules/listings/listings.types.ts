
export type PropertyType =
  | "SHOP"
  | "RESIDENTIAL"
  | "WAREHOUSE"
  | "DUPLEX"
  | "BUNGALOW"
  | "LAND";

export type PriceMode =
  | "RENT"
  | "LEASE"
  | "ONE_TIME";

export interface Property {
  id: string;
  realtorId: string;

  title: string;
  description: string;

  type: PropertyType;
  size: string;
  furnished: boolean;


  price: number;
  priceMode: PriceMode;

  state: string;
  city: string;
  street: string;

  images: string[];

  visitors: number;
  totalLeads: number;

  createdAt: Date;
}


export type ListingStatus = "DRAFT" | "PUBLISHED";
