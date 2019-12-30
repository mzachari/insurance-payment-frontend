export interface Insurance {
  premiumPercentage: number;
  insuredAmount: number;
  insurancePlanNumber: string;
  insuranceStartDate: Date;
  insuranceEndDate: Date;
  farmId: string;
  insuranceProvider: string; // example ICICI Lombard Policy
  isFormComplete: number;
  farmerId: string;
  imagePath: string;
  id: string;
  insuranceId: string;
  _id: string;
  cropName: string;
  // polygonSchema?
}
