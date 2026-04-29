import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import MainQuiz from './components/MainQuiz';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

// Constants
const ADMIN_EMAIL = 'israelphilipsdev@gmail.com';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-accent">
        <div className="text-sm font-black uppercase tracking-widest animate-pulse">Initializing Neural Link...</div>
      </div>
    );
  }

  const isAdmin = user && (user.email === ADMIN_EMAIL || user.app_metadata?.role === 'admin');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainQuiz />} />
        <Route 
          path="/admin" 
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : user ? (
              <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg text-white space-y-4 p-6">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight">Access Restricted</h1>
                <p className="text-text-dim text-center font-medium">This command center requires Level 5 Clearance (Admin).<br/> Current Identifier: <span className="text-white font-bold">{user.email}</span></p>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => supabase?.auth.signOut()}
                    className="px-8 py-3 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
                  >
                    Terminate Session
                  </button>
                  <a 
                    href="/"
                    className="px-8 py-3 bg-border-custom text-white border border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    Return Home
                  </a>
                </div>
              </div>
            ) : (
              <AdminLogin />
            )
          } 
        />
        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
