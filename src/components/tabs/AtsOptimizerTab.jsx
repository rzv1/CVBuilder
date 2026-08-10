import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Zap, 
  FileText,
  TrendingUp,
  AlertTriangle
} from '../Icons';
import { MOCK_ATS_JOB_DESCRIPTION } from '../../mockData';

export default function AtsOptimizerTab({ cvData, onTriggerMockProposal }) {
  const [jobDescription, setJobDescription] = useState(MOCK_ATS_JOB_DESCRIPTION);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState(84);

  const matchedKeywords = [
    { name: "React", count: 4, type: "high" },
    { name: "TypeScript", count: 3, type: "high" },
    { name: "Node.js", count: 3, type: "high" },
    { name: "GraphQL", count: 2, type: "medium" },
    { name: "Docker", count: 2, type: "medium" },
    { name: "Redis", count: 2, type: "medium" },
    { name: "CI/CD Caching", count: 1, type: "medium" }
  ];

  const missingKeywords = [
    { name: "Kubernetes", impact: "High Impact", recommendation: "Add under Cloud Skills or TechScale role" },
    { name: "Next.js", impact: "Medium Impact", recommendation: "Mention in summary or CloudCore SaaS role" },
    { name: "Microservices Architecture", impact: "High Impact", recommendation: "Already in bullets, format as explicit skill" }
  ];

  const weakBullets = [
    {
      current: cvData?.experience?.[0]?.bullets?.[0] || "Developed backend APIs and managed database queries.",
      improved: "Accomplished 75% reduction in p99 response times as measured by latency benchmarks, by optimizing PostgreSQL indexing strategies.",
      reason: "Missing quantifiable metrics & Google XYZ formula format."
    }
  ];

  const handleRunAtsAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAtsScore(88);
    }, 1200);
  };

  const handleSimulateAiProposal = () => {
    if (onTriggerMockProposal) {
      onTriggerMockProposal({
        id: 'prop-' + Date.now(),
        sectionTitle: 'Experience: Lead Full Stack Engineer',
        expId: cvData?.experience?.[0]?.id || '1',
        bulletIndex: 0,
        originalText: cvData?.experience?.[0]?.bullets?.[0] || weakBullets[0].current,
        proposedText: weakBullets[0].improved,
        reason: weakBullets[0].reason,
        atsGain: 12
      });
    }
  };

  return (
    <div className="ats-optimizer-tab">
      {/* Interactive AI Proposal Mockup Section */}
      <div style={{ background: 'linear-gradient(135deg, #312e81, #1e1b4b)', padding: '1rem', borderRadius: '12px', border: '1px dashed #a855f7', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} style={{ color: '#c084fc' }} /> Mockup: Visual AI Proposal & Approval Workflow
          </span>
          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>FEATURE MOCKUP</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, marginBottom: '0.75rem' }}>
          Activează simulat fluxul de verificare AI pe preview (A4 sheet). Oferă comutator Before / After și pop-up de acceptare (pe profilul curent sau cu creare de profil nou).
        </p>
        <button 
          type="button"
          className="action-btn action-btn-primary" 
          style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', border: 'none', fontWeight: 700, padding: '0.6rem 1rem' }}
          onClick={handleSimulateAiProposal}
        >
          <Sparkles size={16} /> Simulează Propunere Modificare AI (Diff & Approve)
        </button>
      </div>

      {/* ATS Header & Score Gauge */}
      <div className="ats-score-container">
        <div className="score-ring">
          <div className="score-ring-inner">
            <span className="score-number">{atsScore}%</span>
            <span className="score-label">ATS MATCH</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1rem', color: '#f3f4f6' }}>
            <Target size={18} style={{ color: '#34d399' }} /> ATS Compatibility Analyzer
          </div>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.2rem' }}>
            Semantic TF-IDF & Vector Embedding comparison between your active CV and target Job Description.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
            <span className="badge badge-green"><CheckCircle size={10} /> 12 Matched Keywords</span>
            <span className="badge badge-warning"><AlertTriangle size={10} /> 3 Missing Keywords</span>
          </div>
        </div>
      </div>

      {/* Target Job Description Input */}
      <div className="form-group">
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Target Job Description (JD)</span>
          <span style={{ fontSize: '0.7rem', color: '#60a5fa', cursor: 'pointer' }} onClick={() => setJobDescription(MOCK_ATS_JOB_DESCRIPTION)}>
            Load Sample Senior Full Stack JD
          </span>
        </label>
        <textarea 
          className="input-field" 
          rows={5}
          style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}
          value={jobDescription} 
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <button 
          className="action-btn action-btn-primary" 
          style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
          onClick={handleRunAtsAnalysis}
          disabled={isAnalyzing}
        >
          <Sparkles size={16} />
          {isAnalyzing ? "Running Vector Embedding Matcher..." : "Analyze ATS & Keyword Match"}
        </button>
      </div>

      {/* Matched Keywords Grid */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle size={14} /> Found & Matched ATS Keywords
        </div>
        <div className="keywords-grid">
          {matchedKeywords.map((kw, i) => (
            <span key={i} className="badge badge-green">
              {kw.name} <span style={{ opacity: 0.7 }}>({kw.count}x)</span>
            </span>
          ))}
        </div>
      </div>

      {/* Missing Keywords & Actionable Recommendations */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <XCircle size={14} /> Missing High-Impact Keywords
        </div>
        
        {missingKeywords.map((kw, i) => (
          <div key={i} style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem', borderLeft: '3px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.85rem', color: '#f3f4f6' }}>{kw.name}</strong>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>{kw.impact}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>
              💡 Recommendation: {kw.recommendation}
            </div>
          </div>
        ))}
      </div>

      {/* Smart XYZ Bullet Optimizer Suggestions */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={14} /> AI Smart Rewriter Suggestions (Google XYZ Formula)
        </div>

        {weakBullets.map((wb, i) => (
          <div key={i} style={{ background: 'linear-gradient(135deg, #1e1b4b, #1e293b)', padding: '0.9rem', borderRadius: '10px', border: '1px solid #6366f1' }}>
            <div style={{ fontSize: '0.75rem', color: '#ef4444', textDecoration: 'line-through' }}>
              Original: "{wb.current}"
            </div>
            <div style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600, marginTop: '0.35rem', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ArrowRight size={14} style={{ marginTop: '2px' }} /> Suggested: "{wb.improved}"
            </div>
            <div style={{ fontSize: '0.7rem', color: '#c084fc', marginTop: '0.4rem', marginBottom: '0.6rem' }}>
              Reason: {wb.reason}
            </div>
            <button 
              className="action-btn action-btn-primary" 
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              onClick={handleSimulateAiProposal}
            >
              <Sparkles size={13} /> Revizuiește & Aplică cu AI Diff
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
