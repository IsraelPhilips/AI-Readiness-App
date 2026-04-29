import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Users, TrendingUp, AlertCircle, RefreshCw, LogOut, ChevronLeft, Activity } from 'lucide-react';
import { QuizResult } from '../types/database';

export default function AdminDashboard() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    if (!supabase) {
      setLoading(false);
      setStats({ error: 'Supabase URL or Key is missing. Please check your environment variables.' });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching results:', error);
      setLoading(false);
    } else {
      setResults(data || []);
      if (data && data.length > 0) {
        calculateStats(data);
      } else {
        setStats({ empty: true });
      }
      setLoading(false);
    }
  };

  const calculateStats = (data: QuizResult[]) => {
    const totalCompletions = data.length;
    if (totalCompletions === 0) return;

    const avgScore = data.reduce((acc, curr) => acc + curr.total_score, 0) / totalCompletions;
    
    const below50 = data.filter(r => r.total_score < 50).length / totalCompletions * 100;
    const between50and74 = data.filter(r => r.total_score >= 50 && r.total_score < 75).length / totalCompletions * 100;
    const above75 = data.filter(r => r.total_score >= 75).length / totalCompletions * 100;

    const fieldStats: Record<string, { total: number, count: number }> = {};
    const levelDist: Record<string, number> = {};
    const categoryAgg: Record<string, { total: number, count: number }> = {};

    data.forEach(r => {
      // Field stats
      if (!fieldStats[r.selected_field]) fieldStats[r.selected_field] = { total: 0, count: 0 };
      fieldStats[r.selected_field].total += r.total_score;
      fieldStats[r.selected_field].count += 1;

      // Level dist
      levelDist[r.readiness_level] = (levelDist[r.readiness_level] || 0) + 1;

      // Category stats
      Object.entries(r.category_scores).forEach(([cat, score]) => {
        if (!categoryAgg[cat]) categoryAgg[cat] = { total: 0, count: 0 };
        categoryAgg[cat].total += score;
        categoryAgg[cat].count += 1;
      });
    });

    const avgByField = Object.entries(fieldStats).map(([field, s]) => ({ field, avg: Math.round(s.total / s.count) }));
    const weakestCategories = Object.entries(categoryAgg)
      .map(([cat, s]) => ({ category: cat, avg: Math.round(s.total / s.count) }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 3);

    setStats({
      totalCompletions,
      avgScore: Math.round(avgScore),
      below50: Math.round(below50),
      between50and74: Math.round(between50and74),
      above75: Math.round(above75),
      avgByField,
      levelDist,
      weakestCategories
    });
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-white">
        <RefreshCw className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight uppercase">Intelligence Command</h1>
            <p className="text-text-dim font-medium uppercase text-[10px] tracking-widest">Admin Dashboard / Professional Diagnostic Analytics</p>
          </div>
          <div className="flex gap-4">
             <button onClick={fetchResults} className="p-3 bg-bg-card border border-border-custom rounded-xl hover:text-accent transition-colors">
              <RefreshCw size={20} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-500/20 transition-all">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {stats?.error ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 glass rounded-[2.5rem] border-rose-500/20">
            <AlertCircle size={48} className="text-rose-500" />
            <h2 className="text-2xl font-black uppercase">Configuration Error</h2>
            <p className="text-text-dim">{stats.error}</p>
          </div>
        ) : stats?.empty ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 glass rounded-[2.5rem]">
            <AlertCircle size={48} className="text-text-dim" />
            <h2 className="text-2xl font-black uppercase">No Signals Detected</h2>
            <p className="text-text-dim">Waiting for the first diagnostic completion...</p>
          </div>
        ) : stats && (
          <>
            {/* Top Row: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-8 bg-bg-card border border-border-custom rounded-3xl space-y-2">
                <div className="text-[10px] font-black text-text-dim uppercase tracking-widest">Total Diagnostics</div>
                <div className="text-5xl font-black text-white">{stats.totalCompletions}</div>
                <div className="flex items-center text-accent text-xs font-bold gap-1"><TrendingUp size={14}/> Active Deployment</div>
              </div>
              <div className="p-8 bg-bg-card border border-border-custom rounded-3xl space-y-2">
                <div className="text-[10px] font-black text-text-dim uppercase tracking-widest">Average Readiness</div>
                <div className="text-5xl font-black text-accent">{stats.avgScore}%</div>
                <div className="text-[10px] font-bold text-text-dim">GLOBAL BENCHMARK: 42%</div>
              </div>
              <div className="p-8 bg-bg-card border border-border-custom rounded-3xl space-y-2">
                <div className="text-[10px] font-black text-text-dim uppercase tracking-widest">Skill Distribution</div>
                <div className="flex gap-2 h-8 items-end">
                   <div style={{ height: `${stats.below50}%` }} className="w-full bg-rose-500/50 rounded-t-sm" title={`Below 50: ${stats.below50}%`}></div>
                   <div style={{ height: `${stats.between50and74}%` }} className="w-full bg-amber-500/50 rounded-t-sm" title={`50-74: ${stats.between50and74}%`}></div>
                   <div style={{ height: `${stats.above75}%` }} className="w-full bg-accent/50 rounded-t-sm" title={`75+: ${stats.above75}%`}></div>
                </div>
                <div className="text-[10px] font-bold text-text-dim flex justify-between uppercase">
                  <span>Entry</span>
                  <span>Pro</span>
                  <span>Elite</span>
                </div>
              </div>
              <div className="p-8 bg-bg-card border border-border-custom rounded-3xl space-y-2">
                <div className="text-[10px] font-black text-text-dim uppercase tracking-widest">Critical Gaps</div>
                <div className="text-xl font-bold text-rose-400 capitalize truncate">{stats.weakestCategories[0]?.category || 'None'}</div>
                <div className="text-[10px] font-bold text-text-dim uppercase">Lowest Average Module</div>
              </div>
            </div>

            {/* Middle Row: Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-bg-card border border-border-custom rounded-[2.5rem] p-10 space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-dim flex items-center">
                  <BarChart className="mr-3 text-accent" size={16} /> Average Score by Field
                </h3>
                <div className="space-y-6">
                  {stats.avgByField.map((f: any) => (
                    <div key={f.field} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>{f.field}</span>
                        <span className="text-accent">{f.avg}%</span>
                      </div>
                      <div className="h-1 bg-border-custom rounded-full overflow-hidden">
                        <div style={{ width: `${f.avg}%` }} className="h-full bg-accent"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-bg-card border border-border-custom rounded-[2.5rem] p-10 space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-dim flex items-center">
                  <Users className="mr-3 text-accent" size={16} /> Readiness Level Distribution
                </h3>
                <div className="grid grid-cols-1 gap-4">
                   {['AI Beginner', 'AI Aware', 'AI Active User', 'AI Power User', 'AI-Ready Leader'].map(level => {
                     const count = stats.levelDist[level] || 0;
                     const pct = Math.round(count / stats.totalCompletions * 100);
                     return (
                        <div key={level} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                           <div className="space-y-1">
                              <div className="text-xs font-black text-white uppercase tracking-tight">{level}</div>
                              <div className="text-[10px] font-bold text-text-dim uppercase">{count} Submissions</div>
                           </div>
                           <div className="text-2xl font-black text-accent">{pct}%</div>
                        </div>
                     );
                   })}
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Submissions */}
            <div className="bg-bg-card border border-border-custom rounded-[2.5rem] p-10 space-y-8">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-dim flex items-center">
                  <Activity className="mr-3 text-accent" size={16} /> Recent Signal Submissions
               </h3>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim border-b border-border-custom">
                        <th className="pb-4 pt-0">Timestamp</th>
                        <th className="pb-4 pt-0">Field</th>
                        <th className="pb-4 pt-0">Score</th>
                        <th className="pb-4 pt-0">Level</th>
                        <th className="pb-4 pt-0 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom">
                      {results.slice(0, 10).map((r) => (
                        <tr key={r.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 text-xs text-text-dim uppercase font-bold">
                            {new Date(r.created_at!).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-xs font-black text-white uppercase">{r.selected_field}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-black ${r.total_score > 75 ? 'bg-emerald-500/10 text-emerald-400' : r.total_score > 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {r.total_score}%
                            </span>
                          </td>
                          <td className="py-4 text-[10px] font-black uppercase text-accent tracking-widest">{r.readiness_level}</td>
                          <td className="py-4 text-right">
                             <button className="text-text-dim hover:text-white transition-colors"><ChevronLeft className="rotate-180" size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
