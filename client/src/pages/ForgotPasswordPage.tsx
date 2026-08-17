import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { KeyRound, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.forgotPassword(email);
      setMessage(res.data.message || 'Password reset link sent to your email.');
      if (res.data.token) {
        setDevToken(res.data.token);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#0A0A0C]">
      <div className="max-w-md w-full bg-[#141418] border border-[#2A1416] p-8 rounded-2xl shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#E01B24]/10 border border-[#E01B24] text-[#E01B24] rounded-full flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-display font-extrabold text-[#F2F2F4]">RECOVER PASSWORD</h1>
          <p className="text-xs text-[#9A9AA2]">Enter your registered email to receive password reset token</p>
        </div>

        {error && (
          <div className="bg-[#9B0A12]/30 border border-[#E01B24] p-3 rounded-lg flex items-center gap-3 text-xs text-[#FF3B30]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-[#1FA971]/20 border border-[#1FA971] p-4 rounded-lg space-y-2 text-xs text-[#1FA971]">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Request Processed</span>
            </div>
            <p className="text-[#F2F2F4]">{message}</p>

            {devToken && (
              <div className="pt-2 border-t border-[#1FA971]/30">
                <p className="text-[10px] text-[#9A9AA2] font-mono">Dev Quick Reset Link:</p>
                <Link
                  to={`/reset-password?token=${devToken}`}
                  className="text-xs font-mono text-[#FF3B30] underline block truncate"
                >
                  /reset-password?token={devToken}
                </Link>
              </div>
            )}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E01B24] hover:bg-[#FF3B30] text-[#F2F2F4] font-bold font-mono rounded-lg transition-transform hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? 'SENDING TOKEN...' : 'SEND RESET LINK'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#9A9AA2]">
          Remembered your password?{' '}
          <Link to="/login" className="text-[#E01B24] hover:underline font-bold">
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
