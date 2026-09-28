import React, { useState } from 'react';
import {
  X,
  QrCode,
  CheckCircle2,
  Copy,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import type { SubscriptionPlan } from '../data/subscriptionPlans';
import { useAuth } from '../context/AuthContext';
import { saasApi, type DemoPaymentSession, type DemoPaymentConfirmResult } from '../api/saasApi';
import { firebaseSync } from '../services/firebase';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
  billingPeriod?: 'Monthly' | 'Annual';
  onSuccess: (message: string) => void;
}

export const UPI_PAYEE_NAME = 'LearnDebt AI Demo';
export const UPI_ID = 'learndebt@demo';

export const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingPeriod = 'Monthly',
  onSuccess,
}) => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'gpay' | 'demoupi'>('demoupi');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'error'>('idle');
  const [session, setSession] = useState<DemoPaymentSession | null>(null);
  const [confirmResult, setConfirmResult] = useState<DemoPaymentConfirmResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const isInstitution = plan?.id === 'institution-pro' || plan?.id === 'institution_pro' || plan?.id === 'institution';
  const amount = isInstitution ? 25000 : 99;
  const demoUpiId = 'learndebt@demo';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(demoUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleStartDemoPayment = async () => {
    setPaymentStep('processing');
    setErrorMessage('');

    try {
      if (isInstitution) {
        // Institution Pro Demo Activation
        await saasApi.activateDemoSubscription({
          organizationId: 'org_psr_eng',
          planId: 'institution_pro',
          userId: user?.id || 'admin_user',
          userRole: user?.role || 'admin',
          adminName: user?.name || 'Administrator'
        });
        setPaymentStep('success');
        onSuccess(
          'Successfully activated Institution Pro for PSR Engineering College! 1000 Student Seats & 20 Faculty Seats active. Demo Payment — No real money charged.'
        );
        return;
      }

      // Step 1: Create PENDING Demo Payment Session on Backend
      const sess = await saasApi.createDemoPayment({
        plan_id: 'student_pro',
        amount: 99,
        currency: 'INR',
        payment_method: selectedMethod === 'gpay' ? 'DEMO_GPAY' : 'DEMO_UPI',
        user_id: user?.id || 'student_arun'
      });
      setSession(sess);

      // Simulate realistic payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setPaymentStep('verifying');

      // Step 2: Server-side Confirmation & MongoDB/Firebase Activation
      const res = await saasApi.confirmDemoPayment(sess.payment_id);
      setConfirmResult(res);

      // Secondary client-side Firebase sync notification
      if (user?.id) {
        firebaseSync.syncSubscription({
          firebase_uid: user.id,
          subscription_status: 'ACTIVE',
          subscription_plan: 'STUDENT_PRO',
          subscription_expires_at: res.subscription.expires_at,
          synced_at: new Date().toISOString(),
          source: 'MongoDB_Atlas',
          demo: true
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      setPaymentStep('success');
      onSuccess(`🎉 Student Pro Activated! Payment ID: ${sess.payment_id}. Premium features unlocked. (DEMO PAYMENT — NO REAL MONEY CHARGED)`);
    } catch (err: any) {
      console.error('Demo payment error:', err);
      setErrorMessage(err.message || 'Payment simulation failed. Please try again.');
      setPaymentStep('error');
    }
  };

  const handleModalClose = () => {
    setPaymentStep('idle');
    setSession(null);
    setConfirmResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              {isInstitution ? <Building2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                {isInstitution ? 'Institution Campus License' : 'Upgrade to Student Pro'}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold">
                Proposed / Demo Pricing
              </p>
            </div>
          </div>

          {paymentStep !== 'processing' && paymentStep !== 'verifying' && (
            <button
              onClick={handleModalClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* DEMO NOTICE BANNER (Prominent requirement) */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-center">
          <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            DEMO PAYMENT — NO REAL MONEY CHARGED
          </p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-300/70 mt-0.5">
            Simulates genuine UPI & subscription activation without deducting funds.
          </p>
        </div>

        {/* STEP: SUCCESS */}
        {paymentStep === 'success' && (
          <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                🎉 Payment Successful!
              </h4>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {isInstitution ? 'Institution Pro is now ACTIVE' : 'Student Pro is now ACTIVE'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-200/60 dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>Plan:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {isInstitution ? 'Institution Pro' : 'Student Pro'}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ₹{amount} (Demo Paid)
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment ID:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {confirmResult?.payment?.payment_id || session?.payment_id || 'DEMO-7431'}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Valid Until:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {new Date(Date.now() + (isInstitution ? 365 : 30) * 86400000).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Your premium features are now unlocked. No logout or page refresh required.
            </p>

            <button
              onClick={handleModalClose}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition cursor-pointer"
            >
              Continue to Dashboard
            </button>
          </div>
        )}

        {/* STEP: PROCESSING OR VERIFYING */}
        {(paymentStep === 'processing' || paymentStep === 'verifying') && (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {paymentStep === 'processing' ? 'Processing Payment...' : 'Verifying Payment...'}
              </h4>
              <p className="text-xs text-slate-500">
                {paymentStep === 'processing'
                  ? 'Communicating with Demo Payment Provider...'
                  : 'Recording in MongoDB Atlas & synchronizing Firebase...'}
              </p>
            </div>
            <div className="w-48 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mx-auto overflow-hidden">
              <div
                className={`h-full bg-indigo-600 rounded-full transition-all duration-700 ${
                  paymentStep === 'processing' ? 'w-1/2' : 'w-5/6'
                }`}
              ></div>
            </div>
          </div>
        )}

        {/* STEP: ERROR */}
        {paymentStep === 'error' && (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900 dark:text-white">Payment Failed</h4>
              <p className="text-xs text-slate-500">{errorMessage || 'No money was charged. Please try again.'}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentStep('idle')}
                className="flex-1 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
              >
                Try Again
              </button>
              <button
                onClick={handleModalClose}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STEP: IDLE CHECKOUT FORM */}
        {paymentStep === 'idle' && (
          <div className="space-y-4">
            {/* Plan Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/10 to-blue-900/10 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Selected Plan
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {isInstitution ? 'Institution Pro' : '⭐ Student Pro'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isInstitution ? '1000 Students • 20 Faculty Seats' : 'Personal AI Study & Recovery Pass'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  ₹{amount}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isInstitution ? '/ year' : '/ month'}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Payment Method (Demo)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('demoupi')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    selectedMethod === 'demoupi'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[11px]">Demo UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('gpay')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    selectedMethod === 'gpay'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[11px]">GPay Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    selectedMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[11px]">Generic UPI</span>
                </button>
              </div>
            </div>

            {/* Demo UPI ID & Placeholder QR */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                  Demo UPI ID
                </span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                  {demoUpiId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 transition cursor-pointer"
              >
                {copiedUpi ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Visual Demo QR Box */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
              <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center relative shadow-sm">
                <QrCode className="w-20 h-20 text-slate-800 opacity-80" />
                <span className="absolute bottom-1 text-[8px] font-black uppercase text-amber-600 bg-amber-100 px-1 rounded">
                  DEMO ONLY
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">
                Visual Demo QR — Non-payment placeholder. No funds will be transferred.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleStartDemoPayment}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pay ₹{amount} (Demo Mode)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleModalClose}
                className="w-full py-2.5 rounded-2xl bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
