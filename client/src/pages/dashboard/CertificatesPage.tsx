import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Award, Download, CheckCircle2, RefreshCw, Eye, Sparkles, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';

export const CertificatesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [previewEvent, setPreviewEvent] = useState<any | null>(null);

  // Fetch participant registrations
  const { data: regData, isLoading } = useQuery({
    queryKey: ['my-registrations-certs'],
    queryFn: async () => {
      const res = await api.registrations.getMyRegistrations();
      return res.data;
    },
  });

  const registrations = Array.isArray(regData) ? regData : [];

  // Certificate Generator Engine (HTML5 Canvas 1920x1080)
  const generateCertificateCanvas = (eventName: string, certId?: string): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // 1. Background Fill
    const bgGradient = ctx.createLinearGradient(0, 0, 1920, 1080);
    bgGradient.addColorStop(0, '#0A0607');
    bgGradient.addColorStop(0.5, '#180B0E');
    bgGradient.addColorStop(1, '#0A0607');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1920, 1080);

    // 2. Cyber Outer Border
    ctx.strokeStyle = '#E01B22';
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, 1920 - 80, 1080 - 80);

    // Gold Inner Border
    ctx.strokeStyle = '#E08A17';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, 1920 - 120, 1080 - 120);

    // Corner Accents
    const drawCorner = (x: number, y: number, mx: number, my: number) => {
      ctx.fillStyle = '#E01B22';
      ctx.fillRect(x, y, 30 * mx, 6 * my);
      ctx.fillRect(x, y, 6 * mx, 30 * my);
    };
    drawCorner(70, 70, 1, 1);
    drawCorner(1920 - 70, 70, -1, 1);
    drawCorner(70, 1080 - 70, 1, -1);
    drawCorner(1920 - 70, 1080 - 70, -1, -1);

    // 3. Header Texts
    ctx.textAlign = 'center';

    // Institution Name
    ctx.font = 'bold 28px monospace';
    ctx.fillStyle = '#A79798';
    ctx.fillText('PSG COLLEGE OF TECHNOLOGY • COIMBATORE - 641004', 1920 / 2, 140);

    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#E08A17';
    ctx.fillText('DEPARTMENT OF COMPUTER APPLICATIONS', 1920 / 2, 180);

    // Divider Line
    ctx.strokeStyle = '#3E2529';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 210);
    ctx.lineTo(1920 - 400, 210);
    ctx.stroke();

    // Main Title
    ctx.font = 'black 54px sans-serif';
    ctx.fillStyle = '#E01B22';
    ctx.fillText('LOGIN 2K26', 1920 / 2, 280);

    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#F7F2F2';
    ctx.fillText('NATIONAL LEVEL CYBER SYMPOSIUM', 1920 / 2, 320);

    // Certificate Type Badge
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#E08A17';
    ctx.fillText('CERTIFICATE OF PARTICIPATION', 1920 / 2, 410);

    // 4. Recipient Details
    ctx.font = '22px monospace';
    ctx.fillStyle = '#A79798';
    ctx.fillText('THIS IS PROUDLY PRESENTED TO', 1920 / 2, 480);

    // Participant Name (Large & Glowing)
    const recipientName = (user?.name || 'PARTICIPANT').toUpperCase();
    ctx.font = 'extrabold 52px sans-serif';
    ctx.fillStyle = '#F7F2F2';
    ctx.shadowColor = 'rgba(224, 27, 34, 0.6)';
    ctx.shadowBlur = 15;
    ctx.fillText(recipientName, 1920 / 2, 560);
    ctx.shadowBlur = 0; // Reset shadow

    // College & Institution
    const collegeName = (user?.college_name || 'PSG College of Technology').toUpperCase();
    ctx.font = '22px monospace';
    ctx.fillStyle = '#A79798';
    ctx.fillText(`FROM ${collegeName}`, 1920 / 2, 620);

    // Event Description
    ctx.font = '22px monospace';
    ctx.fillStyle = '#F7F2F2';
    ctx.fillText(`FOR SUCCESSFULLY PARTICIPATING IN THE EVENT`, 1920 / 2, 690);

    // Event Title (Highlight)
    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = '#E01B22';
    ctx.fillText(`"${eventName.toUpperCase()}"`, 1920 / 2, 760);

    ctx.font = '18px monospace';
    ctx.fillStyle = '#A79798';
    ctx.fillText('HELD DURING LOGIN 2K26 AT PSG COLLEGE OF TECHNOLOGY', 1920 / 2, 810);

    // 5. Footer & Verification Details
    ctx.textAlign = 'left';
    ctx.font = '14px monospace';
    ctx.fillStyle = '#6B5A5C';
    const serial = certId || `CERT-L2K26-${user?.id || 101}-${Math.floor(1000 + Math.random() * 9000)}`;
    ctx.fillText(`VERIFICATION HASH: ${serial}`, 100, 980);
    ctx.fillText(`ISSUED BY: LOGIN 2K26 ORGANIZING COMMITTEE`, 100, 1005);

    // Signatures
    ctx.textAlign = 'right';
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#F7F2F2';
    ctx.fillText('DR. V. MAHESH', 1920 - 100, 975);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#A79798';
    ctx.fillText('STAFF COORDINATOR', 1920 - 100, 1000);

    return canvas;
  };

  const handleDownload = (item: any) => {
    const eventName = item.event?.name || item.event_name || 'Cyber Event';
    const eventId = item.event_id || item.event?.id || 1;
    setDownloadingId(item.id || eventId);

    try {
      const canvas = generateCertificateCanvas(eventName, `CERT-L2K26-EVT${eventId}-U${user?.id}`);
      
      // Convert canvas to image and trigger download
      const imageURI = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `LOGIN2K26_Certificate_${eventName.replace(/\s+/g, '_')}.png`;
      link.href = imageURI;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E01B22', '#E08A17', '#1FA971', '#F7F2F2'],
      });
    } catch (err) {
      console.error('Certificate generation failed:', err);
      alert('Failed to generate certificate download.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadPDF = (item: any) => {
    const eventName = item.event?.name || item.event_name || 'Cyber Event';
    const eventId = item.event_id || item.event?.id || 1;
    setDownloadingId(item.id || eventId);

    try {
      const canvas = generateCertificateCanvas(eventName, `CERT-L2K26-EVT${eventId}-U${user?.id}`);
      const imageURI = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080],
      });
      pdf.addImage(imageURI, 'PNG', 0, 0, 1920, 1080);
      pdf.save(`LOGIN2K26_Certificate_${eventName.replace(/\s+/g, '_')}.pdf`);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E01B22', '#E08A17', '#1FA971', '#F7F2F2'],
      });
    } catch (err) {
      console.error('PDF Certificate generation failed:', err);
      alert('Failed to generate PDF download.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = (item: any) => {
    setPreviewEvent(item);
  };

  return (
    <div className="space-y-8 text-[#F7F2F2]">
      {/* Header */}
      <div className="border-b border-[#2A1A1D] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#E08A17] uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#E08A17]" /> OFFICIAL ACADEMIC CREDENTIALS
          </span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#F7F2F2] uppercase mt-1">
            MY E-CERTIFICATES
          </h1>
        </div>
        <div className="text-xs font-mono text-[#A79798] bg-[#130C0E] px-3 py-1.5 rounded-[2px] border border-[#2A1A1D]">
          PARTICIPANT: <span className="text-[#F7F2F2] font-bold">{user?.name}</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#1A0306] border border-[#E01B22] p-4 rounded-[2px] flex items-center gap-3 text-xs font-mono text-[#F7F2F2]">
        <Sparkles className="w-5 h-5 text-[#E08A17] shrink-0 animate-pulse" />
        <div>
          <span className="font-bold text-[#E08A17]">ONE-CLICK E-CERTIFICATE GENERATOR:</span> Official digitally verified certificates of participation are available in high-res PNG & PDF formats.
        </div>
      </div>

      {/* Certificates Grid */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#A79798] font-mono text-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-[#E01B22]" />
          <span>Fetching your certificates...</span>
        </div>
      ) : registrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((item: any, i: number) => {
            const eventName = item.event?.name || item.event_name || 'Event';
            const category = item.event?.category || 'CYBER ARENA';
            const isAttended = item.attendance_status === 'PRESENT' || item.attended || item.status === 'CONFIRMED';
            const isDownloading = downloadingId === (item.id || i);

            return (
              <div
                key={item.id || i}
                className="bg-[#130C0E] border border-[#2A1A1D] hover:border-[#3E2529] p-6 rounded-[2px] relative overflow-hidden flex flex-col justify-between group transition-all"
              >
                {/* Cyber Watermark Accent */}
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Award className="w-32 h-32 text-[#E01B22]" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#E08A17] bg-[#E08A17]/10 px-2 py-0.5 border border-[#E08A17]/30 rounded-sm">
                      {category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 ${
                      isAttended ? 'bg-[#1FA971]/20 text-[#1FA971] border border-[#1FA971]/40' : 'bg-[#E08A17]/20 text-[#E08A17] border border-[#E08A17]/40'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" /> {isAttended ? 'VERIFIED ATTENDANCE' : 'REGISTERED'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-bold text-[#F7F2F2] uppercase group-hover:text-[#E01B22] transition-colors">
                      {eventName}
                    </h3>
                    <p className="text-xs font-mono text-[#A79798] mt-1">
                      LOGIN 2K26 National Cyber Symposium • PSG College of Technology
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-6 border-t border-[#2A1A1D] flex flex-wrap items-center gap-2 relative z-10">
                  <button
                    onClick={() => handleDownloadPDF(item)}
                    disabled={isDownloading}
                    className="flex-1 py-2.5 bg-[#E01B22] hover:bg-[#FF2A2A] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 min-w-[140px]"
                  >
                    {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    <span>{isDownloading ? 'GENERATING...' : 'DOWNLOAD PDF'}</span>
                  </button>

                  <button
                    onClick={() => handleDownload(item)}
                    disabled={isDownloading}
                    className="py-2.5 px-3 bg-[#1A1114] border border-[#2A1A1D] hover:border-[#E01B22] text-[#F7F2F2] font-mono text-xs font-bold uppercase rounded-[2px] transition-colors flex items-center justify-center gap-1.5"
                    title="Download PNG Image"
                  >
                    <Download className="w-4 h-4 text-[#E08A17]" /> PNG
                  </button>

                  <button
                    onClick={() => handlePreview(item)}
                    className="p-2.5 bg-[#0A0607] border border-[#2A1A1D] hover:border-[#F7F2F2] text-[#A79798] hover:text-[#F7F2F2] rounded-[2px] transition-colors"
                    title="Preview Certificate"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] p-8">
          <Award className="w-12 h-12 text-[#6B5A5C] mx-auto" />
          <h3 className="text-base font-display font-bold text-[#F7F2F2]">NO EVENT REGISTRATIONS FOUND</h3>
          <p className="text-xs font-mono text-[#A79798] max-w-md mx-auto">
            Register and participate in LOGIN 2K26 symposium events to earn official verified digital certificates.
          </p>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#130C0E] border border-[#2A1A1D] max-w-3xl w-full p-6 rounded-[2px] space-y-4 relative animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#2A1A1D] pb-3">
              <h3 className="font-display font-bold text-lg text-[#F7F2F2]">E-CERTIFICATE PREVIEW</h3>
              <button
                onClick={() => setPreviewEvent(null)}
                className="text-xs font-mono text-[#A79798] hover:text-white px-2 py-1 bg-[#1A1114] border border-[#2A1A1D]"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Certificate Preview Card Frame */}
            <div className="bg-[#0A0607] border-4 border-[#E01B22] p-8 rounded-[2px] text-center space-y-4 relative overflow-hidden">
              <div className="border border-[#E08A17] p-6 space-y-3">
                <span className="text-[10px] font-mono text-[#A79798] block">PSG COLLEGE OF TECHNOLOGY • DEPT OF CA</span>
                <h2 className="text-2xl font-display font-bold text-[#E01B22]">LOGIN 2K26</h2>
                <span className="text-xs font-mono text-[#E08A17] block font-bold">CERTIFICATE OF PARTICIPATION</span>
                <p className="text-xs font-mono text-[#A79798] pt-2">This certifies that</p>
                <p className="text-xl font-display font-bold text-[#F7F2F2] uppercase">{user?.name}</p>
                <p className="text-xs font-mono text-[#A79798]">from {user?.college_name || 'PSG College of Technology'}</p>
                <p className="text-xs font-mono text-[#F7F2F2] pt-2">has participated in</p>
                <p className="text-lg font-display font-bold text-[#E01B22]">{previewEvent.event?.name || previewEvent.event_name}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleDownload(previewEvent)}
                className="px-6 py-2.5 bg-[#E01B22] text-white font-mono text-xs font-bold uppercase rounded-[2px] flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> DOWNLOAD HIGH-RES PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
