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
    id: 'student-plus',
    name: 'Student Plus',
    target: 'Students needing foundation practice',
    priceMonthly: 1,
    priceAnnual: 10,
    currency: '₹',
    aiRequestLimitMonthly: 150,
    aiQuizGenLimitMonthly: 30,
    maxStudentsLimit: 1,
    features: [
      'Everything in Free',
      'Unlimited Question Bank Access',
      'AI Study Assistant (150 prompts/mo)',
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
    target: 'Dedicated exam aspirants seeking zero debt',
    priceMonthly: 2,
    priceAnnual: 20,
    currency: '₹',
    aiRequestLimitMonthly: 500,
    aiQuizGenLimitMonthly: 100,
    maxStudentsLimit: 1,
    features: [
      'Everything in Student Plus',
      'High AI Request Quotas (500 prompts/mo)',
      'Personalized 3-Day Recovery Missions',
      'Detailed Concept Dependency Analytics',
      'Historical Learning Debt Tracking',
      'Unlimited Diagnostic Practice Quizzes',
      'Exportable Concept Debt Certificates'
    ],
    isPopular: true,
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
    id: 'enterprise',
    name: 'Enterprise Plan',
    target: 'Large university systems & multi-campus networks',
    priceMonthly: 100,
    priceAnnual: 1000,
    currency: '₹',
    aiRequestLimitMonthly: 50000,
    aiQuizGenLimitMonthly: 10000,
    maxStudentsLimit: 1000,
    features: [
      'Multi-Campus Administration',
      '1000 Student Seats Provisioned',
      '20 Teacher Faculty Seats',
      'Centralized Admin Control Center',
      'Department-Level Analytics & Metrics',
      'Custom Dedicated Backend Deployment',
      'Dedicated Account Manager',
    ],
    ctaText: 'Activate Enterprise (₹100)',
  },
];
