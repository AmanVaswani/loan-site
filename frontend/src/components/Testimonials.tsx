'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Mumbai',
    loanType: 'Home Loan',
    amount: '45 Lakhs',
    rating: 5,
    review: 'Got my home loan approved in just 3 days with an amazing interest rate of 8.75%. The team was extremely helpful throughout the process. Highly recommended!',
    avatar: 'RK',
  },
  {
    name: 'Priya Sharma',
    location: 'Delhi',
    loanType: 'Personal Loan',
    amount: '5 Lakhs',
    rating: 5,
    review: 'I received 15% cashback on my first 3 EMIs which was a pleasant surprise. The documentation process was smooth and the loan was disbursed quickly.',
    avatar: 'PS',
  },
  {
    name: 'Amit Patel',
    location: 'Bangalore',
    loanType: 'Business Loan',
    amount: '25 Lakhs',
    rating: 5,
    review: 'As a small business owner, getting a loan was always challenging. LoanEase helped me get the best rate from multiple banks. Their service is exceptional.',
    avatar: 'AP',
  },
  {
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    loanType: 'Car Loan',
    amount: '12 Lakhs',
    rating: 5,
    review: 'Bought my dream car with a loan from LoanEase. The interest rate was the lowest I could find anywhere. The cashback offer made it even better!',
    avatar: 'SR',
  },
  {
    name: 'Vikram Singh',
    location: 'Chennai',
    loanType: 'Education Loan',
    amount: '20 Lakhs',
    rating: 5,
    review: 'My daughter got admission to a top university abroad. LoanEase made the education loan process so simple. Very grateful for their support.',
    avatar: 'VS',
  },
  {
    name: 'Meera Joshi',
    location: 'Pune',
    loanType: 'Gold Loan',
    amount: '8 Lakhs',
    rating: 5,
    review: 'Needed urgent funds and got a gold loan approved within hours. The interest rate was better than what my bank was offering. Great service!',
    avatar: 'MJ',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join 12,500+ satisfied customers who got their loans with the best rates
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 card-hover relative"
            >
              <Quote className="absolute top-4 right-4 text-blue-100" size={48} />

              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                ))}
              </div>

              <p className="text-gray-600 mb-4 relative z-10">{testimonial.review}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-blue-600 font-medium">{testimonial.loanType}</span>
                <span className="text-sm text-gray-500">Loan: {testimonial.amount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-6">Partnered with India&apos;s Leading Banks</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'IndusInd', 'Federal'].map((bank) => (
              <div key={bank} className="px-6 py-3 bg-gray-100 rounded-lg font-bold text-gray-600">
                {bank}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
