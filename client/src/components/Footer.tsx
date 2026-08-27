import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Mail, Phone, MapPin } from 'lucide-react';

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
    <footer className="bg-[#0A0607] border-t border-[#2A1A1D] text-[#A79798] pt-14 sm:pt-16 pb-10 sm:pb-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-[#2A1A1D]">
          
          {/* Column 1: Brand & Theme */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src="/assets/login.png"
                alt="LOGIN 2026 Logo"
                className="h-14 w-14 object-contain animate-float-slow drop-shadow-[0_0_15px_rgba(224,27,34,0.4)]"
              />
              <div>
                <h3 className="font-display font-extrabold text-xl text-[#F7F2F2] tracking-wider">LOGIN 2026</h3>
                <p className="text-[10px] font-mono text-[#E01B22] font-bold tracking-wider uppercase">THE LAST HUMAN</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#A79798]">
              The 35th Edition National Level Technical Symposium organized by the Computer Applications Association, PSG College of Technology.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReplay}
                className="group relative inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider text-[#E01B22] hover:text-[#FF2A2A] border border-[#E01B22]/30 hover:border-[#E01B22] px-4 py-2.5 rounded-[2px] transition-all duration-300 bg-[#E01B22]/5 overflow-hidden shadow-[0_0_10px_rgba(224,27,34,0.02)] hover:shadow-[0_0_20px_rgba(224,27,34,0.15)]"
              >
                <Play className="w-3 h-3 fill-current transition-transform duration-300 group-hover:translate-x-0.5" />
                REPLAY OPENING SEQUENCE
              </button>
            </div>
          </div>

          {/* Column 2: Event Details */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#F7F2F2] uppercase tracking-wider">Symposium Info</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22] shrink-0" />
                <strong className="text-[#F7F2F2]">Dates:</strong> 18 & 19 September 2026
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22] shrink-0" />
                <strong className="text-[#F7F2F2]">Venue:</strong> PSG College of Technology
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E01B22] shrink-0" />
                <strong className="text-[#F7F2F2]">Organizer:</strong> Dept. of Computer Applications
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#F7F2F2] uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link to="/events" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>All 11 Events</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>Symposium Timeline</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="group flex items-center justify-between hover:text-[#E01B22] transition-colors py-0.5">
                  <span>Participant Portal</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E01B22]">&rarr;</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://events.psginstitutions.in/EMS/register/E5294158179"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between hover:text-[#E08A17] transition-colors py-0.5 text-[#E08A17]"
                >
                  <span>Payment Portal</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#E08A17]">&nearr;</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold text-[#F7F2F2] uppercase tracking-wider">Contact & Support</h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2 text-[#A79798]">
                <MapPin className="w-4 h-4 text-[#E01B22] shrink-0 mt-0.5" />
                <span>Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E01B22] shrink-0" />
                <a href="mailto:login@psgtech.ac.in" className="hover:text-[#F7F2F2] transition-colors font-mono">login@psgtech.ac.in</a>
              </li>
              <li className="space-y-1 pt-1 border-t border-[#2A1A1D]/60">
                <span className="text-[10px] font-mono font-bold text-[#E01B22] uppercase tracking-wider block">SECRETARY</span>
                <span className="text-[#F7F2F2] font-semibold text-xs block">Barathvikraman S K</span>
                <a href="tel:8148251567" className="inline-flex items-center gap-1.5 text-xs text-[#A79798] hover:text-[#E01B22] transition-colors font-mono">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#E01B22]" />
                  +91 81482 51567
                </a>
              </li>
              <li className="space-y-1 pt-2 border-t border-[#2A1A1D]/60">
                <span className="text-[10px] font-mono font-bold text-[#E01B22] uppercase tracking-wider block">TREASURER</span>
                <span className="text-[#F7F2F2] font-semibold text-xs block">Swarna Rathna A</span>
                <a href="tel:9952873426" className="inline-flex items-center gap-1.5 text-xs text-[#A79798] hover:text-[#E01B22] transition-colors font-mono">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#E01B22]" />
                  +91 99528 73426
                </a>
              </li>
              <li className="pt-3 border-t border-[#2A1A1D]">
                <span className="text-[10px] font-mono font-bold text-[#6B5A5C] uppercase tracking-wider block mb-1.5">SECURE NETWORKS</span>
                <div className="flex items-center gap-2.5 text-[11px] font-mono">
                  <a href="https://instagram.com/login2k26" target="_blank" rel="noopener noreferrer" className="text-[#A79798] hover:text-[#E01B22] transition-colors">
                    Instagram
                  </a>
                  <span className="text-[#2A1A1D]">&middot;</span>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#A79798] hover:text-[#E01B22] transition-colors">
                    LinkedIn
                  </a>
                  <span className="text-[#2A1A1D]">&middot;</span>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-[#A79798] hover:text-[#E01B22] transition-colors">
                    YouTube
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Final Dystopian Message */}
        <div className="pt-8 pb-4 text-center select-none border-b border-[#2A1A1D]/40">
          <p className="text-[10px] sm:text-xs font-mono text-[#4A383A] font-extrabold tracking-[0.4em] uppercase">
            ONE LAST HUMAN. ELEVEN ARENAS.
          </p>
        </div>

        {/* Bottom Rights */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#6B5A5C]">
          <p>© 2026 Computer Applications Association - PSG College of Technology. All rights reserved.</p>
          <p className="text-[#E01B22] font-bold tracking-wider">LOGIN 2026 &bull; THE LAST HUMAN</p>
        </div>

      </div>
    </footer>
  );
};;
