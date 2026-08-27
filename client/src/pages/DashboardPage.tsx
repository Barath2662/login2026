import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { CreditCard, ShieldCheck, Clock, XCircle, AlertCircle, ExternalLink, QrCode, Trash2, ArrowRight } from 'lucide-react';

interface PaymentInfo {
  id: number;
  transaction_reference: string;
  receipt_url?: string;
  status: 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejection_reason?: string;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form inputs
  const [refInput, setRefInput] = useState('');
  const [receiptInput, setReceiptInput] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [payRes, regRes] = await Promise.all([
        api.payments.getMyStatus(),
        api.registrations.getMyRegistrations(),
      ]);

      if (payRes.data) {
        setPayment(payRes.data);
      }
      if (Array.isArray(regRes.data)) {
        setRegistrations(regRes.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!refInput.trim()) {
      setPaymentError('Transaction Reference / UTR Number is required.');
      return;
    }

    try {
      setSubmittingPayment(true);
      const res = await api.payments.initiate({
        transaction_reference: refInput,
        receipt_url: receiptInput || undefined,
      });

      setPayment(res.data);
      setRefInput('');
      setReceiptInput('');
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || 'Failed to submit payment reference.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleCancelRegistration = async (regId: number) => {
    try {
      await api.registrations.cancel(regId);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel registration.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0607] py-12 px-4 flex items-center justify-center">
        <div className="text-center font-mono text-[#A79798]">Loading Survivor Telemetry...</div>
      </div>
    );
  }

  const pStatus = payment?.status || 'NOT_SUBMITTED';

