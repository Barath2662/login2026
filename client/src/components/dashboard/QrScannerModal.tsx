import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { QrCode, Camera, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean; eventName?: string } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setMessage(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (e) {
        console.error('Error stopping scanner', e);
      }
      scannerRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setMessage(null);
    try {
      setIsCameraActive(true);
      setTimeout(async () => {
        const html5QrCode = new Html5Qrcode('qr-reader-view');
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            handleMarkAttendance(decodedText);
          },
          () => {}
        );
      }, 200);
    } catch (err: any) {
      console.error('Camera access failed:', err);
      setIsCameraActive(false);
      setMessage({ text: 'Camera access permission denied or camera not available.', isError: true });
    }
  };

  const handleMarkAttendance = async (codeToSubmit: string) => {
    const code = codeToSubmit.trim();
    if (!code) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await api.attendance.markByQR({ qr_code: code });
      const eventName = res.data?.event_name || 'Event';
      setMessage({
        text: res.data?.message || `Attendance marked PRESENT for ${eventName}!`,
        isError: false,
        eventName,
      });

      stopCamera();

      // Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#1FA971', '#E01B22', '#E08A17', '#F7F2F2'],
      });
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || 'Invalid QR code or failed to mark attendance.',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#130C0E] border border-[#2A1A1D] max-w-md w-full p-6 rounded-[2px] space-y-6 relative shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A1A1D] pb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#1FA971] animate-pulse" />
            <h3 className="font-display font-bold text-base text-[#F7F2F2] uppercase">
              CAMERA SCANNER • ATTENDANCE
            </h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-[#A79798] hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Message Banner */}
        {message && (
          <div className={`p-4 rounded-[2px] font-mono text-xs flex items-start gap-3 ${
            message.isError ? 'bg-[#4A050A] border border-[#E01B22] text-[#FF2A2A]' : 'bg-[#1FA971]/20 border border-[#1FA971] text-[#1FA971]'
          }`}>
            {message.isError ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <div>
              <p className="font-bold">{message.text}</p>
              {message.eventName && (
                <p className="text-[10px] text-[#A79798] mt-1">Verified on LOGIN 2K26 Academic Server</p>
              )}
            </div>
          </div>
        )}

        {/* Camera Scanner Box */}
        <div className="space-y-4">
          <div className="relative">
            <div id="qr-reader-view" className="w-full h-72 bg-black rounded-[2px] border-2 border-[#1FA971] overflow-hidden shadow-inner" />
            {loading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 text-xs font-mono text-[#1FA971]">
                <RefreshCw className="w-6 h-6 animate-spin text-[#1FA971]" />
                <span>VERIFYING ATTENDANCE...</span>
              </div>
            )}
          </div>

          <p className="text-[11px] font-mono text-[#A79798] text-center">
            Point your phone camera directly at the coordinator's venue QR Code.
          </p>

          {!isCameraActive && !loading && (
            <button
              onClick={startCamera}
              className="w-full py-3 bg-[#1FA971] hover:bg-[#27C487] text-[#0A0607] font-mono text-xs font-bold uppercase rounded-[2px] flex items-center justify-center gap-2 transition-colors"
            >
              <Camera className="w-4 h-4" /> RETRY CAMERA ACCESS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
