import React, { useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Eye, 
  Bookmark, 
  CheckCircle2, 
  DollarSign,
  Share2,
  Calendar
} from 'lucide-react';
import { ThemeMode, Tweet } from '../types';

interface MediaKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  topTweets: Tweet[];
}

export const MediaKitModal: React.FC<MediaKitModalProps> = ({
  isOpen,
  onClose,
  theme,
  topTweets,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const creatorStats = {
    handle: '@creator_studio',
    name: 'Alex Rivera',
    niche: 'B2B SaaS, AI Engineering & Indie Growth',
    followers: '24,520',
    monthlyImpressions: '1,420,000',
    avgEngagementRate: '4.8%',
    avgBookmarksPerPost: '2,840',
    demographics: [
      { label: 'Software Engineers & CTOs', value: '44%' },
      { label: 'Founders & Indie Makers', value: '34%' },
      { label: 'Product & Design Leads', value: '22%' },
    ],
    locations: 'United States (54%), United Kingdom & EU (32%), Other (14%)',
    packages: [
      {
        title: 'Single Sponsored Tweet',
        price: '$350',
        desc: 'Dedicated single standalone post published during peak 8:45 AM morning window with organic storytelling.',
        features: ['100% organic hook testing', 'No link penalty (plugged in reply)', '24h reach guarantee'],
      },
      {
        title: '7-Post Viral Deep-Dive Thread',
        price: '$850',
        desc: 'Comprehensive case study or product teardown thread with your tool as the centerpiece solution.',
        features: ['Guaranteed 50k+ impressions', 'Permanent profile bookmark', 'Custom infographic/chart'],
        popular: true,
      },
      {
        title: 'Monthly Creator Partner (4x)',
        price: '$2,400',
        desc: 'Complete brand integration across 4 weeks with weekly content iterations and bio header shoutout.',
        features: ['4 dedicated threads', 'Bi-weekly metric reports', 'Exclusive industry category lock'],
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Header Bar */}
        <div className={`p-4 border-b flex items-center justify-between no-print ${
          isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#1d9bf0]/15 text-[#1d9bf0] text-xs font-bold uppercase tracking-wider border border-[#1d9bf0]/30">
              Sponsor Media Kit
            </span>
            <span className="text-xs text-gray-400">
              Generated live from verified TweetIQ metrics
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors ${
                isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Media Kit Document */}
        <div ref={printAreaRef} className="p-8 overflow-y-auto space-y-8 print:p-0">
          {/* Creator Hero Header */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
            isDark ? 'bg-gradient-to-r from-[#16181f] to-[#0f1015] border-[#2f3336]' : 'bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-blue-100'
          }`}>
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                alt="Creator avatar"
                className="w-20 h-20 rounded-full ring-4 ring-[#1d9bf0]/20 object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black">{creatorStats.name}</h1>
                  <span className="text-[#1d9bf0] font-black text-lg">✓</span>
                </div>
                <p className="text-sm font-semibold text-[#1d9bf0]">{creatorStats.handle}</p>
                <p className="text-xs text-gray-400 mt-1 max-w-md">{creatorStats.niche}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                Official Creator Audit
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verified TweetIQ Data
              </span>
            </div>
          </div>

          {/* Key Stat Blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border text-center ${
              isDark ? 'bg-[#121318] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <Users className="w-5 h-5 text-[#1d9bf0] mx-auto mb-1.5" />
              <div className="text-2xl font-black font-mono">{creatorStats.followers}</div>
              <div className="text-xs text-gray-400 font-medium">Followers</div>
            </div>

            <div className={`p-4 rounded-xl border text-center ${
              isDark ? 'bg-[#121318] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <Eye className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
              <div className="text-2xl font-black font-mono">{creatorStats.monthlyImpressions}</div>
              <div className="text-xs text-gray-400 font-medium">Monthly Reach</div>
            </div>

            <div className={`p-4 rounded-xl border text-center ${
              isDark ? 'bg-[#121318] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-2xl font-black font-mono text-emerald-400">{creatorStats.avgEngagementRate}</div>
              <div className="text-xs text-gray-400 font-medium">Engagement Rate (X avg is 1.2%)</div>
            </div>

            <div className={`p-4 rounded-xl border text-center ${
              isDark ? 'bg-[#121318] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <Bookmark className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <div className="text-2xl font-black font-mono">{creatorStats.avgBookmarksPerPost}</div>
              <div className="text-xs text-gray-400 font-medium">Avg Bookmarks / Post</div>
            </div>
          </div>

          {/* Demographics */}
          <div className={`p-5 rounded-xl border ${
            isDark ? 'bg-[#121318] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
              Audience Demographics & Seniority
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {creatorStats.demographics.map((demo) => (
                <div key={demo.label} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                  <span className="text-xs text-gray-300 font-medium">{demo.label}</span>
                  <span className="text-sm font-bold text-[#1d9bf0] font-mono">{demo.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              <strong>Geography:</strong> {creatorStats.locations}
            </p>
          </div>

          {/* Sponsorship Offerings */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
              Sponsorship Packages & Rates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {creatorStats.packages.map((pkg) => (
                <div
                  key={pkg.title}
                  className={`p-5 rounded-xl border flex flex-col justify-between relative ${
                    pkg.popular
                      ? 'border-[#1d9bf0] bg-[#1d9bf0]/5'
                      : isDark
                      ? 'border-[#2f3336] bg-[#121318]'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 right-4 bg-[#1d9bf0] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h4 className="text-sm font-bold mb-1">{pkg.title}</h4>
                    <div className="text-2xl font-black text-[#1d9bf0] font-mono mb-2">{pkg.price}</div>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">{pkg.desc}</p>
                    <div className="space-y-1.5 border-t border-white/10 pt-3">
                      {pkg.features.map((feat) => (
                        <div key={feat} className="text-xs flex items-center gap-2 text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
