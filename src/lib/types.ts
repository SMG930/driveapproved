export interface ApplicationFormData {
  // Step 1: Personal Info
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Step 2: Employment & Income
  employer: string;
  jobTitle: string;
  employmentStatus: string; // Full-time, Part-time, Self-employed, etc.
  monthlyIncome: number;
  employmentLength: string; // Less than 1 year, 1-3 years, 3+ years
  
  // Step 3: Vehicle Info
  hasSelectedVehicle: boolean;
  vehicleType?: string; // SUV, Sedan, Truck, etc.
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehiclePrice?: number;
  downPayment?: number;
  
  // Step 4: Documents
  payStubUrls: string[];
  bankStatementUrls: string[];
  idUrl: string;
  
  // Metadata
  createdAt: Date;
  status: 'New' | 'In Review' | 'Approved' | 'Declined';
  assignedTo?: string;
  aiSummary?: string;
  readinessScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
}

export interface UploadedDocument {
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}
