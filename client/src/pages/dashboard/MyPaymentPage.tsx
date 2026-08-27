import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { QrCode, UploadCloud, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const MyPaymentPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: paymentData, isLoading } = useQuery({
    queryKey: ['payment-status'],
    queryFn: async () => {
      const res = await api.payments.getMyStatus();
      return res.data;
    },
  });

  const [refNumber, setRefNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const status = paymentData?.status || 'NOT_SUBMITTED';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber || !paymentDate || !receiptFile) {
      alert('Please fill out all required fields and upload a receipt.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload file first
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      
      const uploadRes = await api.uploads.uploadReceipt(formData);
      const receipt_url = uploadRes.data.url;

      // Submit payment details
      await api.payments.initiate({
        transaction_reference: refNumber,
        receipt_url,
        amount: 150,
        payment_date: paymentDate,
        payment_method: paymentMethod
      });

      alert('Payment details submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['payment-status'] });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit payment details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-[#6B5A5C] font-mono text-xs text-center py-10">Loading payment status...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-display font-bold text-[#F7F2F2]">Registration Payment</h1>
        <p className="text-xs text-[#6B5A5C] font-mono mt-1">Submit your symposium fee to unlock event registrations.</p>
      </div>

      {status === 'VERIFIED' && (
        <div className="bg-[#1FA971]/10 border border-[#1FA971] p-8 rounded-[2px] text-center space-y-4 shadow-[0_0_20px_rgba(31,169,113,0.15)]">
          <CheckCircle className="w-12 h-12 text-[#1FA971] mx-auto" />
          <div>
            <h2 className="text-lg font-display font-bold text-[#1FA971] tracking-wider">PAYMENT VERIFIED</h2>
            <p className="text-xs text-[#A79798] font-mono mt-2">Your registration payment has been approved.</p>
            <p className="text-xs text-[#A79798] font-mono mt-1">You can now proceed with event and team registration.</p>
          </div>
          <div className="pt-4">
            <a href="/dashboard/events" className="inline-block px-6 py-2.5 bg-[#1FA971] hover:bg-[#27C487] text-[#0A0607] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors">
              BROWSE EVENTS →
            </a>
          </div>
        </div>
      )}

      {status === 'PENDING' && (
        <div className="bg-[#130C0E] border border-[#E08A17] p-8 rounded-[2px] text-center space-y-4">
          <Clock className="w-12 h-12 text-[#E08A17] mx-auto" />
          <div>
            <h2 className="text-lg font-display font-bold text-[#E08A17] tracking-wider">VERIFICATION PENDING</h2>
            <p className="text-xs text-[#A79798] font-mono mt-2">Payment submitted successfully.</p>
            <p className="text-[10px] text-[#A79798] font-mono mt-1">Reference ID: {paymentData.transaction_reference}</p>
            <p className="text-xs text-[#A79798] font-mono mt-4 border-t border-[#2A1A1D] pt-4">Your payment is currently awaiting coordinator approval. This may take a few hours.</p>
          </div>
        </div>
      )}

      {(status === 'NOT_SUBMITTED' || status === 'REJECTED') && (
        <div className="space-y-6">
          {status === 'REJECTED' && (
            <div className="bg-[#4A050A] border border-[#E01B22] p-5 rounded-[2px] flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-[#FF2A2A] shrink-0" />
              <div>
                <h3 className="text-sm font-display font-bold text-[#FF2A2A]">PAYMENT REJECTED</h3>
                <p className="text-xs text-[#F7F2F2] font-mono mt-1">Reason: {paymentData?.rejection_reason}</p>
                <p className="text-[10px] text-[#A79798] font-mono mt-2">Please correct the issue and resubmit your payment details below.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px] space-y-5">
              <h2 className="text-sm font-display font-bold text-[#E01B22] border-b border-[#2A1A1D] pb-3">
                PAYMENT INSTRUCTIONS
              </h2>
              
              <div className="space-y-4 font-mono text-xs text-[#A79798]">
                <div className="flex justify-between items-center bg-[#0A0607] p-3 border border-[#2A1A1D] rounded-[2px]">
                  <span>Registration Fee:</span>
                  <span className="text-lg font-bold text-[#F7F2F2]">₹150</span>
                </div>
                
                <div>
                  <p className="text-[#F7F2F2] font-bold mb-2">Scan QR Code to Pay (UPI)</p>
                  <div className="bg-[#F7F2F2] p-4 rounded-[2px] inline-block mb-3 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <QrCode className="w-32 h-32 text-[#0A0607]" />
                  </div>
                  <p>UPI ID: <span className="text-[#F7F2F2] font-bold select-all">login2k26@psg</span></p>
                </div>
                
                <div className="pt-4 border-t border-[#2A1A1D]">
                  <p className="text-[10px]">After completing the payment, capture a screenshot of the successful transaction containing the UTR/Reference number and upload it here.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#130C0E] border border-[#2A1A1D] p-6 rounded-[2px]">
              <h2 className="text-sm font-display font-bold text-[#F7F2F2] border-b border-[#2A1A1D] pb-3 mb-5">
                SUBMIT PAYMENT DETAILS
              </h2>
              
              <form onSubmit={submitPayment} className="space-y-4 font-body text-xs">
                <div>
                  <label className="block text-[#A79798] mb-1.5 font-bold font-mono">Amount Paid *</label>
                  <input
                    type="text"
                    value="₹150"
                    disabled
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] text-[#6B5A5C] p-2.5 rounded-[2px] outline-none font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[#A79798] mb-1.5 font-bold font-mono">Transaction Ref / UTR Number *</label>
                  <input
                    type="text"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    required
                    placeholder="e.g. 324156789012"
                    className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none font-mono transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A79798] mb-1.5 font-bold font-mono">Payment Date *</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      required
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none font-mono transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A79798] mb-1.5 font-bold font-mono">Method *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-[#0A0607] border border-[#2A1A1D] focus:border-[#E01B22] text-[#F7F2F2] p-2.5 rounded-[2px] outline-none font-mono transition-colors"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A79798] mb-1.5 font-bold font-mono">Payment Screenshot / Receipt *</label>
                  <div className="border-2 border-dashed border-[#2A1A1D] hover:border-[#E01B22] bg-[#0A0607] p-4 text-center rounded-[2px] transition-colors relative">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp, application/pdf"
                      onChange={handleFileChange}
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-6 h-6 text-[#6B5A5C] mx-auto mb-2" />
                    <span className="text-[#A79798] font-mono text-[10px]">
                      {receiptFile ? receiptFile.name : 'Click or drag file to upload'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 bg-[#E01B22] hover:bg-[#FF2A2A] disabled:opacity-50 text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] shadow-[0_0_15px_rgba(224,27,34,0.2)] transition-all"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FOR VERIFICATION'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
