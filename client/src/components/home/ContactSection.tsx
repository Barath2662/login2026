import { Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact-section" className="py-20 px-4 bg-[#130C0E] text-center border-b border-[#2A1A1D]">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-3xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            CONNECT WITH US
          </h2>
          <p className="text-xs text-[#6B5A5C] font-mono">Reach out to the organizing committee</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-xs font-body">
          {/* Coordinates */}
          <div className="space-y-4 border border-[#2A1A1D] p-5 rounded-[2px] bg-[#0A0607]">
            <h4 className="font-mono font-bold text-[#E01B22] uppercase tracking-wider">OFFICE COORDINATES</h4>
            <div className="space-y-2.5 text-[#A79798]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E01B22] shrink-0" />
                <span>Computer Applications Association,<br />PSG College of Technology,<br />Peelamedu, Coimbatore - 641004</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 border border-[#2A1A1D] p-5 rounded-[2px] bg-[#0A0607]">
            <h4 className="font-mono font-bold text-[#E01B22] uppercase tracking-wider">SECURE CHANNELS</h4>
            <div className="space-y-2.5 text-[#A79798]">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[#F7F2F2] transition-colors">
                <FaInstagram className="w-4 h-4 text-[#E01B22]" />
                <span>@login2k26</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[#F7F2F2] transition-colors">
                <FaLinkedin className="w-4 h-4 text-[#E01B22]" />
                <span>Computer Applications Association</span>
              </a>
              <a href="mailto:info@login2k26.com" className="flex items-center gap-2.5 hover:text-[#F7F2F2] transition-colors">
                <Mail className="w-4 h-4 text-[#E01B22]" />
                <span>info@login2k26.com</span>
              </a>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="space-y-4 border border-[#2A1A1D] p-5 rounded-[2px] bg-[#0A0607]">
            <h4 className="font-mono font-bold text-[#E01B22] uppercase tracking-wider">ORGANIZING CONTACTS</h4>
            <div className="space-y-2.5 text-[#A79798] font-mono">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E01B22]" />
                <span>Nitheesh M K (Chairperson) - +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E01B22]" />
                <span>Secretary Office - +91 90123 45678</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
