import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, UserPlus, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Optional: specify if you want to skip email verification here if the provider allows
            // but usually it's managed in Supabase dashboard settings.
          }
        });
        if (signUpError) throw signUpError;
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md glass rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-text-dim hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-accent-muted/20 text-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {mode === 'signup' ? 'Secure Your History' : 'Access Your Profile'}
            </h2>
            <p className="text-text-dim text-xs font-medium uppercase tracking-widest leading-relaxed px-4">
              {mode === 'signup' 
                ? 'Create a secure identity to persist your diagnostic results across sessions.' 
                : 'Enter your credentials to reload your previous maturity benchmarks.'}
            </p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-accent-muted/10 border border-accent/20 rounded-2xl text-center space-y-4"
            >
              <CheckCircle2 size={40} className="text-accent mx-auto" />
              <div className="text-sm font-bold text-white uppercase tracking-widest">Account Synthesized</div>
              <p className="text-xs text-text-dim">Auto-authenticating your profile...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Email Coordinates</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-border-custom rounded-xl pl-12 pr-6 py-4 text-white text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="user@neural-link.net"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Access Fractal (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-border-custom rounded-xl pl-12 pr-6 py-4 text-white text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-accent text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-accent/10 mt-4"
              >
                {loading ? (mode === 'signup' ? 'SYNTHESIZING...' : 'AUTHENTICATING...') : (
                  <>
                    {mode === 'signup' ? <UserPlus className="mr-3" size={16} /> : <LogIn className="mr-3" size={16} /> }
                    {mode === 'signup' ? 'UNFOLD IDENTITY' : 'EXECUTE ACCESS'}
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <button
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="text-[10px] font-black text-text-dim hover:text-white uppercase tracking-widest transition-colors"
            >
              {mode === 'signup' ? 'Already Have an Identity? Login' : 'New Observer? Create Profile'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
