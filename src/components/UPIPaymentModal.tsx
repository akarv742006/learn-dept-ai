import React, { useState, useRef } from 'react';
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
  AlertCircle,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  CreditCard,
  Check
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

export const UPI_PAYEE_NAME = 'AKASH K';
export const UPI_ID = 'akashkrishnamoorthi89@oksbi';

const PRESET_AMOUNTS = [1, 10, 50, 99];

export const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingPeriod = 'Monthly',
  onSuccess,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'qr' | 'apps' | 'screenshot' | 'demo'>('qr');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'error'>('idle');
  const [session, setSession] = useState<DemoPaymentSession | null>(null);
  const [confirmResult, setConfirmResult] = useState<DemoPaymentConfirmResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const isInstitution = plan?.id === 'institution-pro' || plan?.id === 'institution_pro' || plan?.id === 'institution';
  const defaultAmount = isInstitution ? 25000 : 99;
  const currentAmount = selectedPreset !== null && !isInstitution ? selectedPreset : defaultAmount;

  // Construct standard UPI deep link using akashkrishnamoorthi89@oksbi
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    UPI_PAYEE_NAME
  )}&am=${currentAmount}.00&cu=INR&tn=${encodeURIComponent(
    `LearnDebt AI ${plan?.name || 'Student Pro'}`
  )}`;

  // Dynamic QR Code API generator URL
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    upiDeepLink
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmFlow = async (methodLabel: string = 'DEMO_UPI') => {
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
        amount: currentAmount,
        currency: 'INR',
        payment_method: methodLabel,
        user_id: user?.id || 'student_arun'
      });
      setSession(sess);

      // Realistic payment processing state delay
      await new Promise((resolve) => setTimeout(resolve, 1100));
      setPaymentStep('verifying');

      // Step 2: Server-side Confirmation & MongoDB/Firebase Activation
      const res = await saasApi.confirmDemoPayment(sess.payment_id, {
        utr_number: utrNumber.trim() || undefined,
        screenshot_url: screenshotPreview ? screenshotPreview.slice(0, 100) + '...' : undefined
      });
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
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
      setPaymentStep('error');
    }
  };

  const handleModalClose = () => {
    setPaymentStep('idle');
    setSession(null);
    setConfirmResult(null);
    setScreenshotPreview(null);
    setUtrNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4 relative my-6 animate-in fade-in zoom-in-95 duration-150">
        
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
                UPI / Google Pay Compatible Demo • ₹{currentAmount} {isInstitution ? '/ year' : '/ month'}
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

        {/* DEMO NOTICE BANNER */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-2.5 text-center">
          <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            DEMO PAYMENT — NO REAL MONEY CHARGED
          </p>
          <p className="text-[10px] text-amber-700/80 dark:text-amber-300/70 mt-0.5">
            Simulates authentic UPI payment & unlocks Student Pro on MongoDB Atlas & Firebase.
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
                {isInstitution ? 'Institution Pro is now ACTIVE' : 'Student Pro is now ACTIVE ⭐'}
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
                <span>Paid To:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {UPI_PAYEE_NAME} ({UPI_ID})
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ₹{currentAmount} (Demo Mode)
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment ID:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {confirmResult?.payment?.payment_id || session?.payment_id || 'DEMO-7431'}
                </span>
              </div>
              {utrNumber && (
                <div className="flex justify-between text-slate-500">
                  <span>UTR Reference:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {utrNumber}
                  </span>
                </div>
              )}
              {screenshotPreview && (
                <div className="flex justify-between text-slate-500 items-center">
                  <span>Screenshot Proof:</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Attached
                  </span>
                </div>
              )}
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
                  ? 'Initiating Demo UPI session for ' + UPI_ID + '...'
                  : 'Recording in MongoDB Atlas & synchronizing Firebase learndept-ai...'}
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
                className="flex-1 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={handleModalClose}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STEP: IDLE TABS FORM */}
        {paymentStep === 'idle' && (
          <div className="space-y-4">
            
            {/* METHOD TABS */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'qr'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('apps')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'apps'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI Apps</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('screenshot')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'screenshot'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Screenshot</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'demo'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Demo</span>
              </button>
            </div>

            {/* TAB 1: SCAN QR CODE (Old Method) */}
            {activeTab === 'qr' && (
              <div className="space-y-3.5 text-center animate-in fade-in duration-150">
                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-3xl border border-slate-200 dark:border-slate-700/60 inline-block shadow-inner relative">
                  <div className="bg-white p-2.5 rounded-2xl shadow-md inline-block">
                    <img
                      src={qrImageUrl}
                      alt={`Scan QR to pay ₹${currentAmount} to ${UPI_PAYEE_NAME}`}
                      className="w-44 h-44 mx-auto object-contain rounded-lg"
                    />
                  </div>

                  <div className="mt-2.5 font-extrabold text-xs text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                    <span>{UPI_PAYEE_NAME}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Verified UPI Merchant</span>
                  </div>
                </div>

                {/* Preset quick test amounts */}
                {!isInstitution && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Test:</span>
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSelectedPreset(amt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          currentAmount === amt
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Copy UPI Box */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">UPI VPA Address:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{UPI_ID}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs cursor-pointer"
                  >
                    {copiedUpi ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: DIRECT UPI APP LINKS (Old Method) */}
            {activeTab === 'apps' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium text-center">
                  Trigger direct payment in your installed UPI app:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={upiDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-between shadow-md hover:scale-[1.01] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span>Google Pay / BHIM UPI</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>

                  <a
                    href={upiDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-between shadow-md hover:scale-[1.01] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span>PhonePe</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>

                  <a
                    href={upiDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-between shadow-md hover:scale-[1.01] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span>Paytm</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>

                  <a
                    href={upiDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-between shadow-md hover:scale-[1.01] transition"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Other UPI Apps</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Recipient UPI:</span> {UPI_ID} ({UPI_PAYEE_NAME})
                </div>
              </div>
            )}

            {/* TAB 3: UPLOAD SCREENSHOT & UTR (Old Screenshot Method) */}
            {activeTab === 'screenshot' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Upload screenshot of your payment receipt or enter the UTR Reference number:
                </p>

                {/* Screenshot Drag & Drop / File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {screenshotPreview ? (
                  <div className="relative rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-3 flex items-center gap-3">
                    <img
                      src={screenshotPreview}
                      alt="Payment Screenshot Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-emerald-500/30 shadow-xs"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Screenshot Attached
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Ready for verification
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScreenshotPreview(null)}
                      className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-5 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-1.5 opacity-80" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Click to upload payment screenshot
                    </span>
                    <span className="text-[10px] text-slate-400">
                      PNG, JPG, or screenshot from GPay / PhonePe / Paytm
                    </span>
                  </div>
                )}

                {/* UPI Transaction Ref / UTR Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    UPI Transaction Ref / UTR Number (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 629410982341"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: INSTANT DEMO SIMULATOR */}
            {activeTab === 'demo' && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2 font-medium animate-in fade-in duration-150">
                <span className="font-black uppercase tracking-wider text-amber-600 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Instant Demo Simulator
                </span>
                <p>
                  Instant backend verification with no wait. Ideal for demo walkthroughs and evaluators.
                </p>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                  UPI VPA: <span className="font-mono font-bold text-slate-900 dark:text-white">{UPI_ID}</span>
                </div>
              </div>
            )}

            {/* Universal Confirm Button & Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleConfirmFlow(
                  activeTab === 'apps' ? 'DIRECT_UPI_APP' : activeTab === 'screenshot' ? 'UPI_SCREENSHOT_UTR' : 'DEMO_UPI'
                )}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Paid ₹{currentAmount} (Demo Mode)</span>
              </button>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-semibold transition cursor-pointer"
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

export default UPIPaymentModal;
