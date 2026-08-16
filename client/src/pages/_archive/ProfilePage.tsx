import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { GlitchText } from '../components/ui/GlitchText';
import { Button } from '../components/ui/Button';
import { QrCode, Shield, LogOut, TerminalSquare, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const ProfilePage = () => {
  const { survivor, resetAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    resetAuth();
    navigate('/app');
  };

  if (!survivor) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 pt-10">
      
      <div className="flex justify-between items-center border-b border-border-color pb-6">
        <div>
          <GlitchText as="h1" className="text-3xl font-mono font-bold text-white uppercase">
            Survivor Profile
          </GlitchText>
          <p className="text-text-secondary mt-2">ID: {survivor.id.split('-')[0]} // STATUS: {survivor.hasPaidFee ? 'VERIFIED' : 'UNVERIFIED'}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" />
          Disconnect
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Survivor Pass (ID Card) */}
        <div className="relative group perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-br from-color-red/20 to-color-silver/20 rounded-xl blur-xl transition-all duration-500 group-hover:blur-2xl opacity-50"></div>
          
          <div className="relative bg-bg-card border border-border-color rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-y-12">
            {/* Pass Header */}
            <div className="bg-border-color p-4 flex justify-between items-center">
              <span className="font-mono text-sm font-bold tracking-widest text-white">LOGIN 2K26</span>
              <Shield size={18} className={survivor.hasPaidFee ? 'text-color-red' : 'text-color-danger'} />
            </div>
            
            {/* Pass Body */}
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-text-muted font-mono mb-1">DESIGNATION</p>
                  <h2 className="text-2xl font-bold text-white uppercase">{survivor.fullName}</h2>
                  <p className="text-color-red font-mono text-sm mt-1">{survivor.role?.toUpperCase() || 'PARTICIPANT'}</p>
                </div>
                
                {/* Mock QR */}
                <div className="bg-white p-2 rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <QrCode size={64} className="text-black" />
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border-color/50">
                <div>
                  <p className="text-xs text-text-muted font-mono">CONTACT LINK</p>
                  <p className="text-white text-sm">{survivor.email}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted font-mono">ACCESS LEVEL</p>
                  <p className={`text-sm font-bold font-mono ${survivor.hasPaidFee ? 'text-color-red' : 'text-color-danger'}`}>
                    {survivor.hasPaidFee ? 'MULTIVERSE HUB UNLOCKED' : 'ARMORY CLEARANCE REQUIRED'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Pass Footer Scanline */}
            <div className="h-1 w-full bg-gradient-to-r from-color-red via-color-silver to-color-danger opacity-80"></div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-bg-card border border-border-color rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Mission Status</h3>
            {!survivor.hasPaidFee ? (
              <div className="space-y-4">
                <p className="text-text-secondary text-sm">
                  Your registration fee is pending. You cannot enter the Worlds until clearance is granted.
                </p>
                <Button className="w-full" onClick={() => navigate('/armory')}>
                  Proceed to Armory
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-text-secondary text-sm">
                  Clearance granted. The Multiverse Hub is waiting for you.
                </p>
                <Button className="w-full" onClick={() => navigate('/hub')}>
                  Enter the Hub
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Combat Log Section */}
      <div id="combat-log" className="mt-16 pt-8 border-t border-border-color/30">
        <div className="flex items-center space-x-3 mb-8">
          <TerminalSquare className="text-color-red" size={24} />
          <h2 className="text-2xl font-mono font-bold text-white uppercase">Combat Log</h2>
        </div>

        <div className="bg-bg-card border border-border-color rounded-xl p-6 md:p-8 min-h-[200px]">
          {(!survivor.registrations || survivor.registrations.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-12 opacity-70">
              <Activity size={48} className="text-text-muted" />
              <p className="text-text-secondary font-mono tracking-widest uppercase">No active combat records found.</p>
              <p className="text-text-muted text-sm text-center max-w-md">
                Register for Worlds in the Multiverse Grid to generate combat logs.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/#multiverse-grid')}>
                BROWSE WORLDS
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {survivor.registrations.map((reg: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-4 border border-border-color/30 rounded-sm bg-bg-secondary hover:border-color-red/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-color-red animate-pulse" />
                    <div>
                      <p className="font-mono text-sm text-white font-bold">{reg.worldId}</p>
                      <p className="text-xs text-text-muted font-mono mt-1">STATUS: DEPLOYED</p>
                    </div>
                  </div>
                  <span className="text-xs text-color-silver/50 font-mono hidden sm:block">
                    {new Date(reg.createdAt || Date.now()).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
