'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, CheckCircle2, AlertCircle, Loader2, X, Shield, Lock, FileCheck } from 'lucide-react';
import { submitApplication } from '@/lib/api';
import {
  trackLoanApplicationStart,
  trackLoanApplicationSubmit,
  trackLoanApplicationSuccess,
  trackLoanApplicationError,
  trackDocumentUpload,
  trackEmploymentTypeSelect,
} from '@/lib/analytics';

const applicationSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number').optional().or(z.literal('')),
  loanType: z.string().min(1, 'Please select a loan type'),
  loanAmount: z.string().min(1, 'Please specify loan amount'),
  employmentType: z.string().min(1, 'Please select employment type'),
  monthlyIncome: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode').optional().or(z.literal('')),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const loanTypes = [
  { id: 'personal', name: 'Personal Loan (Instant Cash)' },
  { id: 'home', name: 'Home Loan (Purchase & Balance Transfer)' },
  { id: 'business', name: 'Business Loan (MSME & Working Capital)' },
  { id: 'car', name: 'Car / Vehicle Loan' },
  { id: 'education', name: 'Education Loan' },
  { id: 'gold', name: 'Gold Loan against Ornaments' },
];

const employmentTypes = [
  { id: 'salaried', name: 'Salaried Professional' },
  { id: 'self-employed', name: 'Self-Employed / Business Enterprise' },
];

