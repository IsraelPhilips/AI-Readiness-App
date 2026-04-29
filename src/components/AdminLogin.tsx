import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, Rocket, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      // Check if user is admin (this is a simple client-side check, 
      // but RLS will prevent unauthorized data access)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Usually you'd check a role, but the prompt says 
      // "Only the admin email should be able to view the dashboard"
      // We will handle redirect in the router
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[100px] -mr-48 -mt-48 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 blur-[100px] -ml-48 -mb-48 rounded-full"></div>

      <div className="max-w-md w-full glass p-10 md:p-12 rounded-[2.5rem] relative z-10 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-accent-muted/20 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Admin Access</h1>
          <p className="text-text-dim text-sm font-medium uppercase tracking-widest">Enter Credentials to Command</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-bold">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] ml-1">Identity Vector (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-border-custom rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors"
              placeholder="admin@ai-maturity.test"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] ml-1">Security Token (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-border-custom rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-accent text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <LogIn className="animate-spin" size={18} /> : (
              <>
                <LogIn className="mr-3" size={16} />
                INITIALIZE ACCESS
              </>
            )}
          </button>
        </form>

        <div className="text-center">
           <a href="/" className="text-[10px] font-black text-text-dim hover:text-white uppercase tracking-widest transition-colors">Return to Diagnostic</a>
        </div>
      </div>
    </div>
  );
}
