import { useState, useEffect, useRef } from 'react';
import { GlitchText } from '../../components/ui/GlitchText';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, X, Shield, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [bonafideStatus, setBonafideStatus] = useState('MISSING');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, bonafideRes] = await Promise.allSettled([
        api.get('/users/profile'),
        api.get('/bonafides/my')
      ]);

      if (profileRes.status === 'fulfilled') {
        setUserProfile(profileRes.value.data.user || profileRes.value.data);
      }

      if (bonafideRes.status === 'fulfilled') {
        const bonafides = Array.isArray(bonafideRes.value.data) ? bonafideRes.value.data : (bonafideRes.value.data.data || []);
        if (bonafides.length > 0) {
          const latest = bonafides[0];
          if (latest.is_verified) {
            setBonafideStatus('VERIFIED');
          } else {
            setBonafideStatus(latest.status === 'rejected' ? 'REJECTED' : 'PENDING');
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        alert('File must be PDF, JPG, or PNG.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File exceeds 5MB limit.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'login2k26_preset');

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'login2k26'}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!uploadRes.ok) throw new Error('Upload to Cloudinary failed');
      const data = await uploadRes.json();

      await api.post('/bonafides/', { file_url: data.secure_url });
      
      setBonafideStatus('PENDING');
      setSelectedFile(null);
      alert('Bonafide uploaded successfully. Waiting for verification.');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to upload bonafide.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-color-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative min-h-[80vh]">
      {/* Background Decor */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-color-red/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="mb-10 text-center relative z-10">
        <GlitchText as="h1" className="text-4xl md:text-5xl font-mono font-bold uppercase tracking-widest text-white mb-4">
          Survivor <span className="text-color-red">Dossier</span>
        </GlitchText>
        <p className="text-text-secondary max-w-2xl mx-auto font-mono text-sm">
          Review your classified personnel file and ensure your clearance documents are up to date.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-card border border-border-color p-6 md:p-8 rounded-sm shadow-xl">
            <h2 className="text-xl font-bold font-mono text-white border-b border-color-red/30 pb-4 mb-6 flex items-center gap-3">
              <span className="w-2 h-6 bg-color-red block"></span>
              Identity Matrix
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Full Name</label>
                <Input value={userProfile?.name || ''} readOnly className="bg-black/40 border-border-color cursor-not-allowed opacity-80" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Registry ID</label>
                <Input value={userProfile?.id || ''} readOnly className="bg-black/40 border-border-color cursor-not-allowed opacity-80 text-color-red font-mono" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">College Name</label>
                <Input value={userProfile?.college_name || ''} readOnly className="bg-black/40 border-border-color cursor-not-allowed opacity-80" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Department</label>
                <Input value={userProfile?.department || ''} readOnly className="bg-black/40 border-border-color cursor-not-allowed opacity-80" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Email Address</label>
                <Input value={userProfile?.email || 'Unknown'} readOnly className="bg-black/40 border-border-color cursor-not-allowed opacity-80" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Mobile Number</label>
                <Input value={userProfile?.phone || ''} readOnly className="bg-black/40 border-border-color cursor-not-allowed opacity-80" />
              </div>
            </div>

            <div className="mt-8 p-4 bg-color-red/5 border border-color-red/20 rounded-sm">
              <p className="text-xs text-text-secondary font-mono leading-relaxed">
                <span className="text-color-red font-bold">NOTE:</span> Core identity parameters are locked after initial registration to prevent database corruption. To request an amendment, contact the central administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Bonafide Upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bg-card border border-border-color p-6 md:p-8 rounded-sm shadow-xl h-full flex flex-col">
            <h2 className="text-xl font-bold font-mono text-white border-b border-color-red/30 pb-4 mb-6 flex items-center gap-3">
              <span className="w-2 h-6 bg-color-silver block"></span>
              Clearance Document
            </h2>

            <div className="flex-1 flex flex-col">
              {/* Status Banner */}
              <div className={`p-4 rounded-sm border mb-6 flex items-start gap-3 ${
                bonafideStatus === 'VERIFIED' ? 'bg-red-500/10 border-red-500/30' :
                bonafideStatus === 'PENDING' ? 'bg-zinc-500/10 border-zinc-500/30' :
                bonafideStatus === 'REJECTED' ? 'bg-color-danger/10 border-color-danger/30' :
                'bg-color-red/10 border-color-red/30'
              }`}>
                {bonafideStatus === 'VERIFIED' && <CheckCircle2 className="text-red-500 shrink-0 mt-0.5" size={20} />}
                {bonafideStatus === 'PENDING' && <AlertTriangle className="text-zinc-500 shrink-0 mt-0.5" size={20} />}
                {bonafideStatus === 'REJECTED' && <X className="text-color-danger shrink-0 mt-0.5" size={20} />}
                {bonafideStatus === 'MISSING' && <AlertTriangle className="text-color-red shrink-0 mt-0.5" size={20} />}
                
                <div>
                  <div className={`text-sm font-bold tracking-wider font-mono uppercase mb-1 ${
                    bonafideStatus === 'VERIFIED' ? 'text-red-500' :
                    bonafideStatus === 'PENDING' ? 'text-zinc-500' :
                    bonafideStatus === 'REJECTED' ? 'text-color-danger' :
                    'text-color-red'
                  }`}>
                    Status: {bonafideStatus}
                  </div>
                  <div className="text-xs text-text-secondary leading-relaxed">
                    {bonafideStatus === 'VERIFIED' && 'Your bonafide certificate has been verified. You are cleared for all events.'}
                    {bonafideStatus === 'PENDING' && 'Document under review by Central Command. Please check back later.'}
                    {bonafideStatus === 'REJECTED' && 'Document rejected. Please upload a valid, clearly visible bonafide certificate.'}
                    {bonafideStatus === 'MISSING' && 'CRITICAL: Bonafide certificate is required for event participation.'}
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              {bonafideStatus !== 'VERIFIED' && bonafideStatus !== 'PENDING' && (
                <div className="flex-1 flex flex-col justify-center">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden" 
                  />
                  
                  {!selectedFile ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border-color hover:border-color-red/50 bg-black/30 hover:bg-color-red/5 transition-all rounded-sm p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
                    >
                      <UploadCloud size={40} className="text-text-muted mb-4" />
                      <p className="text-sm font-bold text-white mb-2">Initialize Upload Sequence</p>
                      <p className="text-xs text-text-muted">Click to browse or drag document here</p>
                      <p className="text-[10px] text-text-muted mt-4 font-mono uppercase">Supported: PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  ) : (
                    <div className="border border-border-color bg-black/40 rounded-sm p-6 flex flex-col items-center text-center">
                      <FileText size={48} className="text-color-red mb-4" />
                      <p className="text-sm font-bold text-white mb-1 truncate w-full px-4">{selectedFile.name}</p>
                      <p className="text-xs text-text-muted mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      
                      <div className="flex gap-3 w-full">
                        <Button variant="outline" className="flex-1 text-xs h-10" onClick={() => setSelectedFile(null)} disabled={isUploading}>
                          CANCEL
                        </Button>
                        <Button className="flex-1 text-xs h-10 flex items-center justify-center gap-2" onClick={handleUpload} disabled={isUploading}>
                          {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                          TRANSMIT
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Verified State View */}
              {(bonafideStatus === 'VERIFIED' || bonafideStatus === 'PENDING') && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 p-6 text-center border border-dashed border-border-color rounded-sm">
                  <Shield size={48} className="mb-4 text-text-muted" />
                  <p className="text-sm text-text-secondary font-mono">Upload Portal Locked</p>
                  <p className="text-xs text-text-muted mt-2">Document is currently verified or under review.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
