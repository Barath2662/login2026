import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { UserCheck, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, FileWarning, Copy, Check } from 'lucide-react';

// ──────────────────────────────────────────────
// Zod Validation Schema
// ──────────────────────────────────────────────
const participantSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  college_name: z.string().min(2, 'College name is required'),
  department: z.string().optional(),
  roll_no: z.string().optional(),
  gender: z.string().optional(),
  year_of_study: z.string().optional(),
  accommodation_required: z.boolean().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const alumniSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  gender: z.string().optional(),
  batch_year: z.string().regex(/^\d{2}MX$/i, 'Batch code must be in YYMX format (e.g. 25MX)'),
  place: z.string().optional(),
  current_organization: z.string().optional(),
  accommodation_required: z.boolean().optional(),
});

type ParticipantForm = z.infer<typeof participantSchema>;
type AlumniForm = z.infer<typeof alumniSchema>;

// ──────────────────────────────────────────────
// Main Register Page
// ──────────────────────────────────────────────
export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [userType, setUserType] = useState<'PARTICIPANT' | 'ALUMNI'>('PARTICIPANT');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Success state
  const [alumniSuccess, setAlumniSuccess] = useState(false);
  const [participantSuccess, setParticipantSuccess] = useState(false);
  const [generatedLoginId, setGeneratedLoginId] = useState('');
  const [copied, setCopied] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if ((typeParam && typeParam.toUpperCase() === 'ALUMNI') || window.location.pathname.includes('alumni')) {
      setUserType('ALUMNI');
    }
  }, [searchParams]);

  const participantForm = useForm<ParticipantForm>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: '', email: '', otp: '', college_name: '', department: '', roll_no: '',
      gender: 'Male', year_of_study: '1st Year', accommodation_required: false, password: '', confirmPassword: '',
    },
  });

  const alumniForm = useForm<AlumniForm>({
    resolver: zodResolver(alumniSchema),
    defaultValues: {
      name: '', gender: 'Male', batch_year: '', place: '', current_organization: '',
      accommodation_required: false,
    },
  });

  const activeForm = userType === 'PARTICIPANT' ? participantForm : alumniForm;
  const { register, handleSubmit, watch, formState: { errors }, trigger } = activeForm as any;

  const handleSendOtp = async () => {
    const isValidEmail = await trigger('email');
    if (!isValidEmail) return;

    const email = watch('email');
    setServerError(null);
    setOtpSending(true);
    try {
      await api.auth.sendOtp(email);
      setOtpSent(true);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setOtpSending(false);
    }
  };

  const onSubmit = async (data: any) => {
    setServerError(null);
    try {
      setLoading(true);
      const res = await api.auth.register({
        ...data,
        user_type: userType,
      });

      if (userType === 'ALUMNI') {
        setAlumniSuccess(true);
      } else {
        // Auto-login but show success screen first
        setAuth(res.data.token, res.data.user);
        localStorage.setItem('newLoginId', res.data.loginId);
        setGeneratedLoginId(res.data.loginId);
        setParticipantSuccess(true);
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render: Success States ──

  if (alumniSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#130C0E] border border-[#1FA971] p-8 rounded-[2px] text-center space-y-6">
          <div className="w-16 h-16 bg-[#1FA971]/20 border border-[#1FA971] text-[#1FA971] rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-[#F2F2F4]">Welcome Back Home!</h2>
          <p className="text-xs text-[#9A9AA2] leading-relaxed">
            Your alumni registration for LOGIN 2026 has been confirmed. Our organizing committee looks forward to welcoming you back to PSG Tech on 18 & 19 September 2026!
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 bg-[#E01B24] hover:bg-[#FF3B30] text-[#F2F2F4] font-bold text-xs font-mono rounded-[2px] transition-transform hover:scale-105"
          >
            RETURN TO HOMEPAGE
          </Link>
        </div>
      </div>
    );
  }

  if (participantSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#130C0E] border border-[#1FA971] p-8 rounded-[2px] text-center space-y-6">
          <div className="w-16 h-16 bg-[#1FA971]/20 border border-[#1FA971] text-[#1FA971] rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-[#F2F2F4]">Registration Successful!</h2>
          <p className="text-xs text-[#9A9AA2] leading-relaxed">
            Your participant account has been created. Here is your unique LOGIN ID. You can use this for logging in and team mapping.
          </p>
          <div className="bg-[#0A0607] border border-[#2A1A1D] rounded p-4 flex flex-col items-center gap-3">
            <span className="text-xs text-[#A79798] uppercase tracking-widest font-semibold">Your Login ID</span>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-mono font-bold text-[#E01B22] tracking-wider">{generatedLoginId}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLoginId);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-2 bg-[#2A1A1D] hover:bg-[#E01B22] text-[#F7F2F2] rounded transition-colors"
                title="Copy Login ID"
              >
                {copied ? <Check className="w-4 h-4 text-[#1FA971]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-block w-full px-6 py-3 bg-[#E01B24] hover:bg-[#FF3B30] text-[#F2F2F4] font-bold text-sm font-mono rounded-[2px] transition-transform hover:scale-[1.02]"
          >
            PROCEED TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Registration Form ──
  const inputClass = "w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none input-glow text-xs";
  const labelClass = "block text-[#A79798] mb-1 font-semibold text-xs";
  const errorClass = "text-[10px] text-[#FF2A2A] mt-0.5 font-mono";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#0A0607] relative overflow-hidden">
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

        {/* Type Badge */}
        {userType === 'PARTICIPANT' && (
          <div className="bg-[#E01B24]/10 border border-[#E01B24]/40 p-3.5 rounded-[2px] flex items-center gap-3 text-xs text-[#E01B24]">
            <UserCheck className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold uppercase tracking-wider text-[11px]">STUDENT SYMPOSIUM PARTICIPANT</div>
              <p className="text-[11px] text-[#9A9AA2]">After registration you will receive a unique LOGIN ID to access the platform.</p>
            </div>
          </div>
        )}

        {/* Server Error */}
        {serverError && (
          <div className="bg-[#9B0A12]/30 border border-[#E01B24] p-3 rounded-[2px] flex items-center gap-3 text-xs text-[#FF3B30]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input type="text" {...register('name')} placeholder="e.g. Arun" className={inputClass} />
              {errors.name && <p className={errorClass}>{(errors.name as any).message}</p>}
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select {...register('gender')} className={inputClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Participant-only fields */}
          {userType === 'PARTICIPANT' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="flex gap-2">
                    <input type="email" {...register('email')} placeholder="you@example.com" className={inputClass} disabled={otpSent} />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending || otpSent}
                      className="px-3 bg-[#2A1A1D] hover:bg-[#E01B22] text-[#F7F2F2] rounded-[2px] text-xs font-mono font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {otpSending ? 'SENDING...' : otpSent ? 'SENT' : 'SEND OTP'}
                    </button>
                  </div>
                  {errors.email && <p className={errorClass}>{(errors.email as any).message}</p>}
                </div>
                {otpSent && (
                  <div>
                    <label className={labelClass}>OTP Verification *</label>
                    <input type="text" {...register('otp')} placeholder="Enter 6-digit OTP" className={inputClass} maxLength={6} />
                    {errors.otp && <p className={errorClass}>{(errors.otp as any).message}</p>}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>College / Institution *</label>
                  <input type="text" {...register('college_name')} placeholder="PSG College of Technology" className={inputClass} />
                  {errors.college_name && <p className={errorClass}>{(errors.college_name as any).message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Department / Stream</label>
                  <input type="text" {...register('department')} placeholder="Computer Applications (MCA)" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Roll Number / Student ID</label>
                  <input type="text" {...register('roll_no')} placeholder="24MX101" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Year of Study</label>
                  <select {...register('year_of_study')} className={inputClass}>
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

          {/* Alumni-only fields */}
          {userType === 'ALUMNI' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Alumni Batch Code *</label>
                <input type="text" {...register('batch_year')} placeholder="e.g. 25MX" className={inputClass} />
                {errors.batch_year && <p className={errorClass}>{(errors.batch_year as any).message}</p>}
              </div>
              <div>
                <label className={labelClass}>City / Location</label>
                <input type="text" {...register('place')} placeholder="Coimbatore" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Current Organization</label>
                <input type="text" {...register('current_organization')} placeholder="Company Name" className={inputClass} />
              </div>
            </div>
          )}

          <label className="flex items-center gap-3 text-xs text-[#F7F2F2] font-mono cursor-pointer">
            <input type="checkbox" {...register('accommodation_required')} className="h-4 w-4 accent-[#E01B22]" />
            <span>Accommodation required</span>
          </label>

          {/* Password (Participants Only) */}
          {userType !== 'ALUMNI' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="••••••••" className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9AA2] hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className={errorClass}>{(errors.password as any).message}</p>}
              </div>
              <div>
                <label className={labelClass}>Confirm Password *</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword')} placeholder="••••••••" className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9AA2] hover:text-white">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className={errorClass}>{(errors.confirmPassword as any).message}</p>}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="shimmer-btn w-full py-3.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-bold font-mono rounded-[2px] transition-all hover:shadow-[0_0_25px_rgba(224,27,34,0.4)] flex items-center justify-center gap-2 mt-4 text-sm disabled:opacity-60"
          >
            {loading ? 'PROCESSING...' : `COMPLETE REGISTRATION`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {userType === 'PARTICIPANT' && (
          <div className="bg-[#E08A17]/10 border border-[#E08A17]/40 p-3.5 rounded-[2px] flex items-start gap-3 text-[11px] text-[#E08A17] font-mono leading-relaxed mt-2">
            <FileWarning className="w-5 h-5 shrink-0" />
            <p>
              <strong className="font-bold">IMPORTANT:</strong> A valid Bonafide Certificate from your college is strictly required for participation verification at the venue.
            </p>
          </div>
        )}

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
