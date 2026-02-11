
export type AnalyticsEventType = "VISIT" | "LEAD";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;

  realtorId: string;
  propertyId?: string;

  createdAt: Date;
}
