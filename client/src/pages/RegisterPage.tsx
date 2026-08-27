import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { UserCheck, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  const [userType, setUserType] = useState<'PARTICIPANT' | 'ALUMNI'>('PARTICIPANT');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if ((typeParam && typeParam.toUpperCase() === 'ALUMNI') || window.location.pathname.includes('alumni')) {
      setUserType('ALUMNI');
    }
  }, [searchParams]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    college_name: '',
    department: '',
    roll_no: '',
    gender: '',
    year_of_study: '',
    batch_year: '',
    place: '',
    current_organization: '',
    accommodation_required: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alumniSuccess, setAlumniSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.type === 'checkbox' ? target.checked : target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required fields.');
      return;
    }

    if (userType !== 'ALUMNI') {
      if (!formData.password) {
        setError('Password is required.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    if (userType === 'PARTICIPANT' && !formData.college_name.trim()) {
      setError('College name is required for event participants.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.register({
        ...formData,
        user_type: userType,
      });

      if (userType === 'ALUMNI') {
        setAlumniSuccess(true);
      } else {
        const { token, user } = res.data;
        setAuth(true, token, user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (alumniSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#141418] border border-[#1FA971] p-8 rounded-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#1FA971]/20 border border-[#1FA971] text-[#1FA971] rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-[#F2F2F4]">Alumni Registration Confirmed!</h2>
          <p className="text-xs text-[#9A9AA2] leading-relaxed">
            Thank you for registering for LOGIN 2026. Your record has been saved, and our organizing committee looks forward to welcoming you back to PSG Tech on 18 & 19 September 2026!
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 bg-[#E01B24] hover:bg-[#FF3B30] text-[#F2F2F4] font-bold text-xs font-mono rounded-lg transition-transform hover:scale-105"
          >
            RETURN TO HOMEPAGE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#0A0607] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A050A]/15 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-xl w-full bg-[#130C0E] border border-[#2A1A1D] p-6 sm:p-8 rounded-[2px] shadow-2xl space-y-7 animate-scale-in relative corner-bracket-container">
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-br" />
        
        {/* Header */}
        <div className="text-center space-y-2">
          <img src="/assets/login.png" alt="LOGIN 2026 Logo" className="h-14 w-auto mx-auto drop-shadow-[0_0_15px_rgba(224,27,34,0.4)]" />
          <h1 className="text-2xl font-display font-extrabold text-[#F2F2F4] tracking-wider">
            {userType === 'ALUMNI' ? 'PSG MCA ALUMNI REGISTRATION' : 'REGISTER FOR LOGIN 2026'}
          </h1>

        </div>

        {/* Dedicated Type Badge Notice */}
        {userType === 'ALUMNI' ? (
          <div >
           
            
          </div>
        ) : (
          <div className="bg-[#E01B24]/10 border border-[#E01B24]/40 p-3.5 rounded-xl flex items-center gap-3 text-xs text-[#E01B24]">
            <UserCheck className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold uppercase tracking-wider text-[11px]">STUDENT SYMPOSIUM PARTICIPANT</div>
              <p className="text-[11px] text-[#9A9AA2]">Compete across 11 technical & non-technical symposium events. Bonafide certificate is mandatory to participate.</p>
            </div>
          </div>
        )}

        <div className="bg-[#E08A17]/10 border border-[#E08A17]/40 p-3 text-xs text-[#E08A17] font-mono">
          Bonafide certificate is mandatory to participate in LOGIN 2026.
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#9B0A12]/30 border border-[#E01B24] p-3 rounded-lg flex items-center gap-3 text-xs text-[#FF3B30]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#9A9AA2] mb-1 font-semibold">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Arun"
                required
                className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
              />
            </div>
            <div>
              <label className="block text-[#9A9AA2] mb-1 font-semibold">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                required
                className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#9A9AA2] mb-1 font-semibold">Phone (10-Digit Mobile) *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
              />
            </div>

            <div>
              <label className="block text-[#9A9AA2] mb-1 font-semibold">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Participant Specific Fields */}
          {userType === 'PARTICIPANT' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9A9AA2] mb-1 font-semibold">College / Institution *</label>
                  <input
                    type="text"
                    name="college_name"
                    value={formData.college_name}
                    onChange={handleChange}
                    placeholder="PSG College of Technology"
                    required
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
                  />
                </div>

                <div>
                  <label className="block text-[#9A9AA2] mb-1 font-semibold">Department / Stream</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Computer Applications (MCA)"
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9A9AA2] mb-1 font-semibold">Roll Number / Student ID</label>
                  <input
                    type="text"
                    name="roll_no"
                    value={formData.roll_no}
                    onChange={handleChange}
                    placeholder="24MX101"
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
                  />
                </div>

                <div>
                  <label className="block text-[#9A9AA2] mb-1 font-semibold">Year of Study</label>
                  <select
                    name="year_of_study"
                    value={formData.year_of_study}
                    onChange={handleChange}
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate (MCA/MSc)">Postgraduate (MCA/MSc)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Alumni Specific Fields */}
          {userType === 'ALUMNI' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#9A9AA2] mb-1 font-semibold">Alumni Batch Code *</label>
                <input
                  type="text"
                  name="batch_year"
                  value={formData.batch_year}
                  onChange={(e) => setFormData({ ...formData, batch_year: e.target.value.toUpperCase().replace(/[^0-9MX]/g, '').slice(0, 4) })}
                  placeholder="e.g. 25MX"
                  pattern="[0-9]{2}MX"
                  title="Enter your batch code e.g. 25MX."
                  required
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
                />
                
              </div>

              <div>
                <label className="block text-[#9A9AA2] mb-1 font-semibold">City / Location</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  placeholder="Coimbatore / Bengaluru"
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
                />
              </div>

              <div>
                <label className="block text-[#9A9AA2] mb-1 font-semibold">Current Organization</label>
                <input
                  type="text"
                  name="current_organization"
                  value={formData.current_organization}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow"
                />
              </div>
            </div>
          )}

          <label className="flex items-center gap-3 text-xs text-[#F7F2F2] font-mono cursor-pointer">
            <input type="checkbox" name="accommodation_required" checked={formData.accommodation_required} onChange={handleChange} className="h-4 w-4 accent-[#E01B22]" />
            <span>Accommodation required</span>
          </label>

          {/* Password Fields (Participants Only) */}
          {userType !== 'ALUMNI' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#9A9AA2] mb-1 font-semibold">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 pr-11 text-[#F7F2F2] outline-none input-glow"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9AA2] hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#9A9AA2] mb-1 font-semibold">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 pr-11 text-[#F7F2F2] outline-none input-glow"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9AA2] hover:text-white">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="shimmer-btn w-full py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-bold font-mono rounded-[2px] transition-all hover:shadow-[0_0_25px_rgba(224,27,34,0.4)] flex items-center justify-center gap-2 mt-4 text-sm disabled:opacity-60"
          >
            {loading ? 'PROCESSING...' : `COMPLETE REGISTRATION (${userType})`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {userType !== 'ALUMNI' && (
          <div className="text-center text-xs text-[#9A9AA2]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E01B24] hover:underline font-bold">
              Sign In Here
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
