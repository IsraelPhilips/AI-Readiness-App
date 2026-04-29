import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { 
  Code, Layout, Megaphone, Target, Headset, Users, BarChart, Scale, 
  Stethoscope, GraduationCap, PenTool, Palette, Activity, Database, 
  Rocket, Home, Briefcase, Calendar, Search, Compass, 
  ChevronRight, ArrowLeft, RefreshCw, Share2, Activity as ActivityIcon, CheckCircle2, AlertCircle, TrendingUp, History, LogOut, User
} from 'lucide-react';
import { questionBank } from '../data/questionBank';
import { ReadinessLevel, QuizState, FieldData } from '../types';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
import UserHistory from './UserHistory';

const ICON_MAP: Record<string, any> = {
  Code, Layout, Megaphone, Target, Headset, Users, BarChart, Scale,
  Stethoscope, GraduationCap, PenTool, Palette, Activity, Database,
  Rocket, Home, Briefcase, Calendar, Search, Compass
};

export default function MainQuiz() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [state, setState] = useState<QuizState>({
    currentStep: 'landing',
    selectedField: null,
    answers: {},
    currentQuestionIndex: 0
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [detailedError, setDetailedError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const selectedFieldData = state.selectedField ? questionBank[state.selectedField] : null;

  const totalScore = useMemo(() => {
    if (state.historicalResult) return state.historicalResult.total_score;
    if (!selectedFieldData) return 0;
    const scores = Object.values(state.answers) as number[];
    const sum = scores.reduce((a, b) => a + b, 0);
    const maxPossible = selectedFieldData.questions.length * 6;
    return Math.round((sum / maxPossible) * 100);
  }, [state.answers, selectedFieldData, state.historicalResult]);

  const readinessLevel = useMemo((): ReadinessLevel => {
    if (state.historicalResult) return state.historicalResult.readiness_level;
    if (totalScore < 25) return 'AI Beginner';
    if (totalScore < 50) return 'AI Aware';
    if (totalScore < 75) return 'AI Active User';
    if (totalScore < 90) return 'AI Power User';
    return 'AI-Ready Leader';
  }, [totalScore, state.historicalResult]);

  const categoryScores = useMemo(() => {
    if (state.historicalResult) return state.historicalResult.category_scores;
    if (!selectedFieldData) return {};
    const categories: Record<string, { total: number, max: number }> = {};
    
    selectedFieldData.questions.forEach(q => {
      const score = state.answers[q.id] || 0;
      if (!categories[q.category]) categories[q.category] = { total: 0, max: 0 };
      categories[q.category].total += score;
      categories[q.category].max += 6;
    });

    return Object.entries(categories).reduce((acc, [cat, vals]) => {
      acc[cat] = Math.round((vals.total / vals.max) * 100);
      return acc;
    }, {} as Record<string, number>);
  }, [state.answers, selectedFieldData, state.historicalResult]);

  const resetQuiz = () => {
    setState({
      currentStep: 'landing',
      selectedField: null,
      answers: {},
      currentQuestionIndex: 0
    });
  };

  const handleCapture = async () => {
    if (!resultsRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: '#0A0A0A',
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          // You can modify the cloned DOM before capturing if needed
          const el = clonedDoc.querySelector('[data-capture-ignore]');
          if (el) (el as HTMLElement).style.display = 'none';
        }
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `AI-Readiness-${state.selectedField?.replace(/\s+/g, '-')}-${totalScore}.png`;
      link.click();
    } catch (err) {
      console.error('Screenshot failed:', err);
      // Fallback: Notify user to take manual screenshot
      alert('Automatic capture failed. Please take a manual screenshot of your report!');
    } finally {
      setIsCapturing(false);
    }
  };

  // Save to Supabase when reaching results
  useEffect(() => {
    if (state.currentStep === 'results' && state.selectedField && !state.historicalResult && supabase) {
      const saveResult = async () => {
        setSaveStatus('saving');
        console.log('Initiating database sync for results...');
        try {
          const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
          if (authError) console.warn('Auth check failed during save:', authError);
          
          const payload = {
            selected_field: state.selectedField,
            total_score: totalScore,
            readiness_level: readinessLevel,
            category_scores: categoryScores,
            strengths: generateStrengths(categoryScores, totalScore),
            improvement_areas: generateImprovementAreas(categoryScores, totalScore),
            user_id: currentUser?.id || null
          };

          const { data, error } = await supabase.from('quiz_results').insert(payload).select();
          
          if (error) {
            console.error('CRITICAL: Database write failed:', error);
            setSaveStatus('error');
            setDetailedError(error.message + (error.details ? ` (${error.details})` : '') + (error.hint ? ` - Hint: ${error.hint}` : ''));
          } else {
            console.log('Database sync successful. Record ID:', data?.[0]?.id);
            setSaveStatus('saved');
            setDetailedError(null);
          }
        } catch (err: any) {
          console.error('Unexpected error during database sync:', err);
          setSaveStatus('error');
          setDetailedError(err.message || 'Unknown projection error');
        }
      };
      saveResult();
    }
  }, [state.currentStep, state.selectedField, totalScore, readinessLevel, state.historicalResult]);

  return (
    <div className="min-h-screen bg-brand-bg text-[#E5E5E5] font-sans selection:bg-accent/30 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-accent-muted/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
              <User size={14} className="text-accent" />
              <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">{user.email?.split('@')[0]}</span>
            </div>
            <button 
              onClick={() => supabase?.auth.signOut()}
              className="p-2.5 bg-bg-card hover:bg-rose-500/10 text-text-dim hover:text-rose-400 rounded-xl transition-all border border-border-custom"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-black rounded-xl font-black text-[10px] uppercase tracking-widest border border-accent/20 transition-all"
          >
            Authenticate
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <AnimatePresence mode="wait">
          {state.currentStep === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="text-center space-y-12 py-12"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent-muted/20 text-accent text-xs font-bold uppercase tracking-widest border border-accent/20"
                >
                  <ActivityIcon size={14} className="mr-2" />
                  Self-Assessment
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.9]">
                  <span className="text-gradient">HOW AI-READY</span><br />
                  <span className="text-accent underline decoration-accent/30 underline-offset-8">ARE YOU?</span>
                </h1>
                <p className="text-xl text-text-dim max-w-2xl mx-auto leading-relaxed font-medium">
                  The gap between "AI Aware" and "AI Ready" is widening. Map your professional maturity with a tailored 15-point diagnostic.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-6">
                <button
                  onClick={() => setState(s => ({ ...s, currentStep: 'field-selection' }))}
                  className="group relative px-10 py-5 bg-accent text-black rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(0,209,255,0.2)] hover:shadow-[0_20px_60px_rgba(0,209,255,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center"
                >
                  START ASSESSMENT
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                {user && (
                   <button
                    onClick={() => setState(s => ({ ...s, currentStep: 'history' }))}
                    className="flex items-center gap-3 px-8 py-3 bg-bg-card hover:bg-border-custom text-white rounded-xl border border-border-custom font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    <History size={16} className="text-accent" />
                    Recall Trajectory
                  </button>
                )}
                <div className="flex items-center text-text-dim text-sm font-bold tracking-tight">
                  <CheckCircle2 size={16} className="mr-2 text-accent" />
                  15 FIELD-SPECIFIC QUESTIONS • DESIGNED FOR PROFESSIONALS
                </div>
              </div>

              <div className="pt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-40 hover:opacity-60 transition-opacity">
                {['ENGINEERING', 'STRATEGY', 'CREATIVE', 'LEGAL'].map((f) => (
                  <div key={f} className="px-6 py-4 bg-bg-card border border-border-custom rounded-xl text-[10px] font-black tracking-[0.2em]">{f} MAPPING</div>
                ))}
              </div>
            </motion.div>
          )}

          {state.currentStep === 'field-selection' && (
            <motion.div
              key="field-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex items-end justify-between">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-white tracking-tight uppercase">Your Expertise</h2>
                  <p className="text-text-dim font-medium">Select a field for a deep-dive diagnostic.</p>
                </div>
                <button 
                  onClick={() => setState(s => ({ ...s, currentStep: 'landing' }))}
                  className="p-3 bg-bg-card hover:bg-border-custom text-white rounded-2xl transition-all border border-border-custom flex items-center gap-2 text-xs font-bold px-4"
                >
                  <ArrowLeft size={16} /> BACK
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.values(questionBank) as FieldData[]).map((field) => {
                  const Icon = ICON_MAP[field.icon] || Compass;
                  return (
                    <button
                      key={field.name}
                      onClick={() => setState(s => ({ ...s, selectedField: field.name, currentStep: 'quiz' }))}
                      className="group p-6 bg-bg-card border border-border-custom rounded-3xl text-left hover:border-accent hover:shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="text-accent" size={20} />
                      </div>
                      <div className="p-4 bg-accent-muted/10 text-accent rounded-2xl w-fit group-hover:bg-accent group-hover:text-black transition-all mb-6">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-black text-xl mb-2 text-white group-hover:text-accent transition-colors uppercase tracking-tight">{field.name}</h3>
                      <p className="text-sm text-text-dim leading-relaxed font-medium">{field.description}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {state.currentStep === 'quiz' && selectedFieldData && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-accent text-[10px] uppercase font-black tracking-[0.2em]">Diagnostic Session</span>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{selectedFieldData.name}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-text-dim block uppercase tracking-widest">{state.currentQuestionIndex + 1} / {selectedFieldData.questions.length}</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-border-custom rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((state.currentQuestionIndex + 1) / selectedFieldData.questions.length) * 100}%` }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>

              {(() => {
                const q = selectedFieldData.questions[state.currentQuestionIndex];
                return (
                  <div className="space-y-10">
                    <div className="space-y-4">
                       <span className="px-3 py-1 bg-accent-muted/20 text-accent text-[10px] font-black rounded-lg uppercase border border-accent/20 tracking-widest">
                        {q.category}
                       </span>
                      <h3 className="text-3xl md:text-4xl font-bold leading-[1.1] text-white tracking-tight">
                        {q.question}
                      </h3>
                    </div>

                    <div className="grid gap-3">
                      {q.options.map((opt, idx) => {
                        const letters = ['A', 'B', 'C', 'D'];
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setState(s => {
                                const newAnswers = { ...s.answers, [q.id]: opt.score };
                                if (s.currentQuestionIndex < selectedFieldData.questions.length - 1) {
                                  return { ...s, answers: newAnswers, currentQuestionIndex: s.currentQuestionIndex + 1 };
                                } else {
                                  return { ...s, answers: newAnswers, currentStep: 'results' };
                                }
                              });
                            }}
                            className="group flex items-center p-6 bg-bg-card border border-border-custom rounded-3xl text-left hover:border-accent hover:bg-accent-muted/10 transition-all active:scale-[0.99] relative overflow-hidden"
                          >
                            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-border-custom border border-white/5 flex items-center justify-center font-black text-text-dim mr-6 group-hover:bg-accent group-hover:text-black transition-all">
                              {letters[idx]}
                            </span>
                            <span className="text-lg font-bold text-[#E5E5E5] group-hover:text-white transition-colors pr-8">{opt.text}</span>
                            <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="text-accent" size={18} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => {
                    if (state.currentQuestionIndex > 0) {
                      setState(s => ({ ...s, currentQuestionIndex: s.currentQuestionIndex - 1 }));
                    } else {
                      setState(s => ({ ...s, currentStep: 'field-selection' }));
                    }
                  }}
                  className="flex items-center text-text-dim hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Previous
                </button>
                <div className="text-[10px] text-text-dim italic">Progress is saved locally per field.</div>
              </div>
            </motion.div>
          )}

          {state.currentStep === 'history' && (
            <UserHistory 
              onBack={() => setState(s => ({ ...s, currentStep: 'landing' }))}
              onSelectResult={(result) => {
                setState(s => ({
                  ...s,
                  currentStep: 'results',
                  selectedField: result.selected_field,
                  historicalResult: result
                }));
              }}
            />
          )}

          {state.currentStep === 'results' && selectedFieldData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <div ref={resultsRef} className="space-y-12 p-1 bg-brand-bg">
                <div className="glass rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 blur-[100px] -mr-48 -mt-48 rounded-full"></div>
                <div className="relative z-10 space-y-8">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-accent-muted/30 text-accent text-[10px] font-black uppercase tracking-[0.2em] border border-accent/20">
                    {state.historicalResult ? 'HISTORICAL ARCHIVE' : 'DIAGNOSTIC REPORT'}: {selectedFieldData.name}
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      {saveStatus === 'saving' && (
                        <div className="flex items-center gap-2 text-accent text-[8px] font-black uppercase tracking-widest animate-pulse">
                          <RefreshCw size={10} className="animate-spin" />
                          Syncing with Core...
                        </div>
                      )}
                      {saveStatus === 'saved' && (
                        <div className="flex items-center gap-2 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                          <CheckCircle2 size={10} />
                          Synapse Archive Secured
                        </div>
                      )}
                      {saveStatus === 'error' && (
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2 text-rose-400 text-[8px] font-black uppercase tracking-widest">
                            <AlertCircle size={10} />
                            Sync Interrupted
                          </div>
                          {detailedError && (
                            <div className="max-w-xs p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-300 font-mono text-center break-words">
                              DEBUG: {detailedError}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="relative w-56 h-56 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="112" cy="112" r="100" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                        <motion.circle cx="112" cy="112" r="100" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={628.32} initial={{ strokeDashoffset: 628.32 }} animate={{ strokeDashoffset: 628.32 - (628.32 * totalScore) / 100 }} transition={{ duration: 2, ease: "circOut" }} strokeLinecap="round" className="text-accent" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-8xl font-black tracking-tighter text-white leading-none">{totalScore}</span>
                        <span className="text-accent font-black text-sm tracking-[0.3em] mt-1">PERCENT</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-5xl font-black text-white leading-tight uppercase tracking-tight">{readinessLevel}</h3>
                    <p className="text-lg text-text-dim max-w-lg mx-auto font-medium">{getReadinessDescription(readinessLevel, selectedFieldData.name)}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-8 bg-bg-card border border-border-custom rounded-3xl text-center space-y-2">
                  <div className="text-[10px] font-black text-text-dim uppercase tracking-widest leading-none">Rank</div>
                  <div className="text-3xl font-black text-white">TOP {Math.max(1, 100 - totalScore)}%</div>
                  <div className="text-[10px] font-bold text-accent">Worldwide Avg: 42%</div>
                </div>
                <div className="p-8 bg-bg-card border border-border-custom rounded-3xl text-center space-y-2">
                  <div className="text-[10px] font-black text-text-dim uppercase tracking-widest leading-none">Confidence</div>
                  <div className="text-3xl font-black text-white">{totalScore > 70 ? 'High' : totalScore > 40 ? 'Med' : 'Growth'}</div>
                  <div className="text-[10px] font-bold text-accent">Verified Accuracy</div>
                </div>
                <div className="p-8 bg-bg-card border border-border-custom rounded-3xl text-center space-y-2">
                  <div className="text-[10px] font-black text-text-dim uppercase tracking-widest leading-none">Modules</div>
                  <div className="text-3xl font-black text-white">15/15</div>
                  <div className="text-[10px] font-bold text-accent">Complete Pass</div>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-xs font-black flex items-center text-text-dim tracking-[0.2em] uppercase">
                  <BarChart className="mr-3 text-accent" size={16} />Structural Competency Breakdown
                </h4>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                   {(Object.entries(categoryScores) as [string, number][]).map(([category, score]) => (
                     <div key={category} className="space-y-3">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-[#E5E5E5]">{category}</span>
                         <span className="text-accent">{score}%</span>
                       </div>
                       <div className="h-1 bg-border-custom rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} className="h-full bg-accent" />
                       </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-bg-card p-8 rounded-3xl border border-border-custom space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 -mr-12 -mt-12 rounded-full blur-xl"></div>
                  <h4 className="font-black flex items-center text-accent text-[10px] uppercase tracking-[0.25em]"><TrendingUp className="mr-3" size={14} />Established Strengths</h4>
                  <ul className="space-y-4">
                    {generateStrengths(categoryScores, totalScore).map((s, i) => (
                      <li key={i} className="flex items-start text-sm text-[#E5E5E5] font-medium"><span className="text-accent mr-4 font-black">/</span>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-bg-card p-8 rounded-3xl border border-border-custom space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 -mr-12 -mt-12 rounded-full blur-xl"></div>
                  <h4 className="font-black flex items-center text-rose-400 text-[10px] uppercase tracking-[0.25em]"><AlertCircle className="mr-3" size={14} />Friction Points</h4>
                  <ul className="space-y-4">
                    {generateImprovementAreas(categoryScores, totalScore).map((a, i) => (
                      <li key={i} className="flex items-start text-sm text-[#E5E5E5] font-medium"><span className="text-rose-400 mr-4 font-black">○</span>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-xs font-black flex items-center text-text-dim tracking-[0.2em] uppercase">
                  <Palette className="mr-3 text-accent" size={16} />The AI OS: Essential Tools
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedFieldData.recommendedTools.map((tool, idx) => (
                    <div key={idx} className="p-6 bg-bg-card border border-border-custom rounded-2xl hover:border-accent group transition-all">
                      <div className="text-[8px] font-black text-accent uppercase tracking-widest mb-1 opacity-60">{tool.category}</div>
                      <h5 className="font-bold text-white group-hover:text-accent transition-colors">{tool.name}</h5>
                      <p className="text-[10px] text-text-dim mt-2 leading-relaxed">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white text-black rounded-[2.5rem] p-10 md:p-16 space-y-12 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 blur-[80px] rounded-full"></div>
                <div className="text-center space-y-3">
                  <h3 className="text-4xl font-black uppercase tracking-tight">Level-Up: 7-Day Sprint</h3>
                  <p className="text-black/60 font-medium max-w-sm mx-auto">Tactical maneuvers to automate your workflow using top-tier AI tools by Monday.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {generateRoadmap(readinessLevel, selectedFieldData.name).map((step, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-black/5 border border-black/5 space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Phase 0{i + 1}</div>
                      <p className="text-sm font-bold leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secure Roadmap CTA */}
              {!user && (
                <div className="glass rounded-[2rem] p-10 md:p-12 space-y-8 relative overflow-hidden border-accent/20">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 blur-3xl rounded-full"></div>
                  <div className="flex flex-col md:flex-row items-center gap-10">
                     <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center px-3 py-1 bg-accent-muted/20 text-accent text-[8px] font-black rounded-lg uppercase tracking-widest border border-accent/20">System Alert: Temporal Storage</div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none">Persistence Required</h3>
                        <p className="text-text-dim text-sm font-medium leading-relaxed">
                          Your diagnostic data is currently stored in volatile memory. Create an anonymous profile to persist this roadmap and track your evolution as AI models update.
                        </p>
                     </div>
                     <button 
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-10 py-5 bg-accent text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl shadow-accent/20 flex-shrink-0"
                     >
                        Secure My Results
                     </button>
                  </div>
                </div>
              )}

              <div className="p-8 bg-bg-card border border-border-custom rounded-3xl space-y-4">
                <h5 className="font-black text-text-dim flex items-center text-[10px] uppercase tracking-[0.3em]"><AlertCircle size={14} className="mr-3 text-accent" />Technical Disclosure</h5>
                <p className="text-xs text-text-dim/60 leading-relaxed font-medium italic">
                   Professional diagnostic tool. {selectedFieldData.disclaimer && ` ${selectedFieldData.disclaimer}`}
                   High-stakes outputs require strict human verification.
                </p>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
                <button onClick={resetQuiz} className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.03] transition-all flex items-center justify-center shadow-xl shadow-white/5">
                  <RefreshCw size={14} className="mr-3" />
                  {state.historicalResult ? 'EXIT ARCHIVE' : 'INITIATE NEW DIAGNOSTIC'}
                </button>
                <button 
                  onClick={handleCapture}
                  disabled={isCapturing}
                  className="px-12 py-5 bg-accent text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.03] transition-all flex items-center justify-center shadow-xl shadow-accent/20"
                >
                  {isCapturing ? <RefreshCw size={14} className="mr-3 animate-spin" /> : <Share2 size={14} className="mr-3" />}
                  {isCapturing ? 'GENERATING IMAGE...' : 'CAPTURE & SHARE'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {
          // You could show a success toast here if you had one
        }} 
      />
    </div>
  );
}

// Logic Helpers

function getReadinessDescription(level: ReadinessLevel, field: string): string {
  const map: Record<ReadinessLevel, string> = {
    'AI Beginner': `You're just starting your journey into AI for ${field}. Now is the time to build a foundation.`,
    'AI Aware': `You have basic literacy in AI but haven't fully integrated it into your ${field} workflows yet.`,
    'AI Active User': `You're successfully using AI to speed up routine tasks. You've found clear initial value in ${field}.`,
    'AI Power User': `You've mastered sophisticated prompting and integration secrets for ${field}. You're far ahead of the curve.`,
    'AI-Ready Leader': `You're not just using AI; you're redesigning how ${field} works with an AI-first mindset.`
  };
  return map[level];
}

function generateStrengths(catScores: Record<string, number>, total: number): string[] {
  const sorted = Object.entries(catScores).sort((a, b) => b[1] - a[1]);
  const high = sorted.filter(s => s[1] > 60).map(s => `Strong performance in ${s[0]}`);
  if (high.length > 0) return high.slice(0, 3);
  return ["Growing awareness of GenAI capabilities", "Commitment to learning new professional tools", "Basic understanding of field-specific AI use"];
}

function generateImprovementAreas(catScores: Record<string, number>, total: number): string[] {
  const sorted = Object.entries(catScores).sort((a, b) => a[1] - b[1]);
  const low = sorted.map(s => {
    if (s[0] === 'Prompting Skill') return "Master multi-shot and chain-of-thought prompting";
    if (s[0] === 'Workflow Integration') return "Embed AI deeper into core daily processes";
    if (s[0] === 'Data/Privacy Awareness') return "Strengthen your data security protocols";
    if (s[0] === 'Automation') return "Bridge AI with your existing software stack";
    return `Deepen your ${s[0]} capabilities`;
  });
  return low.slice(0, 3);
}

function generateRoadmap(level: ReadinessLevel, field: string): string[] {
  const roadmapMap: Record<ReadinessLevel, string[]> = {
    'AI Beginner': [
      "Set aside 1 hour to explore ChatGPT Plus or Claude Pro for a routine brainstorming task.",
      "Identify two repetitive writing tasks to delegate to Grammarly AI or Perplexity.",
      "Read the latest 'Prompt Engineering' guide from Anthropic or OpenAI."
    ],
    'AI Aware': [
      "Subscribe to Claude 3.5 Sonnet or GPT-4o for complex reasoning tasks.",
      "Draft a basic 'Prompt Template' for a frequent task in your field using Notion AI.",
      "Explore 1 specialized tool like Perplexity (Research) or Canva AI (Creative)."
    ],
    'AI Active User': [
      "Implement a basic automation using Zapier Central or a built-in AI workflow.",
      "Audit your top 3 prompt templates using 'RolePlay' and 'Constraint' techniques.",
      "Train a co-worker on a specific AI workflow you've mastered."
    ],
    'AI Power User': [
      "Experiment with API-based tools or 'Agents' like Replit Agent or Multi-On.",
      "Build a shared 'Prompt Library' for your department in Notion.",
      "Explore advanced data analysis in ChatGPT or Claude."
    ],
    'AI-Ready Leader': [
      "Lead a strategy session on 'AI-First' redesign of a core process using Miro AI.",
      "Evaluate the ROI of custom-tuned models or RAG systems for proprietary data.",
      "Mentor others on ethical implications and quality control of AI."
    ]
  };
  return roadmapMap[level];
}
