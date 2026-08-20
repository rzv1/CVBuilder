import React from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/frontend/components/ui/input';
import { Textarea } from '@/frontend/components/ui/textarea';

export default function PersonalDetailsSection({
  activeSection,
  toggleSection,
  personalData,
  handlePersonalChange
}) {
  const isOpen = activeSection === 'personal';

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden shadow-sm">
      <button
        type="button"
        className={`w-full flex items-center justify-between p-4 px-5 text-left transition-colors ${
          isOpen ? 'bg-slate-800/80 border-b border-slate-700/60' : 'hover:bg-slate-800/40'
        }`}
        onClick={() => toggleSection('personal')}
      >
        <div className="flex items-center gap-2.5">
          <User className="size-5 text-blue-400" />
          <span className="text-sm font-bold text-slate-100">Personal Details</span>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 space-y-4 bg-slate-950/60">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <Input
              type="text"
              placeholder="e.g. Alexandru Popescu"
              value={personalData?.name || ''}
              onChange={(e) => handlePersonalChange('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Professional Title</label>
              <Input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer"
                value={personalData?.title || ''}
                onChange={(e) => handlePersonalChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <Input
                type="email"
                placeholder="e.g. alex@techdev.io"
                value={personalData?.email || ''}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Phone Number</label>
              <Input
                type="text"
                placeholder="e.g. +40 722 123 456"
                value={personalData?.phone || ''}
                onChange={(e) => handlePersonalChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Location</label>
              <Input
                type="text"
                placeholder="e.g. Bucharest, Romania"
                value={personalData?.address || ''}
                onChange={(e) => handlePersonalChange('address', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Professional Summary</label>
            <Textarea
              rows={3}
              placeholder="Write a concise overview of your technical experience, domain expertise, and core strengths..."
              value={personalData?.summary || ''}
              onChange={(e) => handlePersonalChange('summary', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
