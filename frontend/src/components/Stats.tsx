'use client';

import { Users, IndianRupee, Building, Award } from 'lucide-react';

const stats = [
  {
    icon: IndianRupee,
    value: '250+',
    label: 'Crores Disbursed',
    suffix: 'Cr',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Users,
    value: '15,000+',
    label: 'Loans Disbursed',
    suffix: '',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Award,
    value: '12,500+',
    label: 'Happy Customers',
    suffix: '',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Building,
    value: '25+',
    label: 'Bank Partners',
    suffix: '',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

export default function Stats() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600">
            Our numbers speak for themselves
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg card-hover text-center"
            >
              <div className={`inline-flex p-4 rounded-full ${stat.bgColor} mb-4`}>
                <stat.icon className={stat.color} size={32} />
              </div>
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Cashback Highlight */}
        <div className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              45+ Lakhs Cashback Given to Customers!
            </h3>
            <p className="text-lg mb-6">
              Get 10-20% cashback on your first 3 EMIs when you take a loan through us.
              Limited time offer!
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-full font-semibold">
              Join 12,500+ Happy Customers Today
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
