import { apiRequest } from './client';

export interface PlanSeatLimits {
  students: number;
  teachers: number;
  admins: number;
}

export interface SaaSPlan {
  plan_id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: string;
  is_proposed_pricing?: boolean;
  seat_limits: PlanSeatLimits;
  description: string;
  features: string[];
  display_features: string[];
}

export interface SeatUsageMetric {
  used: number;
  limit: number;
  percentage: number;
}

export interface OrganizationUsage {
  organization_id: string;
  subscription_id?: string;
  plan_id: string;
  status: string;
  expiry_date: string;
  usage: {
    students: SeatUsageMetric;
    teachers: SeatUsageMetric;
    admins: SeatUsageMetric;
  };
}

export interface OrganizationDetails {
  _id: string;
  organization_id: string;
  name: string;
  institution_type: string;
  status: string;
  subscription_id?: string;
  departments: string[];
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  _id: string;
  payment_id: string;
  organization_id: string;
  subscription_id: string;
  plan_id: string;
  amount: number;
  currency: string;
  status: string;
  mode: string;
  activated_by?: string;
  created_at: string;
}

export interface OrganizationMember {
  _id: string;
  organization_id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  department: string;
  status: string;
  joined_at: string;
}

export const saasApi = {
  getPlans: async (): Promise<{ plans: SaaSPlan[] }> => {
    return apiRequest('/subscriptions/plans');
  },

  getOrganizationStatus: async (orgId: string = 'org_psr_eng'): Promise<{
    organization: OrganizationDetails;
    subscription: OrganizationUsage;
  }> => {
    return apiRequest(`/subscriptions/organization/${orgId}`);
  },

  activateDemoSubscription: async (payload: {
    organizationId?: string;
    planId?: string;
    userId?: string;
    userRole?: string;
    adminName?: string;
  }) => {
    return apiRequest('/subscriptions/activate-demo', {
      method: 'POST',
      body: JSON.stringify({
        organizationId: payload.organizationId || 'org_psr_eng',
        planId: payload.planId || 'institution_pro',
        userId: payload.userId || 'admin_user',
        userRole: payload.userRole || 'admin',
        adminName: payload.adminName || 'Admin Officer'
      })
    });
  },

  getPayments: async (orgId: string = 'org_psr_eng'): Promise<{ payments: PaymentRecord[] }> => {
    return apiRequest(`/subscriptions/payments?org_id=${encodeURIComponent(orgId)}`);
  },

  checkFeatureAccess: async (feature: string, orgId: string = 'org_psr_eng', userId?: string): Promise<{
    feature: string;
    organization_id: string;
    hasAccess: boolean;
  }> => {
    const params = new URLSearchParams({ feature, org_id: orgId });
    if (userId) params.append('user_id', userId);
    return apiRequest(`/subscriptions/feature-access?${params.toString()}`);
  },

  getOrganizationMembers: async (orgId: string = 'org_psr_eng'): Promise<{
    organization_id: string;
    members: OrganizationMember[];
    count: number;
  }> => {
    return apiRequest(`/organizations/${orgId}/members`);
  },

  addOrganizationMember: async (orgId: string, memberData: {
    name: string;
    email: string;
    role: string;
    department?: string;
    userId?: string;
  }): Promise<{ success: boolean; message: string; member: OrganizationMember }> => {
    return apiRequest(`/organizations/${orgId}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData)
    });
  }
};
