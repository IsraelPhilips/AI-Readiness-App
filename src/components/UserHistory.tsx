import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { QuizResult } from '../types/database';
import { motion } from 'motion/react';
import { 
  History, Clock, ChevronRight, BarChart, 
  Target, Rocket, ArrowLeft, Loader2, AlertCircle 
} from 'lucide-react';

interface UserHistoryProps {
  onBack: () => void;
  onSelectResult: (result: QuizResult) => void;
}

export default function UserHistory({ onBack, onSelectResult }: UserHistoryProps) {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Authentication required to view history.');
        return;
      }

      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message.includes('column "user_id" does not exist')) {
          throw new Error("Missing 'user_id' column in quiz_results. Run: ALTER TABLE quiz_results ADD COLUMN user_id UUID REFERENCES auth.users(id);");
        }
        throw error;
      }
      setResults(data || []);
    } catch (err: any) {
      console.error('Error fetching history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between border-b border-border-custom pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent-muted/20 text-accent rounded-2xl">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Your Trajectory</h2>
            <p className="text-text-dim text-sm font-medium uppercase tracking-widest">Historical Performance Snapshots</p>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="p-3 bg-bg-card hover:bg-border-custom text-white rounded-2xl transition-all border border-border-custom flex items-center gap-2 text-xs font-bold px-5"
        >
          <ArrowLeft size={16} /> BACK
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="animate-spin text-accent" />
          <p className="text-text-dim text-xs font-black uppercase tracking-[0.2em]">Accessing Synaptic Archive...</p>
        </div>
      ) : error ? (
        <div className="glass p-8 rounded-3xl border border-rose-500/20 text-center space-y-4">
          <AlertCircle size={40} className="text-rose-500 mx-auto" />
          <h3 className="text-xl font-black text-white uppercase">Access Denial</h3>
          <p className="text-text-dim text-sm">{error}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="glass p-16 rounded-[2.5rem] text-center space-y-6">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-text-dim">
            <Target size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">No Temporal Data Found</h3>
            <p className="text-text-dim text-sm max-w-xs mx-auto font-medium">You haven't archived any diagnostic sessions yet. Complete your first assessment to begin mapping your evolution.</p>
          </div>
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-accent text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
          >
            Start First Diagnostic
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => onSelectResult(result)}
              className="group w-full glass p-6 rounded-3xl border border-border-custom hover:border-accent transition-all text-left flex items-center gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} className="text-accent" />
              </div>
              
              <div className="flex-shrink-0 w-20 h-20 bg-accent-muted/10 text-accent rounded-full flex items-center justify-center font-black text-2xl border border-accent/20">
                {result.total_score}%
              </div>
              
              <div className="flex-grow space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{result.selected_field}</h3>
                  <span className="px-2 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded uppercase tracking-wider border border-accent/10">
                    {result.readiness_level}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-text-dim text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-accent" />
                    {new Date(result.created_at!).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart size={12} className="text-accent" />
                    Archive ID: {result.id?.slice(0, 8)}
                  </div>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end gap-2 pr-12">
                 <div className="flex gap-1">
                   {result.improvement_areas.slice(0, 2).map((_, i) => (
                     <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent/20" />
                   ))}
                 </div>
                 <div className="text-[8px] font-black text-text-dim/40 uppercase tracking-[0.2em]">Metadata Verified</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
