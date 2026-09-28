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
    maxStudentsLimit: 1,
    features: [
      '1 Student Seat, 1 Admin Seat',
      'Basic Student Dashboard',
      'Standard Concept Dependency Map',
      'Basic Learning Debt Score',
      'Limited Practice Assessment Quizzes',
      'Core Non-AI Learning Tools'
    ],
    ctaText: 'Current Free Plan',
  },
  {
    id: 'student-pro',
    name: 'Student Pro',
    target: 'Dedicated exam aspirants seeking complete debt remediation',
    priceMonthly: 99,
    priceAnnual: 999,
    currency: '₹',
    aiRequestLimitMonthly: 500,
    aiQuizGenLimitMonthly: 100,
    maxStudentsLimit: 1,
    features: [
      'Proposed/Demo Pricing: ₹99/month',
      'Personalized 3-Day Recovery Missions',
      'Detailed Concept Dependency Analytics',
      'Historical Learning Debt Tracking',
      'Unlimited Diagnostic Practice Quizzes',
      'Gemini AI Study Assistant Explanations',
      'Exportable Concept Debt Certificates'
    ],
    isPopular: true,
    ctaText: 'Upgrade to Student Pro (₹99)',
  },
  {
    id: 'institution-pro',
    name: 'Institution Pro',
    target: 'Higher-education colleges, universities & coaching networks',
    priceMonthly: 2500,
    priceAnnual: 25000,
    currency: '₹',
    aiRequestLimitMonthly: 50000,
    aiQuizGenLimitMonthly: 10000,
    maxStudentsLimit: 1000,
    features: [
      'Proposed/Demo Pricing: ₹25,000/year',
      '1000 Student Seats Provisioned',
      '20 Teacher Faculty Seats',
      '5 Central Administrative Control Seats',
      'Student & Teacher Management Portals',
      'Department-Level Learning Debt Analytics',
      'Cohort Gradebook & Exam Tracking',
      'AI Weakness Remediation Question Authoring',
      'Accreditation & Institutional Reports'
    ],
    isPopular: true,
    ctaText: 'Activate Demo Subscription',
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
