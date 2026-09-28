export interface SubscriptionPlan {
  id: string;
  name: string;
  target: string;
  priceMonthly: number; // in INR
  priceAnnual: number; // in INR
  currency: string;
  aiRequestLimitMonthly: number;
  aiQuizGenLimitMonthly: number;
  maxStudentsLimit?: number;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    target: 'Individual students & trial users',
    priceMonthly: 0,
    priceAnnual: 0,
    currency: '₹',
    aiRequestLimitMonthly: 15,
    aiQuizGenLimitMonthly: 3,
    features: [
      'Student Dashboard & Basic Analytics',
      'Standard Concept Dependency Map',
      'Basic Learning Debt Score',
      'Limited Practice Quizzes',
      'Community Support',
    ],
    ctaText: 'Current Free Plan',
  },
  {
    id: 'student-plus',
    name: 'Student Plus',
    target: 'Students needing additional foundation practice',
    priceMonthly: 1,
    priceAnnual: 10,
    currency: '₹',
    aiRequestLimitMonthly: 150,
    aiQuizGenLimitMonthly: 30,
    features: [
      'Everything in Free',
      'Unlimited Question Bank Access',
      'AI Study Assistant (150 requests/mo)',
      'AI-Generated Practice Quizzes (30/mo)',
      'Personalized 3-Day Recovery Paths',
      'Progress Trend Analytics',
    ],
    isPopular: true,
    ctaText: 'Upgrade to Plus (₹1)',
  },
  {
    id: 'student-pro',
    name: 'Student Pro',
    target: 'Exam aspirants seeking mastery & zero debt',
    priceMonthly: 2,
    priceAnnual: 20,
    currency: '₹',
    aiRequestLimitMonthly: 500,
    aiQuizGenLimitMonthly: 100,
    features: [
      'Everything in Student Plus',
      'High AI Request Quotas (500/mo)',
      'Advanced Diagnostic Vector Analysis',
      'Priority Gemini 3.7 Flash Model Access',
      'Exportable Concept Debt Certificates',
      'Parent Progress Sync Notifications',
    ],
    ctaText: 'Upgrade to Pro (₹2)',
  },
  {
    id: 'teacher',
    name: 'Teacher Plan',
    target: 'Educators, tutors & department heads',
    priceMonthly: 10,
    priceAnnual: 50,
    currency: '₹',
    aiRequestLimitMonthly: 1000,
    aiQuizGenLimitMonthly: 200,
    maxStudentsLimit: 100,
    features: [
      'Teacher Educator Portal',
      'Up to 100 Students Tracked',
      'Class Cohort Learning Debt Heatmap',
      'Automated Prerequisite Alert Triggers',
      'Intervention Management System',
      'Downloadable PDF & CSV Reports',
    ],
    ctaText: 'Start Educator Plan (₹10)',
  },
  {
    id: 'institution',
    name: 'Institution Plan',
    target: 'Schools, Colleges, and Coaching Institutes',
    priceMonthly: 50,
    priceAnnual: 100,
    currency: '₹',
    aiRequestLimitMonthly: 10000,
    aiQuizGenLimitMonthly: 2000,
    maxStudentsLimit: 1000,
    features: [
      'Multiple Teacher Accounts',
      'Centralized Admin Control Center',
      'Department-Level Analytics & Metrics',
      'Custom Concept Graph Curriculums',
      'Bulk Assessment Management',
      'Institutional SLA & Onboarding',
    ],
    ctaText: 'License Institution (₹50)',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    target: 'Large university systems & multi-campus networks',
    priceMonthly: 100,
    priceAnnual: 1000,
    currency: '₹',
    aiRequestLimitMonthly: 50000,
    aiQuizGenLimitMonthly: 10000,
    features: [
      'Multi-Campus Administration',
      'Custom Dedicated Backend Deployment',
      'SAML / SSO Integration',
      'Custom AI Model Fine-Tuning',
      'Dedicated Account Manager',
    ],
    ctaText: 'Contact Sales (₹100)',
  },
];
