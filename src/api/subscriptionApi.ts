import { apiRequest } from './client';

export interface SubscriptionCheckoutPayload {
  userId: string;
  planId: string;
  billingPeriod?: string;
  amount: number;
  paymentProvider?: string;
}

export const subscriptionApi = {
  checkout: async (payload: SubscriptionCheckoutPayload) => {
    return apiRequest('/subscriptions/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getUserSubscription: async (userId: string) => {
    return apiRequest(`/subscriptions/user/${userId}`);
  }
};
