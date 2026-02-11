
export interface Lead {
  id: string;
  realtorId: string;
  propertyId: string;

  phone: string;
  message: string;

  isPhoneVerified: boolean;

  createdAt: Date;
}
