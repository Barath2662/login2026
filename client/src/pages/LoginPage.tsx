import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.login({ email, password });
      const { token, user } = res.data;

      setAuth(true, token, user);

      if (user.must_change_password) {
        navigate('/change-password');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'event_coordinator') {
        navigate('/coordinator');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#0A0A0C]">
      <div className="max-w-md w-full bg-[#141418] border border-[#2A1416] p-8 rounded-2xl shadow-2xl space-y-8">
        
        <div className="text-center space-y-2">
          <img src="/assets/logo.svg" alt="LOGIN 2026 Logo" className="h-12 w-auto mx-auto" />
          <h1 className="text-2xl font-display font-extrabold text-[#F2F2F4] tracking-wider">PORTAL AUTHENTICATION</h1>
          <p className="text-xs font-mono text-[#9A9AA2]">Sign in to access your LOGIN 2026 account</p>
        </div>

        {error && (
          <div className="bg-[#9B0A12]/30 border border-[#E01B24] p-3 rounded-lg flex items-center gap-3 text-xs text-[#FF3B30]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
          <div>
            <label className="block text-[#9A9AA2] mb-1 font-semibold">Registered Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              required
              className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3.5 py-2.5 text-[#F2F2F4] outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#9A9AA2] font-semibold">Password *</label>
              <Link to="/forgot-password" className="text-[11px] text-[#E01B24] hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3.5 py-2.5 text-[#F2F2F4] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E01B24] hover:bg-[#FF3B30] text-[#F2F2F4] font-bold font-mono rounded-lg transition-transform hover:scale-[1.01] shadow-lg shadow-[#E01B24]/20 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#9A9AA2] border-t border-[#2A1416] pt-6">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#E01B24] hover:underline font-bold">
            Create Participant / Alumni Account
          </Link>
        </div>

      </div>
    </div>
  );
};
