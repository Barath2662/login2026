import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('Password reset token is required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await api.auth.resetPassword({ token, newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#141418] border border-[#1FA971] p-8 rounded-2xl text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-[#1FA971] mx-auto" />
          <h2 className="text-xl font-display font-bold text-[#F2F2F4]">Password Reset Successful!</h2>
          <p className="text-xs text-[#9A9AA2]">Your password has been updated. Redirecting to login...</p>
          <Link to="/login" className="inline-block text-xs font-mono text-[#E01B24] underline">
            Click here if not redirected
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#0A0A0C]">
      <div className="max-w-md w-full bg-[#141418] border border-[#2A1416] p-8 rounded-2xl shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#E01B24]/10 border border-[#E01B24] text-[#E01B24] rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-display font-extrabold text-[#F2F2F4]">CREATE NEW PASSWORD</h1>
          <p className="text-xs text-[#9A9AA2]">Enter reset token and new password</p>
        </div>

        {error && (
          <div className="bg-[#9B0A12]/30 border border-[#E01B24] p-3 rounded-lg flex items-center gap-3 text-xs text-[#FF3B30]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
          <div>
            <label className="block text-[#9A9AA2] mb-1 font-semibold">Reset Token *</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token here..."
              required
              className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3.5 py-2.5 text-[#F2F2F4] font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-[#9A9AA2] mb-1 font-semibold">New Password *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3.5 py-2.5 text-[#F2F2F4] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#9A9AA2] mb-1 font-semibold">Confirm New Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3.5 py-2.5 text-[#F2F2F4] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E01B24] hover:bg-[#FF3B30] text-[#F2F2F4] font-bold font-mono rounded-lg transition-transform hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? 'RESETTING PASSWORD...' : 'UPDATE PASSWORD'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
