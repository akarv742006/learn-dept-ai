import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '../data/subscriptionPlans';
import { DEMO_SUBSCRIPTIONS, type SubscriptionRecord } from '../data/demoSubscriptions';

export interface UserSubscriptionState {
  planId: string;
  billingPeriod: 'Monthly' | 'Annual';
  status: 'Active' | 'Free' | 'Cancelled';
  startDate: string;
  renewalDate: string;
  aiRequestsUsed: number;
  aiQuizzesGenUsed: number;
}

export const subscriptionService = {
  getUserSubscription: (userId: string): UserSubscriptionState => {
    const key = `ld_sub_${userId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    // Default Free state
    return {
      planId: 'free',
      billingPeriod: 'Monthly',
      status: 'Free',
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: 'N/A',
      aiRequestsUsed: 4,
      aiQuizzesGenUsed: 1,
    };
  },

  getCurrentPlan: (userId: string): SubscriptionPlan => {
    const userSub = subscriptionService.getUserSubscription(userId);
    return (
      SUBSCRIPTION_PLANS.find((p) => p.id === userSub.planId) ||
      SUBSCRIPTION_PLANS[0]
    );
  },

  /**
   * Process simulated demo payment confirmation
   */
  processDemoPayment: (
    userId: string,
    userName: string,
    userEmail: string,
    planId: string,
    billingPeriod: 'Monthly' | 'Annual'
  ): { success: boolean; subscription: UserSubscriptionState; message: string } => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) return { success: false, subscription: subscriptionService.getUserSubscription(userId), message: 'Invalid plan' };

    const startDate = new Date().toISOString().split('T')[0];
    const renewal = new Date();
    if (billingPeriod === 'Annual') renewal.setFullYear(renewal.getFullYear() + 1);
    else renewal.setMonth(renewal.getMonth() + 1);
    const renewalDate = renewal.toISOString().split('T')[0];

    const updatedSub: UserSubscriptionState = {
      planId,
      billingPeriod,
      status: 'Active',
      startDate,
      renewalDate,
      aiRequestsUsed: 0,
      aiQuizzesGenUsed: 0,
    };

    localStorage.setItem(`ld_sub_${userId}`, JSON.stringify(updatedSub));

    // Add record to admin subscription list
    const newRecord: SubscriptionRecord = {
      id: `sub-demo-${Date.now()}`,
      userOrOrgName: userName,
      email: userEmail,
      role: planId.includes('institution') ? 'Institution' : planId.includes('teacher') ? 'Teacher' : 'Student',
      planId,
      planName: plan.name,
      amount: billingPeriod === 'Annual' ? plan.priceAnnual : plan.priceMonthly,
      billingPeriod,
      status: 'Active',
      startDate,
      renewalDate,
    };

    subscriptionService.addDemoRecord(newRecord);

    return {
      success: true,
      subscription: updatedSub,
      message: `Successfully upgraded to ${plan.name} (${billingPeriod}). Demo Payment Confirmed — No real money charged!`,
    };
  },

  cancelSubscription: (userId: string): UserSubscriptionState => {
    const current = subscriptionService.getUserSubscription(userId);
    const updated: UserSubscriptionState = {
      ...current,
      status: 'Cancelled',
    };
    localStorage.setItem(`ld_sub_${userId}`, JSON.stringify(updated));
    return updated;
  },

  getAdminSubscriptions: (): SubscriptionRecord[] => {
    try {
      const stored = localStorage.getItem('ld_admin_subs');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEMO_SUBSCRIPTIONS;
  },

  addDemoRecord: (record: SubscriptionRecord) => {
    const existing = subscriptionService.getAdminSubscriptions();
    const updated = [record, ...existing];
    try {
      localStorage.setItem('ld_admin_subs', JSON.stringify(updated));
    } catch (e) {}
  },
};
