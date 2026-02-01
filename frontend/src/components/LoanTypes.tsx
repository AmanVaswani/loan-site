'use client';

import Link from 'next/link';
import { Home, Briefcase, Car, GraduationCap, Coins, User, ArrowRight } from 'lucide-react';

const loanTypes = [
  {
    id: 'personal',
    name: 'Personal Loan',
    icon: User,
    description: 'Quick personal loans for any purpose with minimal documentation',
    interestRate: '10.5% - 18%',
    amount: 'Up to 40 Lakhs',
    tenure: 'Up to 5 Years',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'home',
    name: 'Home Loan',
    icon: Home,
    description: 'Make your dream home a reality with our affordable home loans',
    interestRate: '8.5% - 10%',
    amount: 'Up to 10 Crores',
    tenure: 'Up to 30 Years',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'business',
    name: 'Business Loan',
    icon: Briefcase,
    description: 'Fuel your business growth with flexible business loans',
    interestRate: '12% - 20%',
    amount: 'Up to 5 Crores',
    tenure: 'Up to 7 Years',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'car',
    name: 'Car Loan',
    icon: Car,
    description: 'Drive your dream car with our low-interest car loans',
    interestRate: '9% - 14%',
    amount: 'Up to 1 Crore',
    tenure: 'Up to 7 Years',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'education',
    name: 'Education Loan',
    icon: GraduationCap,
    description: 'Invest in your future with our education loans',
    interestRate: '8% - 12%',
    amount: 'Up to 75 Lakhs',
    tenure: 'Up to 15 Years',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'gold',
    name: 'Gold Loan',
    icon: Coins,
    description: 'Get instant cash against your gold at the best rates',
    interestRate: '7% - 12%',
    amount: 'Up to 50 Lakhs',
    tenure: 'Up to 3 Years',
    color: 'from-yellow-500 to-yellow-600',
  },
];

export default function LoanTypes() {
  return (
    <section id="loans" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
            Our Loan Products
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find the Perfect Loan for Your Needs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of loan products with competitive interest rates and flexible repayment options
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loanTypes.map((loan) => (
            <div
              key={loan.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100"
            >
              <div className={`bg-gradient-to-r ${loan.color} p-6`}>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <loan.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{loan.name}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-6">{loan.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Interest Rate</span>
                    <span className="font-semibold text-gray-900">{loan.interestRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Loan Amount</span>
                    <span className="font-semibold text-gray-900">{loan.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Tenure</span>
                    <span className="font-semibold text-gray-900">{loan.tenure}</span>
                  </div>
                </div>

                <Link
                  href={`/apply?type=${loan.id}`}
                  className="flex items-center justify-center w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-colors group"
                >
                  Apply Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
