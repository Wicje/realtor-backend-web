export type Role = "REALTOR"; // for now, we only have one type

export interface User {
  id: string;        // unique identifier
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

