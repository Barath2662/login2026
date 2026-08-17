import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { UserCheck, GraduationCap, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [userType, setUserType] = useState<'PARTICIPANT' | 'ALUMNI'>('PARTICIPANT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    college_name: '',
    department: '',
    roll_no: '',
    gender: 'Male',
    year_of_study: '3rd Year',
    batch_year: '2022',
    place: '',
    current_organization: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alumniSuccess, setAlumniSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Name, email, and password are required fields.');
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#0A0A0C]">
      <div className="max-w-xl w-full bg-[#141418] border border-[#2A1416] p-8 rounded-2xl shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <img src="/assets/logo.svg" alt="LOGIN 2026 Logo" className="h-12 w-auto mx-auto" />
          <h1 className="text-2xl font-display font-extrabold text-[#F2F2F4] tracking-wider">REGISTER FOR LOGIN 2026</h1>
          <p className="text-xs font-mono text-[#9A9AA2]">Select registration type to begin</p>
        </div>

        {/* Registration Type Selector */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUserType('PARTICIPANT')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              userType === 'PARTICIPANT'
                ? 'bg-[#E01B24]/10 border-[#E01B24] text-[#E01B24] shadow-lg shadow-[#E01B24]/10'
                : 'bg-[#0A0A0C] border-[#2A1416] text-[#9A9AA2] hover:border-[#9A9AA2]'
            }`}
          >
            <UserCheck className="w-6 h-6" />
            <span className="text-xs font-bold font-display">Student Participant</span>
            <span className="text-[10px] font-mono text-[#9A9AA2]">Compete in 11 Events</span>
          </button>

          <button
            type="button"
            onClick={() => setUserType('ALUMNI')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              userType === 'ALUMNI'
                ? 'bg-[#E8A317]/10 border-[#E8A317] text-[#E8A317] shadow-lg shadow-[#E8A317]/10'
                : 'bg-[#0A0A0C] border-[#2A1416] text-[#9A9AA2] hover:border-[#9A9AA2]'
            }`}
          >
            <GraduationCap className="w-6 h-6" />
            <span className="text-xs font-bold font-display">PSG Alumni</span>
            <span className="text-[10px] font-mono text-[#9A9AA2]">Guest / Attendee Record</span>
          </button>
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
                placeholder="e.g. Sabarish K"
                required
                className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9A9AA2] mb-1 font-semibold">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@domain.edu"
                required
                className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
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
                className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9A9AA2] mb-1 font-semibold">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
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
                    className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
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
                    className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
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
                    className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#9A9AA2] mb-1 font-semibold">Year of Study</label>
                  <select
                    name="year_of_study"
                    value={formData.year_of_study}
                    onChange={handleChange}
                    className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
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
                <label className="block text-[#9A9AA2] mb-1 font-semibold">Graduating Batch/Year</label>
                <input
                  type="text"
                  name="batch_year"
                  value={formData.batch_year}
                  onChange={handleChange}
                  placeholder="e.g. 2018"
                  className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
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
                  className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
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
                  className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
                />
              </div>
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#9A9AA2] mb-1 font-semibold">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#9A9AA2] mb-1 font-semibold">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[#0A0A0C] border border-[#2A1416] focus:border-[#E01B24] rounded-lg px-3 py-2 text-[#F2F2F4] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E01B24] hover:bg-[#FF3B30] text-[#F2F2F4] font-bold font-mono rounded-lg transition-transform hover:scale-[1.01] shadow-lg shadow-[#E01B24]/20 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'PROCESSING...' : `COMPLETE REGISTRATION (${userType})`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#9A9AA2]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#E01B24] hover:underline font-bold">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};
