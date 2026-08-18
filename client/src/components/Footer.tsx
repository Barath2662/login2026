import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const handleReplay = () => {
    sessionStorage.removeItem('hasPlayedIntro');
    if (onReplayIntro) {
      onReplayIntro();
    } else {
      window.location.reload();
    }
  };

  return (
    <footer className="bg-[#0A0A0C] border-t border-[#2A1416] text-[#9A9AA2] pt-16 pb-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2A1416]">
          
          {/* Column 1: Brand & Theme */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.svg" alt="LOGIN 2026 Logo" className="h-9 w-auto" />
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#F2F2F4] tracking-wider">LOGIN 2026</h3>
                <p className="text-[10px] font-mono text-[#E01B24] font-bold">THE LAST HUMAN</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#9A9AA2]">
              The 35th Edition National Level Technical Symposium organized by the Computer Applications Association, PSG College of Technology.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReplay}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#FF3B30] hover:text-[#F2F2F4] border border-[#2A1416] hover:border-[#FF3B30] px-3 py-1.5 rounded-lg transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Replay Intro Video
              </button>
            </div>
          </div>

          {/* Column 2: Event Details */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#F2F2F4] uppercase tracking-wider">Symposium Info</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B24]" />
                <strong className="text-[#F2F2F4]">Dates:</strong> 18 & 19 September 2026
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B24]" />
                <strong className="text-[#F2F2F4]">Venue:</strong> PSG College of Technology
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B24]" />
                <strong className="text-[#F2F2F4]">Organizer:</strong> Dept. of Computer Applications
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#F2F2F4] uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events" className="hover:text-[#E01B24] transition-colors">All 11 Events</Link>
              </li>
              <li>
                <Link to="/timeline" className="hover:text-[#E01B24] transition-colors">Symposium Timeline</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#E01B24] transition-colors">Participant Dashboard</Link>
              </li>
              <li>
                <a
                  href="https://events.psginstitutions.in/EMS/register/E5294158179"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E01B24] transition-colors inline-flex items-center gap-1 text-[#E8A317]"
                >
                  PSG Payment Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#F2F2F4] uppercase tracking-wider">Contact & Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E01B24] shrink-0 mt-0.5" />
                <span>Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E01B24] shrink-0" />
                <a href="mailto:login2026@psgtech.ac.in" className="hover:text-[#F2F2F4]">login2026@psgtech.ac.in</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E01B24] shrink-0" />
                <span>+91 98765 43210 / +91 94432 10987</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9A9AA2]">
          <p>© 2026 Computer Applications Association. All rights reserved.</p>
          <p className="text-[#FF3B30]">LOGIN 2026 &bull; THE LAST HUMAN</p>
        </div>

      </div>
    </footer>
  );
};
