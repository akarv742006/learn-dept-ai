export interface SubscriptionRecord {
  id: string;
  userOrOrgName: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Institution';
  planId: string;
  planName: string;
  amount: number; // in INR
  billingPeriod: 'Monthly' | 'Annual';
  status: 'Active' | 'Trial' | 'Cancelled' | 'Expired';
  startDate: string;
  renewalDate: string;
}

export const DEMO_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 'sub-001',
    userOrOrgName: 'Akash Sharma',
    email: 'akash.sharma@learndebt.ai',
    role: 'Student',
    planId: 'student-pro',
    planName: 'Student Pro',
    amount: 199,
    billingPeriod: 'Monthly',
    status: 'Active',
    startDate: '2026-09-01',
    renewalDate: '2026-10-01',
  },
  {
    id: 'sub-002',
    userOrOrgName: 'Ms. Priya Sharma',
    email: 'priya.sharma@learndebt.ai',
    role: 'Teacher',
    planId: 'teacher',
    planName: 'Teacher Plan',
    amount: 499,
    billingPeriod: 'Monthly',
    status: 'Active',
    startDate: '2026-08-15',
    renewalDate: '2026-10-15',
  },
  {
    id: 'sub-003',
    userOrOrgName: 'Delhi Technological University',
    email: 'admin@dtu.ac.in',
    role: 'Institution',
    planId: 'institution',
    planName: 'Institution Plan',
    amount: 25000,
    billingPeriod: 'Annual',
    status: 'Active',
    startDate: '2026-01-10',
    renewalDate: '2027-01-10',
  },
  {
    id: 'sub-004',
    userOrOrgName: 'Priya S',
    email: 'priya.s@student.edu',
    role: 'Student',
    planId: 'student-plus',
    planName: 'Student Plus',
    amount: 99,
    billingPeriod: 'Monthly',
    status: 'Active',
    startDate: '2026-09-05',
    renewalDate: '2026-10-05',
  },
  {
    id: 'sub-005',
    userOrOrgName: 'Rahul M',
    email: 'rahul.m@student.edu',
    role: 'Student',
    planId: 'student-plus',
    planName: 'Student Plus',
    amount: 99,
    billingPeriod: 'Monthly',
    status: 'Active',
    startDate: '2026-09-12',
    renewalDate: '2026-10-12',
  },
  {
    id: 'sub-006',
    userOrOrgName: 'IIT Delhi CSE Department',
    email: 'contact@iitd.ac.in',
    role: 'Institution',
    planId: 'institution',
    planName: 'Institution Plan',
    amount: 25000,
    billingPeriod: 'Annual',
    status: 'Active',
    startDate: '2026-03-20',
    renewalDate: '2027-03-20',
  },
];
