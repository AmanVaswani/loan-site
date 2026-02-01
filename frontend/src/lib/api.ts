// Use relative URLs - works with Vercel API routes
const API_URL = '';

export interface LoanApplication {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  loanType: string;
  loanAmount: number;
  employmentType?: string;
  monthlyIncome?: number;
  city?: string;
  state?: string;
  pincode?: string;
  panCard?: File;
  aadharCard?: File;
  itr?: File;
  bankStatement?: File;
}

export interface Stats {
  totalDisbursed: number;
  amountDisbursed: number;
  happyCustomers: number;
  bankPartners: number;
  averageInterestRate: number;
  cashbackGiven: number;
}

export interface LoanType {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  interestRate: string;
}

export async function getStats(): Promise<Stats> {
  const response = await fetch(`${API_URL}/api/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

export async function getLoanTypes(): Promise<LoanType[]> {
  const response = await fetch(`${API_URL}/api/loan-types`);
  if (!response.ok) throw new Error('Failed to fetch loan types');
  return response.json();
}

export async function submitApplication(data: LoanApplication): Promise<{ success: boolean; applicationId: string; message: string }> {
  const formData = new FormData();

  // Add text fields
  formData.append('fullName', data.fullName);
  formData.append('email', data.email);
  formData.append('phone', data.phone);
  formData.append('whatsapp', data.whatsapp || data.phone);
  formData.append('loanType', data.loanType);
  formData.append('loanAmount', data.loanAmount.toString());

  if (data.employmentType) formData.append('employmentType', data.employmentType);
  if (data.monthlyIncome) formData.append('monthlyIncome', data.monthlyIncome.toString());
  if (data.city) formData.append('city', data.city);
  if (data.state) formData.append('state', data.state);
  if (data.pincode) formData.append('pincode', data.pincode);

  // Add files
  if (data.panCard) formData.append('panCard', data.panCard);
  if (data.aadharCard) formData.append('aadharCard', data.aadharCard);
  if (data.itr) formData.append('itr', data.itr);
  if (data.bankStatement) formData.append('bankStatement', data.bankStatement);

  const response = await fetch(`${API_URL}/api/applications`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || 'Failed to submit application');
  }

  return response.json();
}

export async function getApplicationStatus(applicationId: string) {
  const response = await fetch(`${API_URL}/api/applications?id=${applicationId}`);
  if (!response.ok) throw new Error('Application not found');
  return response.json();
}