interface FileUploadState {
  panCard: File | null;
  aadharCard: File | null;
  salarySlip: File | null;
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
    salarySlip: null,
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
    control,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      loanType: defaultLoanType || '',
      employmentType: '',
    },
  });

  const employmentType = useWatch({ control, name: 'employmentType' });
  const watchedLoanType = useWatch({ control, name: 'loanType' });

  useEffect(() => {
    if (watchedLoanType) {
      trackLoanApplicationStart(watchedLoanType);
    }
  }, [watchedLoanType]);

  useEffect(() => {
    if (employmentType) {
      trackEmploymentTypeSelect(employmentType);
    }
  }, [employmentType]);

  const handleFileChange = (fieldName: keyof FileUploadState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload PDF, JPEG, or PNG files only');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be under 10MB');
        return;
      }
      setFiles((prev) => ({ ...prev, [fieldName]: file }));
      trackDocumentUpload(fieldName);
    }
  };

  const removeFile = (fieldName: keyof FileUploadState) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);

    trackLoanApplicationSubmit(data.loanType, parseFloat(data.loanAmount));

    try {
      const result = await submitApplication({
        ...data,
        loanAmount: parseFloat(data.loanAmount),
        monthlyIncome: data.monthlyIncome ? parseFloat(data.monthlyIncome) : undefined,
        panCard: files.panCard || undefined,
        aadharCard: files.aadharCard || undefined,
        itr: employmentType === 'salaried' ? files.salarySlip || undefined : files.itr || undefined,
        bankStatement: files.bankStatement || undefined,
      });

      setSubmitStatus('success');
      setApplicationId(result.applicationId);
      trackLoanApplicationSuccess(data.loanType, result.applicationId);
      reset();
      setFiles({
        panCard: null,
        aadharCard: null,
        salarySlip: null,
        itr: null,
        bankStatement: null,
      });
    } catch (error) {
      setSubmitStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Submission failed. Please try again.';
      setErrorMessage(errorMsg);
      trackLoanApplicationError(data.loanType, errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-[#FCF9F1] rounded-3xl p-8 md:p-12 border border-[#0E4A2C]/20 shadow-xl text-center">
        <div className="inline-flex p-4 bg-[#E6F0E7] text-[#0E4A2C] rounded-full mb-6 ring-8 ring-[#0E4A2C]/10">
          <CheckCircle2 size={56} className="text-[#0E4A2C]" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#062015] mb-3">
          Application Successfully Lodged!
        </h2>
        <p className="text-[#5E7266] text-base max-w-xl mx-auto mb-6 leading-relaxed">
          Your loan request is now entered in our ledger. An expert credit advisor from Loan ki Baat will review bank eligibilities and contact you within 24 hours.
        </p>

        {applicationId && (
          <div className="bg-white border border-[#0E4A2C]/15 rounded-2xl p-6 max-w-md mx-auto mb-6 shadow-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A9A91] block mb-1">
              Ledger Reference Number
            </span>
            <p className="font-mono text-xl font-bold text-[#0E4A2C] tracking-wide select-all">
              {applicationId}
            </p>
          </div>
        )}

        <div className="bg-[#FBF3DE] border border-[#C8942E]/30 rounded-2xl p-4 max-w-md mx-auto mb-8 text-sm text-[#8A6118]">
          <strong>Cashback Assurance:</strong> Keep this application ID handy to claim your exclusive 10–20% cashback upon disbursal.
        </div>

        <button
          onClick={() => setSubmitStatus('idle')}
          className="px-8 py-3.5 rounded-full font-semibold text-sm text-[#062015] bg-gradient-to-r from-[#8A6118] via-[#C8942E] to-[#F2DFAC] shadow-md hover:scale-105 transition-all"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#FCF9F1] rounded-3xl p-6 sm:p-10 border border-[#0E4A2C]/15 shadow-xl"
    >
      <div className="border-b border-[#0E4A2C]/15 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#8A6118] mb-1 font-semibold">
            <span>Section I</span>
            <span className="w-6 h-[1px] bg-[#C8942E]" />
            <span>Digital Application Ledger</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#062015]">
            Borrower Details &amp; Requirement
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#0E4A2C] bg-[#E6F0E7] px-3 py-1.5 rounded-lg border border-[#0E4A2C]/20 self-start sm:self-auto">
          <Lock size={13} />
          <span>256-Bit Encrypted</span>
        </div>
      </div>

      {submitStatus === 'error' && (
        <div className="mb-8 p-4 bg-[#FBEBEA] border border-[#C2564A]/30 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="text-[#C2564A] flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold text-[#8B2519]">Could not submit application</p>
            <p className="text-[#C2564A] mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 1. Personal Information */}
      <div className="mb-10">
        <h3 className="font-serif text-lg font-bold text-[#062015] mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#0E4A2C] text-white flex items-center justify-center font-mono text-xs">1</span>
          <span>Personal Details</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              Full Legal Name (as per PAN) *
            </label>
            <input
              type="text"
              {...register('fullName')}
              className="w-full px-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] placeholder-[#8A9A91] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all"
              placeholder="e.g. Rahul Sharma"
            />
            {errors.fullName && <p className="text-[#C2564A] text-xs mt-1 font-mono">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              Official / Personal Email *
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] placeholder-[#8A9A91] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all"
              placeholder="name@domain.com"
            />
            {errors.email && <p className="text-[#C2564A] text-xs mt-1 font-mono">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              Primary Mobile Number *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-sm font-mono text-[#8A9A91]">+91</span>
              <input
                type="tel"
                {...register('phone')}
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] placeholder-[#8A9A91] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all font-mono"
                placeholder="98765 43210"
              />
            </div>
            {errors.phone && <p className="text-[#C2564A] text-xs mt-1 font-mono">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              WhatsApp Number (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-sm font-mono text-[#8A9A91]">+91</span>
              <input
                type="tel"
                {...register('whatsapp')}
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] placeholder-[#8A9A91] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all font-mono"
                placeholder="If different from primary"
              />
            </div>
            {errors.whatsapp && <p className="text-[#C2564A] text-xs mt-1 font-mono">{errors.whatsapp.message}</p>}
          </div>
        </div>
      </div>

      {/* 2. Loan Requirements */}
      <div className="mb-10">
        <h3 className="font-serif text-lg font-bold text-[#062015] mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#0E4A2C] text-white flex items-center justify-center font-mono text-xs">2</span>
          <span>Loan &amp; Employment Details</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              Loan Category *
            </label>
            <select
              {...register('loanType')}
              className="w-full px-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all"
            >
              <option value="">Select loan category</option>
              {loanTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {errors.loanType && <p className="text-[#C2564A] text-xs mt-1 font-mono">{errors.loanType.message}</p>}
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              Desired Loan Amount (₹) *
            </label>
            <input
              type="number"
              {...register('loanAmount')}
              className="w-full px-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] placeholder-[#8A9A91] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all font-mono"
              placeholder="e.g. 1500000"
            />
            {errors.loanAmount && <p className="text-[#C2564A] text-xs mt-1 font-mono">{errors.loanAmount.message}</p>}
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              Employment Status *
            </label>
            <select
              {...register('employmentType')}
              className="w-full px-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all"
            >
              <option value="">Select employment category</option>
              {employmentTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {errors.employmentType && <p className="text-[#C2564A] text-xs mt-1 font-mono">{errors.employmentType.message}</p>}
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              Monthly In-Hand Income (₹)
            </label>
            <input
              type="number"
              {...register('monthlyIncome')}
              className="w-full px-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] placeholder-[#8A9A91] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all font-mono"
              placeholder="e.g. 85000"
            />
          </div>
        </div>
      </div>

      {/* 3. Address Information */}
      <div className="mb-10">
        <h3 className="font-serif text-lg font-bold text-[#062015] mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#0E4A2C] text-white flex items-center justify-center font-mono text-xs">3</span>
          <span>Location</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              City
            </label>
            <input
              type="text"
              {...register('city')}
              className="w-full px-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] placeholder-[#8A9A91] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all"
              placeholder="e.g. Mumbai"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              State
            </label>
            <input
              type="text"
              {...register('state')}
              className="w-full px-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] placeholder-[#8A9A91] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all"
              placeholder="e.g. Maharashtra"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E7266] mb-1.5 font-medium">
              Pincode
            </label>
            <input
              type="text"
              {...register('pincode')}
              className="w-full px-4 py-3 bg-white border border-[#0E4A2C]/20 rounded-xl text-sm text-[#12261B] placeholder-[#8A9A91] focus:border-[#0E4A2C] focus:ring-1 focus:ring-[#0E4A2C] outline-none transition-all font-mono"
              placeholder="6 digits"
            />
            {errors.pincode && <p className="text-[#C2564A] text-xs mt-1 font-mono">{errors.pincode.message}</p>}
          </div>
        </div>
      </div>

      {/* 4. Digital Document Dossier */}
      <div className="mb-10">
        <h3 className="font-serif text-lg font-bold text-[#062015] mb-2 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#0E4A2C] text-white flex items-center justify-center font-mono text-xs">4</span>
          <span>Digital Document Dossier</span>
        </h3>
        <p className="text-xs text-[#5E7266] mb-4">
          Optional at initial submission. Upload now for 3x faster verification (PDF, JPEG, or PNG up to 10MB).
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* PAN Card */}
          <div className="border border-dashed border-[#0E4A2C]/25 bg-white/70 rounded-2xl p-4 hover:border-[#0E4A2C] transition-colors">
            <label className="block cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E6F0E7] flex items-center justify-center text-[#0E4A2C]">
                    <Upload size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#062015]">PAN Card</p>
                    <p className="text-[11px] text-[#8A9A91] truncate max-w-[180px]">
                      {files.panCard ? files.panCard.name : 'Click to select file'}
                    </p>
                  </div>
                </div>
                {files.panCard && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeFile('panCard'); }}
                    className="p-1 hover:bg-black/5 rounded"
                  >
                    <X className="text-[#5E7266]" size={16} />
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
          <div className="border border-dashed border-[#0E4A2C]/25 bg-white/70 rounded-2xl p-4 hover:border-[#0E4A2C] transition-colors">
            <label className="block cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E6F0E7] flex items-center justify-center text-[#0E4A2C]">
                    <Upload size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#062015]">Aadhaar Card (Front &amp; Back)</p>
                    <p className="text-[11px] text-[#8A9A91] truncate max-w-[180px]">
                      {files.aadharCard ? files.aadharCard.name : 'Click to select file'}
                    </p>
                  </div>
                </div>
                {files.aadharCard && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeFile('aadharCard'); }}
                    className="p-1 hover:bg-black/5 rounded"
                  >
                    <X className="text-[#5E7266]" size={16} />
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

          {/* Conditional Salary Slip or ITR */}
          {employmentType === 'salaried' && (
            <div className="border border-dashed border-[#0E4A2C]/35 bg-[#E6F0E7]/40 rounded-2xl p-4 hover:border-[#0E4A2C] transition-colors">
              <label className="block cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0E4A2C] flex items-center justify-center text-white">
                      <FileCheck size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[#062015]">Salary Slips (Last 3 Months)</p>
                      <p className="text-[11px] text-[#0E4A2C] truncate max-w-[180px]">
                        {files.salarySlip ? files.salarySlip.name : 'Recommended for quick approval'}
                      </p>
                    </div>
                  </div>
                  {files.salarySlip && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); removeFile('salarySlip'); }}
                      className="p-1 hover:bg-black/5 rounded"
                    >
                      <X className="text-[#5E7266]" size={16} />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange('salarySlip')}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {employmentType === 'self-employed' && (
            <div className="border border-dashed border-[#C8942E]/50 bg-[#FBF3DE]/50 rounded-2xl p-4 hover:border-[#C8942E] transition-colors">
              <label className="block cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#8A6118] flex items-center justify-center text-white">
                      <FileCheck size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[#062015]">ITR Acknowledgement (2 Years)</p>
                      <p className="text-[11px] text-[#8A6118] truncate max-w-[180px]">
                        {files.itr ? files.itr.name : 'Recommended for business approval'}
                      </p>
                    </div>
                  </div>
                  {files.itr && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); removeFile('itr'); }}
                      className="p-1 hover:bg-black/5 rounded"
                    >
                      <X className="text-[#5E7266]" size={16} />
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
          )}

          {/* Bank Statement */}
          <div className="border border-dashed border-[#0E4A2C]/25 bg-white/70 rounded-2xl p-4 hover:border-[#0E4A2C] transition-colors">
            <label className="block cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E6F0E7] flex items-center justify-center text-[#0E4A2C]">
                    <Upload size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#062015]">Bank Statement (Last 6 Months)</p>
                    <p className="text-[11px] text-[#8A9A91] truncate max-w-[180px]">
                      {files.bankStatement ? files.bankStatement.name : 'Click to select file'}
                    </p>
                  </div>
                </div>
                {files.bankStatement && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeFile('bankStatement'); }}
                    className="p-1 hover:bg-black/5 rounded"
                  >
                    <X className="text-[#5E7266]" size={16} />
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

      {/* Special Foil Cashback Notice */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#FBF3DE] via-[#FCF9F1] to-[#FBF3DE] border border-[#C8942E]/30 flex items-center gap-3 text-xs text-[#8A6118]">
        <span className="font-bold font-serif text-lg text-[#062015] bg-[#E2BC6A]/40 px-2.5 py-1 rounded-lg">
          %
        </span>
        <div>
          <strong className="text-[#062015] block">Guaranteed 10–20% Cashback Benefit</strong>
          <span>Borrowers closing their loan via Loan ki Baat earn cashback credited directly onto their first 3 EMIs.</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-full font-semibold text-base text-[#062015] bg-gradient-to-r from-[#8A6118] via-[#C8942E] to-[#F2DFAC] shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin text-[#062015]" size={20} />
            <span>Recording Application in Ledger...</span>
          </>
        ) : (
          <span>Submit Application — Free &amp; Secure</span>
        )}
      </button>

      <p className="text-center font-mono text-[11px] text-[#8A9A91] mt-4">
        Zero impact on credit score · Confidential &amp; protected by RBI partner standards
      </p>
    </form>
  );
}
