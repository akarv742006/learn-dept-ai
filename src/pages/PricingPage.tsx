import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, HelpCircle, ArrowRight, QrCode } from 'lucide-react';
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '../data/subscriptionPlans';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from '../context/AuthContext';
import { UPIPaymentModal, UPI_PAYEE_NAME, UPI_ID } from '../components/UPIPaymentModal';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'Monthly' | 'Annual'>('Monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isDirectUpiOpen, setIsDirectUpiOpen] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  const currentSub = subscriptionService.getUserSubscription(user?.id || 'demo-user');

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.id === 'free') {
      return; // Free plan requires no payment and cannot be clicked
    }
    setSelectedPlan(plan);
  };

  const handlePaymentSuccess = (msg: string) => {
    setPaymentSuccessMsg(msg);
    setSelectedPlan(null);
    setIsDirectUpiOpen(false);
    setTimeout(() => setPaymentSuccessMsg(''), 8000);
  };

  const faqs = [
    {
      q: 'Is LearnDebt AI free for individual students?',
      a: 'Yes! The Free Plan allows students to access basic gap detection, concept mastery scores, and standard practice quizzes at zero cost.',
    },
    {
      q: 'What happens when AI usage limits are reached?',
      a: 'If your monthly AI prompt limit is reached, core non-AI learning features, concept graphs, and standard question bank quizzes remain 100% accessible. You can upgrade anytime for higher AI quotas.',
    },
    {
      q: 'Can teachers manage multiple student cohorts?',
      a: 'Yes, the Teacher Plan supports up to 100 student records with automated prerequisite alerts and intervention management.',
    },
    {
      q: 'How does Institutional Licensing work for schools & colleges?',
      a: 'The Institution Plan (₹25,000/year) licenses an entire campus with multi-teacher support, department analytics, and central administration.',
    },
    {
      q: 'Is student learning data sold to third-party advertisers?',
      a: 'Never. LearnDebt AI strictly protects student privacy and never sells learning records or uses performance data for commercial advertising.',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto font-sans pb-16 pt-4">
      {/* Landing Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition"
        >
          ← Back
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-xs border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>SaaS Revenue & Direct UPI Payment Gateway</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Simple, Transparent Plans for Students, Teachers & Institutions
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
          Detect early, intervene intelligently, and build stronger academic foundations with configurable AI quotas.
        </p>

        {/* Direct UPI Payment Button Banner */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setIsDirectUpiOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition hover:scale-105"
          >
            <QrCode className="w-4 h-4" />
            <span>Direct UPI Scan & Pay ({UPI_PAYEE_NAME} • {UPI_ID})</span>
          </button>
        </div>

        {/* Monthly / Annual Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className={`text-xs font-extrabold ${billingPeriod === 'Monthly' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'Monthly' ? 'Annual' : 'Monthly')}
            className="w-14 h-8 rounded-full bg-blue-600 p-1 transition-colors relative"
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${billingPeriod === 'Annual' ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
          <span className={`text-xs font-extrabold flex items-center gap-1 ${billingPeriod === 'Annual' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
            <span>Annual Billing</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">Save ~17%</span>
          </span>
        </div>
      </div>

      {paymentSuccessMsg && (
        <div className="bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 p-4 rounded-2xl text-center text-xs font-bold animate-in fade-in">
          {paymentSuccessMsg}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentSub.planId === plan.id;
          const displayPrice = billingPeriod === 'Annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-xl flex flex-col justify-between relative transition hover:border-blue-500 ${
                plan.isPopular ? 'border-2 border-blue-600 dark:border-blue-500 shadow-blue-600/10' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">{plan.target}</p>
                </div>

                <div className="py-2 border-y border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {plan.currency}{displayPrice}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      / {billingPeriod === 'Annual' ? 'year' : 'month'}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    ⚡ {plan.aiRequestLimitMonthly} AI Prompts / mo
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                {plan.id === 'free' ? (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-2xl font-extrabold text-xs transition flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-dashed border-slate-300 dark:border-slate-700 shadow-none"
                    >
                      <span>Included Free (No Payment Needed)</span>
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-semibold">
                      Always Free • Zero Charges
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-default'
                        : plan.isPopular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/20'
                        : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Active Plan' : plan.ctaText}</span>
                    {!isCurrent && <ArrowRight className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-black text-slate-900 dark:text-white">{faq.q}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Direct & Plan Payment Modal */}
      <UPIPaymentModal
        isOpen={Boolean(selectedPlan && selectedPlan.id !== 'free') || isDirectUpiOpen}
        onClose={() => {
          setSelectedPlan(null);
          setIsDirectUpiOpen(false);
        }}
        plan={selectedPlan}
        billingPeriod={billingPeriod}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PricingPage;

