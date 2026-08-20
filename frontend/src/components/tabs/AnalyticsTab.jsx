import React, { useState } from 'react';
import { 
  BarChart3, 
  Globe, 
  Download, 
  Eye, 
  Link, 
  ShieldCheck, 
  TrendingUp,
  QrCode
} from 'lucide-react';
import { MOCK_ANALYTICS } from '../../mockData.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';

export default function AnalyticsTab({ onOpenShareModal }) {
  const [analyticsData] = useState(MOCK_ANALYTICS);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(analyticsData.hostedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const maxViews = Math.max(...(analyticsData.recentViews?.map(d => d.views) || [100]));

  return (
    <div className="w-full space-y-5">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-base font-extrabold text-slate-100">
          <BarChart3 className="size-4 text-sky-400 shrink-0" />
          <span>Hosted CV & Privacy-First Analytics</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Publish your CV on a dedicated link, embed QR codes in PDF headers, and track recruiter engagement without cookies or personal data tracking.
        </p>
      </div>

      {/* Hosted Subdomain Box */}
      <Card className="bg-slate-900 border-cyan-500/30 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Live Public CV URL
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-sky-400 mt-1">
              <Globe className="size-3.5 shrink-0" />
              <span>{analyticsData.hostedUrl}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1.5 text-xs font-semibold">
              <Link className="size-3.5" />
              {copiedLink ? "Copied!" : "Copy URL"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-slate-950/80 border-slate-800 p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Eye className="size-3.5 text-blue-400 shrink-0" />
            <span>Total Views</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">
            {analyticsData.stats.totalViews}
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-1">
            +18.4% vs last week
          </div>
        </Card>

        <Card className="bg-slate-950/80 border-slate-800 p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Download className="size-3.5 text-emerald-400 shrink-0" />
            <span>PDF Downloads</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">
            {analyticsData.stats.pdfDownloads}
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-1">
            26% conversion rate
          </div>
        </Card>

        <Card className="bg-slate-950/80 border-slate-800 p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <QrCode className="size-3.5 text-purple-400 shrink-0" />
            <span>QR Code Scans</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">
            {analyticsData.stats.qrScans}
          </div>
          <div className="text-xs font-semibold text-purple-400 mt-1">
            From print & PDF headers
          </div>
        </Card>
      </div>

      {/* Daily Views Bar Chart (Linked to Total Views) */}
      <Card className="bg-slate-900 border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-sky-400 shrink-0" />
            <h3 className="text-sm font-bold text-slate-100">Daily Views Breakdown</h3>
          </div>
          <Badge variant="outline" className="text-[11px] font-semibold text-sky-400 border-sky-500/30">
            Total: {analyticsData.stats.totalViews} views
          </Badge>
        </div>

        <div className="flex items-end justify-between gap-2 sm:gap-4 h-44 pt-6 pb-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
          {analyticsData.recentViews?.map((item, idx) => {
            const heightPercent = Math.max(12, Math.round((item.views / maxViews) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                {/* Tooltip on Hover */}
                <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-800 text-slate-100 text-[11px] font-semibold py-1 px-2 rounded-md border border-slate-700 pointer-events-none z-10 whitespace-nowrap shadow-xl">
                  {item.views} views • {item.downloads} downloads
                </div>

                {/* Top Count Label */}
                <span className="text-[11px] font-bold text-slate-400 mb-1 group-hover:text-sky-300 group-hover:scale-110 transition-all">
                  {item.views}
                </span>

                {/* Animated Vertical Bar */}
                <div 
                  className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-sky-600 to-cyan-400 group-hover:from-sky-500 group-hover:to-cyan-300 transition-all duration-300 shadow-sm shadow-sky-950/50"
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Day Label */}
                <span className="text-xs font-semibold text-slate-400 mt-2 group-hover:text-slate-200">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Referrer Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
          <TrendingUp className="size-4 text-sky-400 shrink-0" />
          <span>Traffic Sources & Referrers</span>
        </div>

        <Card className="bg-slate-900 border-slate-800 overflow-hidden divide-y divide-slate-800/60 p-0">
          {analyticsData.topReferrers.map((ref, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 px-4 hover:bg-slate-800/40 transition-colors">
              <span className="text-xs font-semibold text-slate-200">{ref.source}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">{ref.count} views</span>
                <Badge variant="blue" className="text-[11px] font-bold">
                  {ref.percentage}
                </Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Privacy Notice */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-xs font-medium text-emerald-400">
        <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
        <span>Privacy-First Tracking: Zero cookies, GDPR compliant, no IP storage.</span>
      </div>
    </div>
  );
}

