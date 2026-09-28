import { subscriptionService } from './subscriptionService';
import { SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';

export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue (INR)
  arr: number; // Annual Recurring Revenue (INR)
  activeSubscriptionsCount: number;
  freeUsersCount: number;
  paidUsersCount: number;
  totalUsers: number;
  conversionRate: number; // percentage
  arpu: number; // Average Revenue Per Paying User (INR)
  cancellationRate: number; // percentage
}

export interface ForecastInputs {
  freeUsers: number;
  studentPlusCount: number;
  studentProCount: number;
  teacherCount: number;
  institutionCount: number;
  enterpriseCount: number;
  monthlyOperatingCosts: number;
  monthlyAiCosts: number;
  monthlyMarketingCosts: number;
}

export interface RevenueMixItem {
  tier: string;
  amount: number;
  percentage: number;
}

export interface ForecastResult {
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyCosts: number;
  annualCosts: number;
  monthlyGrossProfit: number;
  annualGrossProfit: number;
  grossMarginPercent: number;
  revenueMix: RevenueMixItem[];
}

export interface PlanBreakdownItem {
  planId: string;
  name: string;
  revenue: number;
  subscribers: number;
}

export const revenueService = {
  getRevenueOverview: (): RevenueMetrics => {
    const records = subscriptionService.getAdminSubscriptions();
    const activeRecords = records.filter((r) => r.status === 'Active');

    let mrr = 0;
    activeRecords.forEach((r) => {
      if (r.billingPeriod === 'Annual') {
        mrr += Math.round(r.amount / 12);
      } else {
        mrr += r.amount;
      }
    });

    const arr = mrr * 12;
    const paidUsersCount = activeRecords.length;
    const freeUsersCount = 1200; // Baseline free users
    const totalUsers = freeUsersCount + paidUsersCount;
    const conversionRate = totalUsers > 0 ? Math.round((paidUsersCount / totalUsers) * 1000) / 10 : 0;
    const arpu = paidUsersCount > 0 ? Math.round(mrr / paidUsersCount) : 0;
    const cancellationRate = 2.4; // %

    return {
      mrr,
      arr,
      activeSubscriptionsCount: paidUsersCount,
      freeUsersCount,
      paidUsersCount,
      totalUsers,
      conversionRate,
      arpu,
      cancellationRate,
    };
  },

  getPlanBreakdown: (): PlanBreakdownItem[] => {
    const records = subscriptionService.getAdminSubscriptions();
    const activeRecords = records.filter((r) => r.status === 'Active');

    const breakdownMap: Record<string, { name: string; revenue: number; subscribers: number }> = {
      student_plus: { name: 'Student Plus', revenue: 0, subscribers: 0 },
      student_pro: { name: 'Student Pro', revenue: 0, subscribers: 0 },
      teacher_plan: { name: 'Teacher Plan', revenue: 0, subscribers: 0 },
      institution_plan: { name: 'Institution Plan', revenue: 0, subscribers: 0 },
      enterprise_plan: { name: 'Enterprise', revenue: 0, subscribers: 0 },
    };

    activeRecords.forEach((r) => {
      const monthlyAmount = r.billingPeriod === 'Annual' ? Math.round(r.amount / 12) : r.amount;
      const key = r.planId;
      if (breakdownMap[key]) {
        breakdownMap[key].revenue += monthlyAmount;
        breakdownMap[key].subscribers += 1;
      }
    });

    return Object.keys(breakdownMap).map((k) => ({
      planId: k,
      name: breakdownMap[k].name,
      revenue: breakdownMap[k].revenue,
      subscribers: breakdownMap[k].subscribers,
    }));
  },

  getRevenueHistory: () => {
    return [
      { month: 'Apr', revenue: 14500, activeSubs: 24 },
      { month: 'May', revenue: 28900, activeSubs: 42 },
      { month: 'Jun', revenue: 45200, activeSubs: 68 },
      { month: 'Jul', revenue: 62800, activeSubs: 94 },
      { month: 'Aug', revenue: 89400, activeSubs: 135 },
      { month: 'Sep', revenue: 118500, activeSubs: 182 },
    ];
  },

  calculateForecast: (input: ForecastInputs): ForecastResult => {
    const pPlus = SUBSCRIPTION_PLANS.find((p) => p.id === 'student-plus')?.priceMonthly || 99;
    const pPro = SUBSCRIPTION_PLANS.find((p) => p.id === 'student-pro')?.priceMonthly || 199;
    const pTch = SUBSCRIPTION_PLANS.find((p) => p.id === 'teacher')?.priceMonthly || 499;
    const pInst = Math.round((SUBSCRIPTION_PLANS.find((p) => p.id === 'institution')?.priceAnnual || 25000) / 12);
    const pEnt = 15000; // Estimated monthly enterprise contract value

    const revPlus = input.studentPlusCount * pPlus;
    const revPro = input.studentProCount * pPro;
    const revTch = input.teacherCount * pTch;
    const revInst = input.institutionCount * pInst;
    const revEnt = input.enterpriseCount * pEnt;

    const monthlyRevenue = revPlus + revPro + revTch + revInst + revEnt;
    const annualRevenue = monthlyRevenue * 12;

    const monthlyCosts = input.monthlyOperatingCosts + input.monthlyAiCosts + input.monthlyMarketingCosts;
    const annualCosts = monthlyCosts * 12;

    const monthlyGrossProfit = monthlyRevenue - monthlyCosts;
    const annualGrossProfit = monthlyGrossProfit * 12;
    const grossMarginPercent = monthlyRevenue > 0 ? Math.round((monthlyGrossProfit / monthlyRevenue) * 100) : 0;

    const mixItems = [
      { tier: 'Student Plus', amount: revPlus },
      { tier: 'Student Pro', amount: revPro },
      { tier: 'Teacher Plan', amount: revTch },
      { tier: 'Institution Plan', amount: revInst },
      { tier: 'Enterprise', amount: revEnt },
    ];

    const revenueMix: RevenueMixItem[] = mixItems.map((item) => ({
      tier: item.tier,
      amount: item.amount,
      percentage: monthlyRevenue > 0 ? Math.round((item.amount / monthlyRevenue) * 100) : 0,
    }));

    return {
      monthlyRevenue,
      annualRevenue,
      monthlyCosts,
      annualCosts,
      monthlyGrossProfit,
      annualGrossProfit,
      grossMarginPercent,
      revenueMix,
    };
  },
};
