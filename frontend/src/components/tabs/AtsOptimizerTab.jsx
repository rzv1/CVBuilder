import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Plus, 
  X, 
  Briefcase, 
  Check, 
  Copy, 
  Award, 
  Loader2,
  FileCheck,
  Download,
  Building2,
  RefreshCw
} from 'lucide-react';
import { MOCK_ATS_JOB_DESCRIPTION } from '../../mockData.js';
import { Card } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';
import { Textarea } from '@/frontend/components/ui/textarea';
import { Progress } from '@/frontend/components/ui/progress';

const INITIAL_TARGET_JOBS = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer",
    company: "TechScale Solutions",
    location: "Remote / USA",
    importedAt: "Extensie Web • Acum 10 min",
    iconSeed: "TechScale",
    description: MOCK_ATS_JOB_DESCRIPTION,
    currentScore: 84,
    potentialScore: 96,
    maxScoreAchieved: 84,
    coverLetter: `Stimate Manager de Recrutare,\n\nVă scriu pentru a-mi exprima interesul ferm pentru poziția de Senior Full Stack Engineer în cadrul TechScale Solutions.\n\nCu o experiență vastă în dezvoltarea de aplicații web de înaltă performanță și scalabilitate (React, Node.js, Arhitecturi Cloud), consider că profilul meu tehnic se potrivește excelent cerințelor din Job Description. În rolurile mele anterioare am optimizat timpul de răspuns al API-urilor cu peste 75% și am condus echipe în livrarea de produse critice.\n\nSunt entuziasmat de oportunitatea de a contribui la obiectivele echipei TechScale Solutions.\n\nCu stimă,\nAlexandru Popescu`
  },
  {
    id: "job-2",
    title: "Frontend Architect & Tech Lead",
    company: "CloudCore Systems",
    location: "București / Hybrid",
    importedAt: "Extensie Web • Ieri",
    iconSeed: "CloudCore",
    description: "Căutăm un Frontend Architect cu experiență avansată în React 19, Next.js, WebGL, TypeScript, Tailwind CSS și arhitecturi micro-frontend high-scale...",
    currentScore: 72,
    potentialScore: 90,
    maxScoreAchieved: 75,
    coverLetter: `Stimate Manager de Recrutare CloudCore Systems,\n\nVă adresetez această scrisoare de intenție pentru rolul de Frontend Architect & Tech Lead.\n\nExperiența mea în optimizarea UI-urilor complexe, dezvoltarea de sisteme de design scalabile în React/TypeScript și conducerea tehnică a echipelor frontend îmi oferă încrederea că pot aduce valoare imediată proiectelor CloudCore Systems.\n\nCu respect,\nAlexandru Popescu`
  },
  {
    id: "job-3",
    title: "Lead Backend Engineer (Node.js)",
    company: "DataStream Tech",
    location: "Remote / EU",
    importedAt: "Extensie Web • Acum 3 zile",
    iconSeed: "DataStream",
    description: "DataStream recrutează Lead Backend Engineer expert în Node.js, Express, PostgreSQL, Redis, Kubernetes și microservicii distribuite...",
    currentScore: 68,
    potentialScore: 88,
    maxScoreAchieved: 70,
    coverLetter: `Stimate Echipă DataStream Tech,\n\nDoresc să îmi depun candidatura pentru poziția de Lead Backend Engineer (Node.js).\n\nSpecializat în microservicii distribuite, optimizare baze de date PostgreSQL/Redis și arhitecturi cu latență redusă, consider că pot sprijini extinderea platformelor DataStream.\n\nCu stimă,\nAlexandru Popescu`
  }
];

