// Google Analytics 4 Event Tracking Utilities

export const GA_MEASUREMENT_ID = 'G-PGDDEMLBR8';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// ============================================
// SPECIFIC EVENT TRACKING FUNCTIONS
// ============================================

// Track loan application form events
export const trackLoanApplicationStart = (loanType: string) => {
  event({
    action: 'loan_application_start',
    category: 'Loan Application',
    label: loanType,
  });
};

export const trackLoanApplicationSubmit = (loanType: string, loanAmount: number) => {
  event({
    action: 'loan_application_submit',
    category: 'Loan Application',
    label: loanType,
    value: loanAmount,
  });
};

export const trackLoanApplicationSuccess = (loanType: string, applicationId: string) => {
  event({
    action: 'loan_application_success',
    category: 'Loan Application',
    label: `${loanType} - ${applicationId}`,
  });
};

export const trackLoanApplicationError = (loanType: string, error: string) => {
  event({
    action: 'loan_application_error',
    category: 'Loan Application',
    label: `${loanType} - ${error}`,
  });
};

// Track document uploads
export const trackDocumentUpload = (documentType: string) => {
  event({
    action: 'document_upload',
    category: 'Documents',
    label: documentType,
  });
};

// Track contact form events
export const trackContactFormSubmit = () => {
  event({
    action: 'contact_form_submit',
    category: 'Contact',
    label: 'Callback Request',
  });
};

export const trackContactFormSuccess = () => {
  event({
    action: 'contact_form_success',
    category: 'Contact',
    label: 'Callback Request Sent',
  });
};

// Track loan type interest
export const trackLoanTypeView = (loanType: string) => {
  event({
    action: 'loan_type_view',
    category: 'Interest',
    label: loanType,
  });
};

export const trackLoanTypeClick = (loanType: string) => {
  event({
    action: 'loan_type_click',
    category: 'Interest',
    label: loanType,
  });
};

// Track CTA button clicks
export const trackCTAClick = (ctaName: string, location: string) => {
  event({
    action: 'cta_click',
    category: 'CTA',
    label: `${ctaName} - ${location}`,
  });
};

// Track phone/WhatsApp clicks
export const trackPhoneClick = (location: string) => {
  event({
    action: 'phone_click',
    category: 'Contact',
    label: location,
  });
};

export const trackWhatsAppClick = (location: string) => {
  event({
    action: 'whatsapp_click',
    category: 'Contact',
    label: location,
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage: number) => {
  event({
    action: 'scroll_depth',
    category: 'Engagement',
    label: `${percentage}%`,
    value: percentage,
  });
};

// Track time on page
export const trackTimeOnPage = (seconds: number, pageName: string) => {
  event({
    action: 'time_on_page',
    category: 'Engagement',
    label: pageName,
    value: seconds,
  });
};

// Track employment type selection
export const trackEmploymentTypeSelect = (employmentType: string) => {
  event({
    action: 'employment_type_select',
    category: 'Form Interaction',
    label: employmentType,
  });
};

// Track form field interactions
export const trackFormFieldFocus = (fieldName: string) => {
  event({
    action: 'form_field_focus',
    category: 'Form Interaction',
    label: fieldName,
  });
};

// Declare gtag on window
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