  return (
    <div className="min-h-screen bg-[#0A0607] py-12 px-4 sm:px-6 lg:px-8 text-[#F7F2F2]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 1. Identity Card (§9.4) */}
        <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 sm:p-8 rounded-[2px] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 corner-bracket-container">
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-br" />

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#7E0910] border-2 border-[#E01B22] flex items-center justify-center font-display font-extrabold text-2xl text-[#F7F2F2]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-display font-bold text-[#F7F2F2]">{user?.name}</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#1A1114] text-[#FF2A2A] border border-[#3E2529] rounded-[2px] uppercase">
                  {user?.user_type || 'PARTICIPANT'}
                </span>
                
                {/* Dynamic Verification Status Badge */}
                {pStatus === 'VERIFIED' ? (
                  <span className="px-3 py-0.5 text-xs font-mono font-bold bg-[#1FA971]/20 text-[#1FA971] border border-[#1FA971] rounded-[2px] flex items-center gap-1.5 shadow-[0_0_12px_rgba(31,169,113,0.3)]">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED SURVIVOR
                  </span>
                ) : pStatus === 'PENDING' ? (
                  <span className="px-3 py-0.5 text-xs font-mono font-bold bg-[#E08A17]/20 text-[#E08A17] border border-[#E08A17] rounded-[2px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> PENDING VERIFICATION
                  </span>
                ) : (
                  <span className="px-3 py-0.5 text-xs font-mono font-bold bg-[#4A050A] text-[#FF2A2A] border border-[#E01B22] rounded-[2px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> UNVERIFIED (PAY FEE)
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A79798] font-mono mt-1.5">{user?.email} • {user?.college_name || 'PSG Tech'}</p>
              {user?.user_type === 'PARTICIPANT' && (
                <p className="text-[11px] text-[#E08A17] font-mono mt-2">Bonafide certificate is mandatory to participate.</p>
              )}
            </div>
          </div>

          {/* Student ID Code in Mono */}
          {user?.student_id_code && pStatus === 'VERIFIED' && (
            <div className="bg-[#0A0607] border border-[#1FA971] p-4 rounded-[2px] flex items-center gap-4">
              <QrCode className="w-8 h-8 text-[#1FA971]" />
              <div>
                <span className="mono-label block text-[#A79798]">OFFICIAL STUDENT ID</span>
                <span className="text-lg font-mono font-extrabold text-[#1FA971] tracking-wider">{user.student_id_code}</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Journey Rail (Circuit Trace Progress Element) */}
        <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-4">
          <span className="mono-label text-[#E01B22] font-bold">SURVIVOR JOURNEY TRACKER</span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs text-center">
            
            <div className="p-3 bg-[#0A0607] border border-[#E01B22] rounded-[2px] text-[#F7F2F2]">
              <span className="text-[10px] text-[#E01B22] block">STEP 01</span>
              <strong className="block mt-1">ACCOUNT REGISTERED ✓</strong>
            </div>

            <div className={`p-3 rounded-[2px] border ${
              pStatus !== 'NOT_SUBMITTED' ? 'bg-[#0A0607] border-[#E01B22] text-[#F7F2F2]' : 'bg-[#0A0607] border-[#2A1A1D] text-[#6B5A5C]'
            }`}>
              <span className="text-[10px] block text-[#6B5A5C]">STEP 02</span>
              <strong className="block mt-1">PAYMENT REFERENCE</strong>
            </div>

            <div className={`p-3 rounded-[2px] border ${
              pStatus === 'VERIFIED' ? 'bg-[#0A0607] border-[#1FA971] text-[#1FA971]' : 'bg-[#0A0607] border-[#2A1A1D] text-[#6B5A5C]'
            }`}>
              <span className="text-[10px] block text-[#6B5A5C]">STEP 03</span>
              <strong className="block mt-1">DESK VERIFIED</strong>
            </div>

            <div className={`p-3 rounded-[2px] border ${
              registrations.length > 0 ? 'bg-[#0A0607] border-[#E01B22] text-[#F7F2F2]' : 'bg-[#0A0607] border-[#2A1A1D] text-[#6B5A5C]'
            }`}>
              <span className="text-[10px] block text-[#6B5A5C]">STEP 04</span>
              <strong className="block mt-1">EVENTS ENROLLED ({registrations.length})</strong>
            </div>

          </div>
        </div>

        {/* 3. Payment Verification Section */}
        <div id="payment" className="bg-[#130C0E] border border-[#2A1A1D] p-6 sm:p-8 rounded-[2px] space-y-6">
          <div className="flex items-center justify-between border-b border-[#2A1A1D] pb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#E01B22]" />
              <div>
                <h2 className="text-lg font-display font-bold text-[#F7F2F2]">FEST REGISTRATION PAYMENT</h2>
                <p className="text-xs text-[#A79798] font-body">Payment verification unlocks event registrations</p>
              </div>
            </div>

            {/* Status Badges */}
            {pStatus === 'VERIFIED' && (
              <span className="chip-verified px-3 py-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> VERIFIED
              </span>
            )}
            {pStatus === 'PENDING' && (
              <span className="chip-pending px-3 py-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> PENDING VERIFICATION
              </span>
            )}
            {pStatus === 'REJECTED' && (
              <span className="chip-rejected px-3 py-1 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> REJECTED
              </span>
            )}
            {pStatus === 'NOT_SUBMITTED' && (
              <span className="chip-closed px-3 py-1">
                UNPAID
              </span>
            )}
          </div>

          {/* Unpaid / Rejected Form */}
          {(pStatus === 'NOT_SUBMITTED' || pStatus === 'REJECTED') && (
            <div className="space-y-6">
              
              {pStatus === 'REJECTED' && payment?.rejection_reason && (
                <div className="bg-[#4A050A]/40 border border-[#E01B22] p-4 rounded-[2px] space-y-1 text-xs text-[#FF2A2A]">
                  <p className="font-bold font-mono">Rejection Reason from Desk:</p>
                  <p className="font-body text-[#F7F2F2]">{payment.rejection_reason}</p>
                </div>
              )}

              <div className="bg-[#0A0607] p-5 rounded-[2px] border border-[#2A1A1D] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-sm text-[#F7F2F2]">Step 1: Pay via PSG Portal</h4>
                  <p className="text-xs text-[#A79798] mt-1">Complete your registration payment of ₹100 on the official PSG EMS portal.</p>
                </div>
                <a
                  href="https://events.psginstitutions.in/EMS/register/E5294158179"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-[#E08A17] hover:bg-[#E01B22] text-[#0A0607] hover:text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors flex items-center gap-2 shrink-0"
                >
                  OPEN PSG PORTAL <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs font-body">
                <h4 className="font-display font-bold text-sm text-[#F7F2F2]">Step 2: Submit Reference Code</h4>

                {paymentError && (
                  <div className="bg-[#4A050A]/40 border border-[#E01B22] p-3 rounded-[2px] flex items-center gap-3 text-xs text-[#FF2A2A]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">Transaction Reference / UTR Number *</label>
                    <input
                      type="text"
                      value={refInput}
                      onChange={(e) => setRefInput(e.target.value)}
                      placeholder="e.g. PSG-EMS-948102"
                      required
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A79798] mb-1 font-semibold">Receipt URL / Image Link (Optional)</label>
                    <input
                      type="text"
                      value={receiptInput}
                      onChange={(e) => setReceiptInput(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] rounded-[2px] px-3.5 py-2.5 text-[#F7F2F2] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-6 py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-bold font-mono text-xs uppercase rounded-[2px] shadow-md"
                >
                  {submittingPayment ? 'SUBMITTING...' : 'SUBMIT PAYMENT REFERENCE'}
                </button>
              </form>
            </div>
          )}

          {/* Pending Info */}
          {pStatus === 'PENDING' && (
            <div className="bg-[#0A0607] p-6 rounded-[2px] border border-[#E08A17] space-y-2">
              <p className="text-xs font-mono text-[#E08A17] font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" /> Reference Code Under Review
              </p>
              <p className="text-xs text-[#A79798]">
                Your reference <strong className="text-[#F7F2F2] font-mono">{payment?.transaction_reference}</strong> is being verified by the finance desk. Event registration will automatically unlock upon confirmation.
              </p>
            </div>
          )}

          {/* Verified Info */}
          {pStatus === 'VERIFIED' && (
            <div className="bg-[#0A0607] p-6 rounded-[2px] border border-[#1FA971] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-[#1FA971] font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Access Unlocked
                </p>
                <p className="text-xs text-[#A79798] mt-1">
                  You are a fully verified participant for LOGIN 2026. Browse the arena to enroll in competitions.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 sm:p-8 rounded-[2px] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2A1A1D] pb-4">
            <h2 className="text-lg font-display font-bold text-[#F7F2F2]">MY REGISTERED EVENTS ({registrations.length})</h2>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-[10px] font-bold uppercase rounded-[2px] transition-colors"
            >
              Register Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {registrations.length === 0 ? (
            <div className="text-center py-12 bg-[#0A0607] border border-[#2A1A1D] rounded-[2px] p-6 space-y-3">
              <p className="text-xs font-mono text-[#A79798]">You have not registered for any events yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body">
                <thead className="bg-[#0A0607] text-[#6B5A5C] font-mono border-b border-[#3E2529]">
                  <tr>
                    <th className="p-3">EVENT</th>
                    <th className="p-3">DAY / TIME</th>
                    <th className="p-3">TEAM NAME</th>
                    <th className="p-3">VENUE</th>
                    <th className="p-3">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1A1D]">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#1A1114] transition-colors align-top">
                      <td className="p-3 font-bold text-[#F7F2F2]">{reg.event?.name || `Event #${reg.event_id}`}</td>
                      <td className="p-3 font-mono text-[#A79798]">
                        Day {reg.event?.day || 18} Sep ({reg.event?.start_time?.slice(0, 5)} - {reg.event?.end_time?.slice(0, 5)})
                      </td>
                      <td className="p-3 font-mono text-[#E08A17]">
                        <div className="space-y-1">
                          <div>{reg.team_name || '-'}</div>
                          {Array.isArray(reg.team_members) && reg.team_members.length > 0 && (
                            <div className="space-y-1 text-[10px] text-[#A79798]">
                              {reg.team_members.map((member, idx) => (
                                <div key={`${member.email || member.name || 'member'}-${idx}`} className="flex items-center gap-2">
                                  <span className={member.status === 'pending' ? 'text-[#E08A17]' : 'text-[#1FA971]'}>
                                    {member.status === 'pending' ? '•' : '✓'}
                                  </span>
                                  <span>
                                    {member.email || member.name || 'team member not registered'}
                                    {member.status === 'pending' && ' (team member not registered)'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-[#A79798]">{reg.event?.venue || 'TBA'}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleCancelRegistration(reg.id)}
                          className="text-[#A79798] hover:text-[#FF2A2A] p-1 transition-colors"
                          title="Cancel Event Registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