export default function AtsOptimizerTab({ cvData }) {
  const [jobs, setJobs] = useState(INITIAL_TARGET_JOBS);
  const [selectedJobId, setSelectedJobId] = useState("job-1");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  
  // Cover Letter Modal States
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [activeModalJob, setActiveModalJob] = useState(null);
  const [modalCoverLetterText, setModalCoverLetterText] = useState("");
  const [copiedModalLetter, setCopiedModalLetter] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const [tempJdText, setTempJdText] = useState(activeJob.description);

  const handleSelectJob = (job) => {
    setSelectedJobId(job.id);
    setTempJdText(job.description);
  };

  const handleOpenJdModal = () => {
    setTempJdText(activeJob.description);
    setIsJdModalOpen(true);
  };

  const handleSaveJdText = () => {
    setJobs(jobs.map(j => j.id === activeJob.id ? { ...j, description: tempJdText } : j));
    setIsJdModalOpen(false);
  };

  const handleOpenCoverLetterModal = (job) => {
    setActiveModalJob(job);
    setModalCoverLetterText(job.coverLetter || "");
    setIsCoverLetterModalOpen(true);
  };

  const handleGenerateCoverLetterForJob = async (job) => {
    setActiveModalJob(job);
    setIsGeneratingLetter(true);
    setIsCoverLetterModalOpen(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const generated = `Stimate Manager de Recrutare,\n\nVă scriu pentru a-mi exprima interesul ferm pentru poziția de ${job.title} în cadrul ${job.company}.\n\nCu o experiență vastă în dezvoltarea de aplicații web de înaltă performanță și scalabilitate, consider că profilul meu tehnic se potrivește excelent cerințelor din Job Description. În rolurile mele anterioare am condus echipe în livrarea de produse critice și optimizarea sistemelor distribuite.\n\nSunt entuziasmat de oportunitatea de a contribui la obiectivele echipei ${job.company}.\n\nCu stimă,\n${cvData?.personal?.name || 'Alexandru Popescu'}`;

    setModalCoverLetterText(generated);
    setJobs(jobs.map(j => j.id === job.id ? { ...j, coverLetter: generated } : j));
    setIsGeneratingLetter(false);
  };

  const handleCopyModalCoverLetter = () => {
    navigator.clipboard.writeText(modalCoverLetterText);
    setCopiedModalLetter(true);
    setTimeout(() => setCopiedModalLetter(false), 2000);
  };

  const handleDownloadCoverLetter = () => {
    if (!modalCoverLetterText || !activeModalJob) return;
    const blob = new Blob([modalCoverLetterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeCompany = activeModalJob.company.replace(/[^a-zA-Z0-9_\-]/g, '_');
    link.href = url;
    link.download = `Scrisoare_Intentie_${safeCompany}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunAtsAnalysis = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      const newScore = Math.min(100, activeJob.currentScore + 4);
      const newMaxScore = Math.max(activeJob.maxScoreAchieved, newScore);

      setJobs(jobs.map(j => j.id === activeJob.id ? {
        ...j,
        currentScore: newScore,
        maxScoreAchieved: newMaxScore
      } : j));
    }, 1200);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-base font-extrabold text-slate-100">
          <Target className="size-4 text-emerald-400 shrink-0" />
          <span>ATS Compatibility Analyzer</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Selectează un job țintă din lista de mai jos pentru a analiza potrivirea CV-ului, a vizualiza sau genera scrisoarea de intenție.
        </p>
      </div>

      {/* Target Jobs List Selector - Vertical Stack with Horizontal Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Briefcase className="size-3.5 text-indigo-400" />
            <span>Job-uri Țintă Importate (Extensie Web)</span>
          </label>
          <Badge variant="outline" className="text-[10px] text-indigo-300 border-indigo-500/30">
            {jobs.length} Job-uri Salvate
          </Badge>
        </div>

        {/* Scrollable Container (max-h-72 / 300px) */}
        <div className="max-h-[300px] overflow-y-auto space-y-2.5 pr-1.5 custom-scrollbar">
          {jobs.map((job) => {
            const isSelected = job.id === activeJob.id;
            return (
              <Card
                key={job.id}
                onClick={() => handleSelectJob(job)}
                className={`p-3.5 cursor-pointer transition-all duration-200 relative border ${
                  isSelected 
                    ? 'bg-slate-900 border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-950/40' 
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Side: Job Icon + Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${job.iconSeed}`} 
                      alt={job.company} 
                      className="w-10 h-10 rounded-xl bg-slate-950 p-1 border border-slate-800/80 shrink-0"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-100 truncate">{job.title}</h4>
                        {isSelected && (
                          <CheckCircle2 className="size-3.5 text-indigo-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {job.company} • <span className="text-slate-500">{job.location}</span>
                      </p>
                      <div className="text-[10px] text-slate-500">{job.importedAt}</div>
                    </div>
                  </div>

                  {/* Right Side: Score Badge & Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 sm:self-center">
                    <Badge variant="purple" className="text-[10px] font-bold py-1 px-2 shrink-0">
                      Max: {job.maxScoreAchieved}%
                    </Badge>

                    {/* View Cover Letter Modal Trigger */}
                    <Button 
                      variant="outline" 
                      size="xs" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCoverLetterModal(job);
                      }}
                      className="gap-1.5 text-[11px] font-semibold bg-slate-950/60 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:text-white"
                      title="Vizualizează Scrisoarea de Intenție"
                    >
                      <FileText className="size-3.5 text-purple-400" />
                      <span>Vezi Scrisoare</span>
                    </Button>

                    {/* Generate Cover Letter Standalone Button */}
                    <Button 
                      variant="secondary" 
                      size="xs" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateCoverLetterForJob(job);
                      }}
                      className="gap-1.5 text-[11px] font-semibold bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50 hover:text-white"
                      title="Generează scrisoare de intenție cu AI"
                    >
                      <Sparkles className="size-3.5 text-indigo-400" />
                      <span>Generează</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Selected Job Analysis Dashboard */}
      <Card className="bg-slate-900 border-slate-800 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <img 
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${activeJob.iconSeed}`} 
              alt={activeJob.company} 
              className="w-9 h-9 rounded-lg bg-slate-950 p-1 border border-slate-800 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-100">{activeJob.title}</h3>
                <Badge variant="blue" className="text-[10px]">{activeJob.company}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeJob.location}</p>
            </div>
          </div>

          {/* Job Description Modal Trigger Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenJdModal}
            className="gap-2 text-xs font-semibold bg-slate-950/60 border-slate-700 text-slate-200 hover:bg-slate-800 shrink-0"
          >
            <FileText className="size-3.5 text-sky-400" />
            Vezi / Editează Text JD
          </Button>
        </div>

        {/* Dual Progress Bars: Current Match vs AI Suggested Match */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-indigo-400" />
              Scoruri de Compatibilitate ATS (Match Progress)
            </span>
            <div className="flex items-center gap-2">
              <Award className="size-3.5 text-amber-400" />
              <span className="text-[11px] text-amber-300 font-semibold">
                Scor Maxim Obținut: <strong className="text-white">{activeJob.maxScoreAchieved}%</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            {/* Progress Bar 1: Current ATS Match */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Match Curent ATS</span>
                <span className="text-indigo-400 font-extrabold text-sm">{activeJob.currentScore}%</span>
              </div>
              <Progress 
                value={activeJob.currentScore} 
                indicatorClassName="bg-gradient-to-r from-indigo-600 to-blue-500" 
                className="h-2.5"
              />
              <p className="text-[10px] text-slate-400">Compatibilitate pe baza versiunii curente a CV-ului</p>
            </div>

            {/* Progress Bar 2: Match ulterior modificărilor sugerate de AI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Sparkles className="size-3 text-cyan-400" />
                  Match cu Modificări AI
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="success" className="text-[9px] py-0 px-1 font-bold">
                    +{activeJob.potentialScore - activeJob.currentScore}% Boost
                  </Badge>
                  <span className="text-emerald-400 font-extrabold text-sm">{activeJob.potentialScore}%</span>
                </div>
              </div>
              <Progress 
                value={activeJob.potentialScore} 
                indicatorClassName="bg-gradient-to-r from-cyan-500 to-emerald-400" 
                className="h-2.5"
              />
              <p className="text-[10px] text-slate-400">Scor estimat după optimizarea cuvinte-cheie sugerate de AI</p>
            </div>
          </div>
        </div>

        {/* Analysis Action Button */}
        <Button 
          onClick={handleRunAtsAnalysis} 
          disabled={isAnalyzing}
          className="w-full h-11 text-sm font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white gap-2 shadow-lg shadow-indigo-950/50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Se analizează potrivirea cuvinte-cheie & vectori...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span>Analyze ATS & Keyword Match</span>
            </>
          )}
        </Button>
      </Card>

      {/* Cover Letter Modal Overlay */}
      {isCoverLetterModalOpen && activeModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-2xl p-0 overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Scrisoare de Intenție (Cover Letter)</h2>
                  <p className="text-xs text-slate-400">{activeModalJob.title} — {activeModalJob.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCoverLetterModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {isGeneratingLetter ? (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 className="size-8 animate-spin text-indigo-400" />
                  <p className="text-xs font-semibold text-slate-300">
                    Se generează scrisoarea de intenție cu AI pe baza cerințelor din Job Description...
                  </p>
                </div>
              ) : (
                <Textarea 
                  rows={12}
                  value={modalCoverLetterText}
                  onChange={(e) => setModalCoverLetterText(e.target.value)}
                  placeholder="Scrisoarea de intenție va fi generată aici..."
                  className="bg-slate-950 font-sans text-xs text-slate-200 border-slate-800 focus:border-purple-500 leading-relaxed"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-slate-950/40 border-t border-slate-800">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleGenerateCoverLetterForJob(activeModalJob)}
                disabled={isGeneratingLetter}
                className="gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40"
              >
                <RefreshCw className="size-3.5" />
                Regenerează cu AI
              </Button>

              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyModalCoverLetter}
                  disabled={!modalCoverLetterText || isGeneratingLetter}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Copy className="size-3.5" />
                  {copiedModalLetter ? "Copiat!" : "Copiază Textul"}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleDownloadCoverLetter}
                  disabled={!modalCoverLetterText || isGeneratingLetter}
                  className="gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <Download className="size-3.5" />
                  Descarcă (.txt)
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Job Description Text Overlay Modal */}
      {isJdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-2xl p-0 overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Text Job Description (JD)</h2>
                  <p className="text-xs text-slate-400">{activeJob.title} — {activeJob.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsJdModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body - Textarea */}
            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-400">
                Lipește sau editează mai jos textul integral al anunțului de angajare pentru a fi procesat de algoritmul ATS:
              </p>
              <Textarea 
                rows={12}
                value={tempJdText}
                onChange={(e) => setTempJdText(e.target.value)}
                placeholder="Lipește textul anunțului de angajare aici..."
                className="bg-slate-950 font-mono text-xs text-slate-200 border-slate-800 focus:border-indigo-500 leading-relaxed"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-4 bg-slate-950/40 border-t border-slate-800">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsJdModalOpen(false)}
                className="text-xs font-semibold"
              >
                Anulează
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveJdText}
                className="gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                <Check className="size-3.5" />
                Salvează Text JD
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}


