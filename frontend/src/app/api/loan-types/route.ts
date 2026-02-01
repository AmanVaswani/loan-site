import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 'personal', name: 'Personal Loan', minAmount: 50000, maxAmount: 4000000, interestRate: '10.5% - 18%' },
    { id: 'home', name: 'Home Loan', minAmount: 500000, maxAmount: 100000000, interestRate: '8.5% - 10%' },
    { id: 'business', name: 'Business Loan', minAmount: 100000, maxAmount: 50000000, interestRate: '12% - 20%' },
    { id: 'car', name: 'Car Loan', minAmount: 100000, maxAmount: 10000000, interestRate: '9% - 14%' },
    { id: 'education', name: 'Education Loan', minAmount: 100000, maxAmount: 7500000, interestRate: '8% - 12%' },
    { id: 'gold', name: 'Gold Loan', minAmount: 10000, maxAmount: 5000000, interestRate: '7% - 12%' }
  ]);
}
