import { FC, useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import imageCompression from 'browser-image-compression';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';
import { UploadCloud, CheckCircle2, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileCompletionModal: FC<ProfileCompletionModalProps> = ({ isOpen, onClose }) => {
  const { session, setSurvivor } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    college: 'PSG College of Technology',
    rollNo: '',
    mobileNo: '',
    department: '',
  });

  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  
  // Bonafide state
  const [bonafideUrl, setBonafideUrl] = useState<string | null>(null);
  const [isUploadingBonafide, setIsUploadingBonafide] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      const defaultName = session.user.user_metadata?.full_name || '';
      const email = session.user.email || '';
      
      if (email.endsWith('@psgtech.ac.in')) {
        const roll = email.split('@')[0].toUpperCase();
        setFormData(prev => ({ ...prev, fullName: defaultName, rollNo: roll, college: 'PSG College of Technology' }));
      } else {
        setFormData(prev => ({ ...prev, fullName: defaultName, rollNo: '', college: '' }));
      }
    }
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPEG and PNG images are allowed for ID cards.');
        return;
      }
      setFile(file);
      setError(null);
    }
  };

  const handleBonafideUpload = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setError('Bonafide Certificate must be PDF, JPG, or PNG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Bonafide Certificate exceeds 5MB limit.');
      return;
    }

    setIsUploadingBonafide(true);
    setError(null);
    try {
      const { data: urlData } = await api.post('/storage/upload-url', {
        side: 'bonafide',
        contentType: file.type
      });

      const uploadRes = await fetch(urlData.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const { data: publicUrlData } = supabase.storage
        .from('survivor-documents')
        .getPublicUrl(urlData.path);

      setBonafideUrl(publicUrlData.publicUrl);
    } catch (err: any) {
      console.error('Error uploading Bonafide:', err);
      setError('Failed to upload Bonafide Certificate. Please try again.');
    } finally {
      setIsUploadingBonafide(false);
    }
  };

  const compressAndUpload = async (file: File, side: 'front' | 'back') => {
    const options = { maxSizeMB: 5, maxWidthOrHeight: 1920, useWebWorker: true };
    const compressedFile = await imageCompression(file, options);

    const { data: urlData } = await api.post('/storage/upload-url', {
      side,
      contentType: compressedFile.type
    });

    const uploadRes = await fetch(urlData.signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': compressedFile.type },
      body: compressedFile
    });

    if (!uploadRes.ok) throw new Error(`Failed to upload ${side} ID card`);
    return urlData.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFront || !idBack) {
      setError('Both front and back ID card images are required.');
      return;
    }
    if (!bonafideUrl) {
      setError('Bonafide Certificate upload is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const frontPath = await compressAndUpload(idFront, 'front');
      const backPath = await compressAndUpload(idBack, 'back');

      const { data } = await api.post('/users/complete-profile', {
        ...formData,
        fullName: formData.fullName || session?.user?.user_metadata?.full_name || 'Unknown Survivor',
        idCardFrontUrl: frontPath,
        idCardBackUrl: backPath,
        bonafideUrl
      });

      setSurvivor(data);
      onClose();
    } catch (err: any) {
      console.error('Profile completion error:', err);
      const errorMsg = err.response?.data?.details?.[0]?.message || err.response?.data?.error || err.message || 'Failed to complete profile.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050505]/90 z-[100] backdrop-blur-sm p-4 overflow-y-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-[#111420]/80 backdrop-blur-md border border-[#A8A9AD] shadow-[0_0_15px_rgba(168,169,173,0.3)] rounded-sm overflow-hidden my-2 sm:my-4"
        >
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-mono font-bold text-white mb-2 uppercase tracking-widest">
              INITIALIZE DOSSIER
            </h2>
            <p className="text-[#A8A9AD] text-sm font-mono mb-4">
              Complete your profile to gain full access to the Multiverse Hub.
            </p>

            {error && (
              <div className="mb-4 p-2 bg-[#D90429]/10 border border-[#D90429] text-[#D90429] text-xs font-mono flex items-start space-x-2">
                <span className="mt-0.5">{'>'}</span>
                <span>ERR: {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Neon Input Field */}
                <div className="space-y-1">
                  <label className="text-xs text-[#A8A9AD] font-mono tracking-wider">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-[#A8A9AD] px-0 py-1 text-white font-mono text-sm focus:ring-0 focus:border-[#D90429] focus:shadow-[0_1px_10px_rgba(217,4,41,0.5)] transition-all outline-none"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-[#A8A9AD] font-mono tracking-wider">EMAIL (READ ONLY)</label>
                  <input
                    type="email"
                    readOnly
                    value={session?.user?.email || ''}
                    className="w-full bg-transparent border-0 border-b border-[#A8A9AD]/50 px-0 py-1 text-white/50 font-mono text-sm outline-none cursor-not-allowed"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-[#A8A9AD] font-mono tracking-wider">COLLEGE NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-[#A8A9AD] px-0 py-1 text-white font-mono text-sm focus:ring-0 focus:border-[#D90429] focus:shadow-[0_1px_10px_rgba(217,4,41,0.5)] transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#A8A9AD] font-mono tracking-wider">DEPARTMENT</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-[#A8A9AD] px-0 py-1 text-white font-mono text-sm focus:ring-0 focus:border-[#D90429] focus:shadow-[0_1px_10px_rgba(217,4,41,0.5)] transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#A8A9AD] font-mono tracking-wider">ROLL / REG NUMBER</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-[#A8A9AD] px-0 py-1 text-white font-mono text-sm focus:ring-0 focus:border-[#D90429] focus:shadow-[0_1px_10px_rgba(217,4,41,0.5)] transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#A8A9AD] font-mono tracking-wider">MOBILE NUMBER</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobileNo}
                    onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-[#A8A9AD] px-0 py-1 text-white font-mono text-sm focus:ring-0 focus:border-[#D90429] focus:shadow-[0_1px_10px_rgba(217,4,41,0.5)] transition-all outline-none"
                  />
                </div>
              </div>

              {/* ID Cards Section */}
              <div className="pt-4 border-t border-[#A8A9AD]/30 space-y-3">
                <h3 className="text-xs font-bold text-[#D90429] uppercase tracking-widest font-mono">
                  College ID Verification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#A8A9AD] font-mono mb-2">FRONT SIDE (JPG/PNG) *</label>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png"
                      onChange={(e) => handleImageChange(e, setIdFront)}
                      className="w-full text-[10px] sm:text-xs text-[#A8A9AD] file:mr-2 file:py-1 file:px-2 sm:file:mr-4 sm:file:py-1.5 sm:file:px-4 file:border-0 file:text-xs file:font-mono file:bg-[#D90429]/10 file:text-[#D90429] hover:file:bg-[#D90429]/20 cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#A8A9AD] font-mono mb-2">BACK SIDE (JPG/PNG) *</label>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png"
                      onChange={(e) => handleImageChange(e, setIdBack)}
                      className="w-full text-[10px] sm:text-xs text-[#A8A9AD] file:mr-2 file:py-1 file:px-2 sm:file:mr-4 sm:file:py-1.5 sm:file:px-4 file:border-0 file:text-xs file:font-mono file:bg-[#D90429]/10 file:text-[#D90429] hover:file:bg-[#D90429]/20 cursor-pointer"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bonafide Dropzone */}
              <div className="pt-4 border-t border-[#A8A9AD]/30 space-y-3">
                <h3 className="text-xs font-bold text-[#D90429] uppercase tracking-widest font-mono">
                  Bonafide Certificate *
                </h3>
                
                <div 
                  className={`relative w-full border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
                    ${bonafideUrl ? 'border-[#A8A9AD]/50 bg-black/40' : 'border-[#A8A9AD] hover:border-[#D90429] hover:shadow-[0_0_20px_rgba(217,4,41,0.2)] bg-[#050505]/50'}
                  `}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleBonafideUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => !bonafideUrl && fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/jpeg, image/png, application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleBonafideUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {isUploadingBonafide ? (
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="w-8 h-8 text-[#D90429] animate-spin" />
                      <span className="text-xs text-[#A8A9AD] font-mono animate-pulse">UPLOADING DATA...</span>
                    </div>
                  ) : bonafideUrl ? (
                    <div className="flex flex-col items-center space-y-3 z-10">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                      <span className="text-xs text-green-500 font-mono">UPLOAD SECURED</span>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBonafideUrl(null);
                        }}
                        className="text-xs text-[#D90429] hover:underline font-mono mt-2"
                      >
                        [ REMOVE & REUPLOAD ]
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 text-[#A8A9AD] group-hover:text-[#D90429] transition-colors">
                      <UploadCloud className="w-10 h-10" />
                      <div className="text-center">
                        <p className="text-sm font-mono mb-1">Drop Bonafide Certificate or click to browse</p>
                        <p className="text-xs opacity-60 font-mono">Supports PDF, JPG, PNG (Max 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#A8A9AD]/30">
                <button
                  type="button"
                  disabled={isSubmitting || isDisconnecting}
                  onClick={async () => {
                    setIsDisconnecting(true);
                    try {
                      await supabase.auth.signOut();
                      useAuthStore.getState().resetAuth();
                      onClose();
                    } finally {
                      setIsDisconnecting(false);
                    }
                  }}
                  className="w-full sm:w-1/3 px-4 py-2 sm:py-3 border border-[#A8A9AD] text-[#A8A9AD] font-mono text-sm tracking-widest uppercase hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  {isDisconnecting ? 'DISCONNECTING...' : 'DISCONNECT'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isDisconnecting}
                  className="w-full sm:w-2/3 px-4 py-2 sm:py-3 bg-[#D90429] text-white font-mono font-bold text-sm tracking-widest uppercase hover:bg-[#EF233C] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(217,4,41,0.4)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>PROCESSING LINK...</span>
                    </>
                  ) : (
                    <span>INITIALIZE SURVIVOR PROTOCOL</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
