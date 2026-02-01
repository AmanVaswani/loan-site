'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { submitApplication } from '@/lib/api';

const applicationSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number').optional().or(z.literal('')),
  loanType: z.string().min(1, 'Please select a loan type'),
  loanAmount: z.string().min(1, 'Please enter loan amount'),
  employmentType: z.string().optional(),
  monthlyIncome: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode').optional().or(z.literal('')),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const loanTypes = [
  { id: 'personal', name: 'Personal Loan' },
  { id: 'home', name: 'Home Loan' },
  { id: 'business', name: 'Business Loan' },
  { id: 'car', name: 'Car Loan' },
  { id: 'education', name: 'Education Loan' },
  { id: 'gold', name: 'Gold Loan' },
];

const employmentTypes = [
  { id: 'salaried', name: 'Salaried' },
  { id: 'self-employed', name: 'Self Employed' },
  { id: 'business', name: 'Business Owner' },
  { id: 'professional', name: 'Professional' },
];

interface FileUploadState {
  panCard: File | null;
  aadharCard: File | null;
  itr: File | null;
  bankStatement: File | null;
}

interface ApplicationFormProps {
  defaultLoanType?: string;
}

export default function ApplicationForm({ defaultLoanType }: ApplicationFormProps) {
  const [files, setFiles] = useState<FileUploadState>({
    panCard: null,
    aadharCard: null,
    itr: null,
    bankStatement: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      loanType: defaultLoanType || '',
    },
  });

  const handleFileChange = (fieldName: keyof FileUploadState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload PDF, JPEG, or PNG files only');
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setFiles((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const removeFile = (fieldName: keyof FileUploadState) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);

    try {
      const result = await submitApplication({
        ...data,
        loanAmount: parseFloat(data.loanAmount),
        monthlyIncome: data.monthlyIncome ? parseFloat(data.monthlyIncome) : undefined,
        panCard: files.panCard || undefined,
        aadharCard: files.aadharCard || undefined,
        itr: files.itr || undefined,
        bankStatement: files.bankStatement || undefined,
      });

      setSubmitStatus('success');
      setApplicationId(result.applicationId);
      reset();
      setFiles({
        panCard: null,
        aadharCard: null,
        itr: null,
        bankStatement: null,
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
          <CheckCircle className="text-green-600" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for your application. Our team will contact you within 24 hours via phone or WhatsApp.
        </p>
        {applicationId && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Your Application ID</p>
            <p className="text-lg font-mono font-bold text-blue-600">{applicationId}</p>
          </div>
        )}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            <strong>Remember:</strong> You&apos;re eligible for 10-20% cashback on your first 3 EMIs!
          </p>
        </div>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Application Form</h2>

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-800 font-medium">Submission Failed</p>
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              {...register('fullName')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="10-digit mobile number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input
              type="tel"
              {...register('whatsapp')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="WhatsApp number (if different)"
            />
            {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>}
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Loan Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type *</label>
            <select
              {...register('loanType')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Select loan type</option>
              {loanTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {errors.loanType && <p className="text-red-500 text-sm mt-1">{errors.loanType.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹) *</label>
            <input
              type="number"
              {...register('loanAmount')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter required amount"
            />
            {errors.loanAmount && <p className="text-red-500 text-sm mt-1">{errors.loanAmount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <select
              {...register('employmentType')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Select employment type</option>
              {employmentTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹)</label>
            <input
              type="number"
              {...register('monthlyIncome')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter monthly income"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Address Information</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              {...register('city')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              {...register('state')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              {...register('pincode')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="6-digit pincode"
            />
            {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Upload Documents</h3>
        <p className="text-sm text-gray-500 mb-4">Upload PDF, JPEG, or PNG files (Max 10MB each)</p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* PAN Card */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <label className="block cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="text-gray-400" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">PAN Card</p>
                    <p className="text-sm text-gray-500">
                      {files.panCard ? files.panCard.name : 'Click to upload'}
                    </p>
                  </div>
                </div>
                {files.panCard && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeFile('panCard'); }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="text-gray-500" size={20} />
                  </button>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange('panCard')}
                className="hidden"
              />
            </label>
          </div>

          {/* Aadhaar Card */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <label className="block cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="text-gray-400" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">Aadhaar Card</p>
                    <p className="text-sm text-gray-500">
                      {files.aadharCard ? files.aadharCard.name : 'Click to upload'}
                    </p>
                  </div>
                </div>
                {files.aadharCard && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeFile('aadharCard'); }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="text-gray-500" size={20} />
                  </button>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange('aadharCard')}
                className="hidden"
              />
            </label>
          </div>

          {/* ITR */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <label className="block cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="text-gray-400" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">ITR (Income Tax Return)</p>
                    <p className="text-sm text-gray-500">
                      {files.itr ? files.itr.name : 'Click to upload'}
                    </p>
                  </div>
                </div>
                {files.itr && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeFile('itr'); }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="text-gray-500" size={20} />
                  </button>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange('itr')}
                className="hidden"
              />
            </label>
          </div>

          {/* Bank Statement */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <label className="block cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="text-gray-400" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">Bank Statement (6 months)</p>
                    <p className="text-sm text-gray-500">
                      {files.bankStatement ? files.bankStatement.name : 'Click to upload'}
                    </p>
                  </div>
                </div>
                {files.bankStatement && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeFile('bankStatement'); }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="text-gray-500" size={20} />
                  </button>
                )}
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange('bankStatement')}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Cashback Info */}
      <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          <strong>Special Offer:</strong> Get 10-20% cashback on your first 3 EMIs when your loan is approved through us!
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Submitting...</span>
          </>
        ) : (
          <span>Submit Application</span>
        )}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        By submitting, you agree to our Terms of Service and Privacy Policy.
        Our team will contact you via phone or WhatsApp within 24 hours.
      </p>
    </form>
  );
}
