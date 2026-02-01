import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalDisbursed: 15000,
    amountDisbursed: 250,
    happyCustomers: 12500,
    bankPartners: 25,
    averageInterestRate: 8.5,
    cashbackGiven: 45
  });
}
