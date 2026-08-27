import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useEmail, setUseEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginId.trim() || !password) {
      setError(useEmail ? 'Email and password are required.' : 'LOGIN ID and password are required.');
      return;
    }

    try {
      setLoading(true);
      const payload = useEmail
        ? { email: loginId.trim(), password }
        : { loginId: loginId.trim().toUpperCase(), password };

      const res = await api.auth.login(payload);
      const { token, user } = res.data;

      setAuth(true, token, user);

      if (user.must_change_password) {
        navigate('/change-password');
      } else if (user.role === 'super_admin' || user.role === 'admin_power') {
        navigate('/admin/access-control');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'event_coordinator') {
        navigate('/coordinator');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#0A0607] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A050A]/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-md w-full bg-[#130C0E] border border-[#2A1A1D] p-6 sm:p-8 rounded-[2px] shadow-2xl space-y-7 animate-scale-in relative corner-bracket-container">
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-br" />
        
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full border border-[#E01B22]/40 bg-[#0A0607] flex items-center justify-center animate-pulse-glow">
            <ShieldCheck className="w-7 h-7 text-[#E01B22]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#F7F2F2] tracking-wider">PORTAL AUTHENTICATION</h1>
          <p className="text-xs font-mono text-[#6B5A5C]">Sign in with your LOGIN ID to access the platform</p>
        </div>

        {error && (
          <div className="bg-[#9B0A12]/20 border border-[#E01B22]/60 p-3 rounded-[2px] flex items-center gap-3 text-xs text-[#FF2A2A] animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-body">
          <div>
            <label className="block text-[#A79798] mb-1.5 font-semibold text-xs">
              {useEmail ? 'Email Address *' : 'LOGIN ID *'}
            </label>
            <div className="relative">
              <input
                type={useEmail ? 'email' : 'text'}
                value={loginId}
                onChange={(e) => setLoginId(useEmail ? e.target.value : e.target.value.toUpperCase())}
                placeholder={useEmail ? 'user@domain.com' : 'LOGIN101'}
                required
                className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-3 pl-11 text-[#F7F2F2] outline-none input-glow text-sm font-mono tracking-wider"
              />
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5A5C]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#A79798] font-semibold text-xs">Password *</label>
              <Link to="/forgot-password" className="text-[11px] text-[#E01B22] hover:text-[#FF2A2A] link-underline transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-3 pr-11 text-[#F7F2F2] outline-none input-glow text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A79798] hover:text-[#F7F2F2]">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="shimmer-btn w-full py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-bold font-mono rounded-[2px] transition-all hover:shadow-[0_0_25px_rgba(224,27,34,0.4)] flex items-center justify-center gap-2 mt-2 text-sm disabled:opacity-60"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between LOGIN ID and Email */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => { setUseEmail(!useEmail); setLoginId(''); setError(null); }}
            className="text-[11px] text-[#6B5A5C] hover:text-[#A79798] transition-colors font-mono"
          >
            {useEmail ? '← Sign in with LOGIN ID' : 'Admin/Coordinator? Sign in with email →'}
          </button>
        </div>

        <div className="text-center text-xs text-[#6B5A5C] border-t border-[#2A1A1D] pt-5">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#E01B22] hover:text-[#FF2A2A] font-bold link-underline transition-colors">
            Create Participant account
          </Link>
        </div>

      </div>
    </div>
  );
};
