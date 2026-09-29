import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Shield, 
  ArrowRight, 
  X, 
  Star, 
  Key, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { ThemeMode, LicenseState } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: LicenseState;
  onUpdateLicense: (newLicense: LicenseState) => void;
  theme: ThemeMode;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  license,
  onUpdateLicense,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const [modalTab, setModalTab] = useState<'plans' | 'activate'>('plans');
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const customPaymentUrl = localStorage.getItem('tweetiq_creator_payment_url') || '';

  const handleActivateKey = (e: React.FormEvent) => {
    e.preventDefault();
    setLicenseError('');
    const cleanKey = licenseKeyInput.trim();

    if (!cleanKey) {
      setLicenseError('Please enter your license key.');
      return;
    }

    if (cleanKey.length >= 6) {
      onUpdateLicense({ ...license, hasLifetime: true, hasAIPro: true });
      setSuccessMsg('🎉 License activated! Lifetime Pro features are now unlocked.');
      setLicenseKeyInput('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setLicenseError('Invalid license key. Please check and try again.');
    }
  };

  const handleBuyClick = () => {
    if (customPaymentUrl) {
      window.open(customPaymentUrl, '_blank');
    } else {
      // Direct instant unlock for user demo
      onUpdateLicense({ ...license, hasLifetime: true, hasAIPro: true });
      setSuccessMsg('🎉 Upgraded to Lifetime Pro! All features unlocked.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all text-xs ${
          isDark ? 'bg-[#0a0a0c] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'border-[#2f3336] bg-[#121216]' : 'border-gray-100 bg-gray-50'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1d9bf0]/15 text-[#1d9bf0] border border-[#1d9bf0]/30">
                TweetIQ Pro
              </span>
              {license.hasLifetime && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pro Active
                </span>
              )}
            </div>
            <h2 className="text-base font-bold">Simple, Transparent Pricing</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Plans vs Activate Key */}
        <div className={`px-5 py-2.5 border-b flex items-center gap-2 ${
          isDark ? 'bg-[#0f1015] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
        }`}>
          <button
            onClick={() => setModalTab('plans')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              modalTab === 'plans'
                ? 'bg-[#1d9bf0] text-white shadow-xs'
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Plans &amp; Upgrades</span>
          </button>

          <button
            onClick={() => setModalTab('activate')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              modalTab === 'activate'
                ? 'bg-[#1d9bf0] text-white shadow-xs'
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Have a License Key?</span>
          </button>
        </div>

        {/* Success / Notification Banner */}
        {successMsg && (
          <div className="p-3 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Plans & Pricing */}
        {modalTab === 'plans' && (
          <div className="p-6 overflow-y-auto space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Free Plan */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                isDark ? 'bg-[#121318] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-400">Free Tier</span>
                  </div>
                  <div className="text-2xl font-black mb-1">$0</div>
                  <p className="text-gray-400 text-[11px] mb-3">
                    Essential reach calculation and post formatting for anyone writing on X.
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-gray-300">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Live Algorithmic Reach Score</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Bookmark Multiplier &amp; Penalty Checks</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Track last 10 tweets</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4">
                  <div className="py-2 text-center text-[11px] text-gray-500 font-semibold">
                    Current Default
                  </div>
                </div>
              </div>

              {/* Lifetime Pro ($29) */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between relative shadow-lg ${
                isDark ? 'bg-gradient-to-b from-[#141b24] to-[#0e1218] border-[#1d9bf0]/50' : 'bg-blue-50/70 border-blue-300'
              }`}>
                <div className="absolute -top-2.5 right-3 bg-[#1d9bf0] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Most Popular
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#1d9bf0]">Lifetime Pro</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-black text-[#1d9bf0]">$29</span>
                    <span className="text-gray-400 text-[11px]">one-time</span>
                  </div>
                  <p className="text-gray-400 text-[11px] mb-3">
                    Pay once, own forever. Complete scheduling queue, all-time analytics &amp; AI hook remorphing.
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-gray-300">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Unlimited tweet tracking &amp; history</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Audience Peak Times 7-Day Heatmap</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Smart Scheduling Queue with Auto-Pick</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Unlimited Saved Swipe File</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>AI Viral Hook Variations</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleBuyClick}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      license.hasLifetime
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : 'bg-[#1d9bf0] hover:bg-[#1a8cd8] active:scale-95 text-white shadow-md'
                    }`}
                  >
                    {license.hasLifetime ? (
                      <>
                        <Check className="w-4 h-4" /> Pro Unlocked
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" /> Get Lifetime Pro ($29) <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-[11px] text-center text-gray-400 ${
              isDark ? 'bg-black/40 border-gray-800' : 'bg-gray-50 border-gray-200'
            }`}>
              🔒 Secure one-time payment. 7-day money-back guarantee. No recurring monthly subscriptions.
            </div>
          </div>
        )}

        {/* Tab 2: Activate Key */}
        {modalTab === 'activate' && (
          <div className="p-6 overflow-y-auto space-y-4">
            <div>
              <h4 className="font-bold text-sm mb-1">Activate Your License Key</h4>
              <p className="text-gray-400 text-xs">
                Already purchased TweetIQ on Gumroad or our store? Enter your license key below to unlock Pro features on this device:
              </p>
            </div>

            <form onSubmit={handleActivateKey} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">License Key</label>
                <input
                  type="text"
                  placeholder="TIQ-PRO-XXXX-XXXX"
                  value={licenseKeyInput}
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border font-mono text-xs ${
                    isDark ? 'bg-black border-[#3c4043] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {licenseError && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{licenseError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] active:scale-95 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Activate License
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className={`px-5 py-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="text-gray-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Private · Stored Locally on Your Device</span>
          </div>
          <button
            onClick={onClose}
            className={`px-3 py-1.5 rounded-lg font-semibold border ${
              isDark ? 'border-gray-700 hover:bg-white/5 text-gray-300' : 'border-gray-300 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
