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
  RefreshCw,
  Lock
} from 'lucide-react';

import { Card } from '@/frontend/src/components/ui/card';
import { Button } from '@/frontend/src/components/ui/button';
import { Badge } from '@/frontend/src/components/ui/badge';
import { Textarea } from '@/frontend/components/ui/textarea';
import { ProgressCircular } from '@/frontend/src/components/ui/progress-circular';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '../ui/empty';
import { useCv, useAuth, useTRPC, useAiProposal } from '@/frontend/src/context/index.jsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzeAtsMatch } from '../../utils/atsAnalyzer.js';
import { sendChatMessageApi } from '../ai/api/aiApi.js';

function getGradientId(score) {
  if (score >= 90) return 'ats-grad-excellent';
  if (score >= 75) return 'ats-grad-good';
  if (score >= 50) return 'ats-grad-medium';
  return 'ats-grad-low';
}

function getScoreTextColor(score) {
  if (score >= 90) return 'text-emerald-400';
  if (score >= 75) return 'text-indigo-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-rose-400';
}


export default function AtsOptimizerTab(props = {}) {
  const { cvData: cvCtxData, styleData } = useCv();
  const cvData = props.cvData ?? cvCtxData;
  const auth = useAuth() || {};
  const currentUser = auth.currentUser;
  const { handleApplyPatches } = useAiProposal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Query persistent Target Jobs from backend per user
  const targetJobsQuery = useQuery({
    ...trpc.targetJobs.getAll.queryOptions(currentUser?.id || ''),
    refetchOnWindowFocus: true,
  });

  const dbJobs = targetJobsQuery.data?.jobs;
  const jobs = dbJobs || [];

  const updateJobMutation = useMutation(
    trpc.targetJobs.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.targetJobs.getAll.queryKey() });
      },
    })
  );

  const [selectedJobId, setSelectedJobId] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  
  // Cover Letter Modal States
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [activeModalJob, setActiveModalJob] = useState(null);
  const [modalCoverLetterText, setModalCoverLetterText] = useState("");
  const [copiedModalLetter, setCopiedModalLetter] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const [tempJdText, setTempJdText] = useState(activeJob?.description || "");

  // Display scores state for animated circular meters
  const [displayScores, setDisplayScores] = useState({
    current: activeJob?.currentScore || 0,
    potential: activeJob?.potentialScore || 0
  });

  // Sync tempJdText and scores when activeJob changes
  React.useEffect(() => {
    if (activeJob) {
      setTempJdText(activeJob.description || "");
      setDisplayScores({
        current: activeJob.currentScore || 0,
        potential: activeJob.potentialScore || 0
      });
    }
  }, [activeJob?.id, activeJob?.currentScore, activeJob?.potentialScore, activeJob?.description]);

  // Real-time listener for Web Extension import events
  React.useEffect(() => {
    const handleExtensionMessage = (event) => {
      if (event.data?.type === 'CVBUILDER_JOB_IMPORTED') {
        queryClient.invalidateQueries({ queryKey: trpc.targetJobs.getAll.queryKey() });
        if (event.data?.job?.id) {
          setSelectedJobId(event.data.job.id);
        }
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [queryClient, trpc]);

  const handleSelectJob = (job) => {
    setSelectedJobId(job.id);
    setTempJdText(job.description);
  };

  const handleOpenJdModal = () => {
    setTempJdText(activeJob.description);
    setIsJdModalOpen(true);
  };

  const handleSaveJdText = () => {
    updateJobMutation.mutate({ id: activeJob.id, description: tempJdText });
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
    updateJobMutation.mutate({ id: job.id, coverLetter: generated });
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
    link.href = url;
    const safeCompany = (activeModalJob.company || 'Job').replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `Scrisoare_Intentie_${safeCompany}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. Algorithmic ATS Analysis (Zero AI Calls)
  const handleRunAtsAnalysis = () => {
    if (!activeJob) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const { currentScore, potentialScore } = analyzeAtsMatch(cvData, activeJob);

      // Smooth animated count-up fill for circular meters
      let currentVal = 0;
      const step = Math.max(1, Math.round(currentScore / 20));
      const interval = setInterval(() => {
        currentVal += step;
        if (currentVal >= currentScore) {
          clearInterval(interval);
          setDisplayScores({
            current: currentScore,
            potential: potentialScore
          });
        } else {
          const ratio = currentVal / currentScore;
          setDisplayScores({
            current: currentVal,
            potential: Math.round(potentialScore * ratio)
          });
        }
      }, 25);

      updateJobMutation.mutate({
        id: activeJob.id,
        currentScore,
        potentialScore,
        maxScoreAchieved: Math.max(activeJob.maxScoreAchieved || 0, currentScore)
      });

      setIsAnalyzing(false);
    }, 750);
  };

  // 2. AI Optimization Call (Executed exclusively on "Implement" with Rate Limiting)
  const handleRunAiOptimization = async () => {
    if (!activeJob || activeJob.isOptimized || isOptimizing) return;
    setIsOptimizing(true);

    try {
      await sendChatMessageApi({
        messages: [
          {
            sender: 'user',
            text: `Te rog să optimizezi CV-ul meu pentru job-ul "${activeJob.title}" la compania "${activeJob.company}".
Cerințe job:
${activeJob.description}

Adaptează secțiunea de summary profesional, adaugă skill-urile cheie relevante din cerințe și optimizează bullet point-urile din experiență pentru a maximiza compatibilitatea ATS cu acest rol. Generează modificările exclusiv sub formă de RFC 6902 JSON Patches wrapped într-un code block \`\`\`json patch.`
          }
        ],
        cvData,
        styleData,
        currentUser,
        onComplete: ({ accumulatedText, patches }) => {
          setIsOptimizing(false);
          if (patches && patches.length > 0) {
            const cleanExplanation = accumulatedText.replace(/```json[\s\S]*?```/g, '').trim();
            handleApplyPatches({
              explanation: cleanExplanation || `Optimizare ATS aplicată pentru rolul de ${activeJob.title} (${activeJob.company}).`,
              patches
            });
          }

          const targetScore = activeJob.potentialScore || 92;
          setDisplayScores({
            current: targetScore,
            potential: targetScore
          });

          // Non-idempotent Rate Limit: mark job as optimized once
          updateJobMutation.mutate({
            id: activeJob.id,
            isOptimized: true,
            currentScore: targetScore,
            maxScoreAchieved: Math.max(activeJob.maxScoreAchieved || 0, targetScore)
          });
        },
        onError: (err) => {
          setIsOptimizing(false);
          console.error('Eroare optimizare AI:', err);
        }
      });
    } catch (err) {
      setIsOptimizing(false);
      console.error('Eroare apel optimizare AI:', err);
    }
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
            <span>Target Jobs</span>
          </label>
          <Badge variant="outline" className="text-[10px] text-indigo-300 border-indigo-500/30">
            Count: {jobs.length}
          </Badge>
        </div>

        {/* Scrollable Container Box (chenar) */}
        <div className="max-h-[700px] overflow-y-auto space-y-2.5 pr-1.5 custom-scrollbar">
          {!currentUser ? (
            <Empty className="border-slate-800 bg-slate-900/60 p-6 shadow-sm">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Lock className="size-5" />
                </EmptyMedia>
                <EmptyTitle className="text-sm font-bold text-slate-100">
                  Autentificare necesară
                </EmptyTitle>
                <EmptyDescription className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Conectați-vă în cont pentru a accesa și sincroniza lista job-urilor țintă importate prin extensie.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex flex-col items-center gap-2">
                <Button
                  onClick={() => auth?.openAuthModal?.()}
                  size="sm"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-md transition-all cursor-pointer"
                >
                  <Lock className="size-3.5" />
                  Conectare / Autentificare
                </Button>
              </EmptyContent>
            </Empty>
          ) : jobs.length === 0 ? (
            <Empty className="border-slate-800 bg-slate-900/60 p-6 shadow-sm">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Briefcase className="size-5" />
                </EmptyMedia>
                <EmptyTitle className="text-sm font-bold text-slate-100">
                  Niciun job țintă în listă
                </EmptyTitle>
                <EmptyDescription className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Nu aveți niciun job țintă salvat în cont. Folosiți extensia de browser <strong>CVBuilder Job Extractor</strong> pentru a importa job-uri direct de pe paginile web.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            jobs.map((job) => {
              const isSelected = activeJob && job.id === activeJob.id;
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
                      {job.isOptimized ? (
                        <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40 bg-emerald-500/10 gap-1 font-semibold">
                          <CheckCircle2 className="size-3 text-emerald-400" />
                          Optimized
                        </Badge>
                      ) : job.currentScore > 0 ? (
                        <Badge variant="outline" className="text-[10px] text-indigo-300 border-indigo-500/30 font-semibold">
                          {job.currentScore}% ATS
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30 bg-amber-500/5 font-semibold">
                          Nou
                        </Badge>
                      )}

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
                        <span>Letter</span>
                      </Button>

                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Job Analysis Dashboard */}
      {activeJob ? (
        <Card className="bg-slate-900 border-slate-800 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <img 
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${activeJob.iconSeed}`} 
              alt={activeJob.company} 
              className="w-9 h-9 rounded-lg bg-slate-950 p-1 border border-slate-800 shrink-0"
            />
            <div>
              <div className="flex items-start gap-2">
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
            Edit JD
          </Button>
        </div>

        {/* Dual ProgressCircular Bars: Current Match vs AI Suggested Match */}
        <div className="space-y-4">
          {/* Dynamic SVG Gradients for Circular Progress */}
          <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
              <linearGradient id="ats-grad-excellent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="ats-grad-good" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="ats-grad-medium" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id="ats-grad-low" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-indigo-400" />
              ATS compatibility
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/70 p-5 rounded-xl border border-slate-800/80">
            {/* ProgressCircular Bar 1: Current ATS Match */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900/40 border border-slate-800/50 space-y-3">
              <ProgressCircular 
                value={displayScores.current} 
                size={110}
                thickness={8}
                trackClassName="text-slate-800/80 stroke-current"
                rangeStyle={{ stroke: `url(#${getGradientId(displayScores.current)})` }}
                centerContent={
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <span className={`text-2xl font-black tracking-tight ${getScoreTextColor(displayScores.current)}`}>
                      {displayScores.current > 0 ? `${displayScores.current}%` : '--'}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Current</span>
                  </div>
                }
              />
              <div className="text-center space-y-0.5">
                <span className="text-xs font-bold text-slate-200">Current Match</span>
                <p className="text-[10px] text-slate-400">Compatibilitate pe baza versiunii curente a CV-ului</p>
              </div>
            </div>

            {/* ProgressCircular Bar 2: Match ulterior modificărilor sugerate de AI */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900/40 border border-slate-800/50 space-y-3">
              <ProgressCircular 
                value={displayScores.potential} 
                size={110}
                thickness={8}
                trackClassName="text-slate-800/80 stroke-current"
                rangeStyle={{ stroke: `url(#${getGradientId(displayScores.potential)})` }}
                centerContent={
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <span className={`text-2xl font-black tracking-tight ${getScoreTextColor(displayScores.potential)}`}>
                      {displayScores.potential > 0 ? `${displayScores.potential}%` : '--'}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Potential</span>
                  </div>
                }
              />
              <div className="text-center space-y-0.5">
                <span className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1">
                  <Sparkles className="size-3 text-cyan-400" />
                  Potential Match
                </span>
                <p className="text-[10px] text-slate-400">Scor estimat după optimizarea cuvinte-cheie sugerate de AI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Action Button: Analyze (Algorithmic) -> Implement (AI) -> Optimized (Disabled) */}
        {activeJob.isOptimized ? (
          <Button 
            disabled
            className="w-full h-11 text-sm font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 gap-2 cursor-not-allowed opacity-90 shadow-sm"
          >
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>Optimized</span>
          </Button>
        ) : activeJob.currentScore === 0 ? (
          <Button 
            onClick={handleRunAtsAnalysis} 
            disabled={isAnalyzing}
            className="w-full h-11 text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 gap-2 shadow-lg shadow-amber-950/40 transition-all duration-200"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="size-4 animate-spin text-slate-950" />
                <span>Se analizează compatibilitatea ATS (algoritmic)...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-slate-950" />
                <span>Analyze</span>
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleRunAiOptimization} 
            disabled={isOptimizing}
            className="w-full h-11 text-sm font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white gap-2 shadow-lg shadow-indigo-950/50 transition-all duration-200"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="size-4 animate-spin text-purple-300" />
                <span>Se generează optimizările cu AI (JSON Patch)...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-cyan-300" />
                <span>Implement (Optimize with AI)</span>
              </>
            )}
          </Button>
        )}
      </Card>
      ) : (
        <Card className="bg-slate-900/50 border-slate-800/80 p-8 text-center text-slate-400 space-y-2">
          <Briefcase className="size-8 text-slate-600 mx-auto" />
          <p className="text-xs">
            {currentUser 
              ? "Selectați sau importați un job țintă din lista de mai sus pentru a rula analiza și optimizarea ATS."
              : "Autentificați-vă pentru a activa analiza automată a compatibilității ATS."}
          </p>
        </Card>
      )}

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


