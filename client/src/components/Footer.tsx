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
    <footer className="bg-[#0A0607] border-t border-[#2A1A1D] text-[#A79798] pt-14 sm:pt-16 pb-10 sm:pb-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-[#2A1A1D]">
          
          {/* Column 1: Brand & Theme */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/assets/login.png"
                alt="LOGIN 2026 Logo"
                className="h-10 w-10 object-contain animate-float-slow drop-shadow-[0_0_10px_rgba(224,27,34,0.3)]"
              />
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#F7F2F2] tracking-wider">LOGIN 2026</h3>
                <p className="text-[10px] font-mono text-[#E01B22] font-bold tracking-wider">THE LAST HUMAN</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#6B5A5C]">
              The 35th Edition National Level Technical Symposium organized by the Computer Applications Association, PSG College of Technology.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReplay}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#E01B22] hover:text-[#FF2A2A] border border-[#2A1A1D] hover:border-[#E01B22]/50 px-3 py-1.5 rounded-[2px] transition-all hover:bg-[#E01B22]/5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Replay Intro
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
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events" className="link-underline hover:text-[#E01B22] transition-colors">All 11 Events</Link>
              </li>
              <li>
                <Link to="/timeline" className="link-underline hover:text-[#E01B22] transition-colors">Symposium Timeline</Link>
              </li>
              <li>
                <Link to="/dashboard" className="link-underline hover:text-[#E01B22] transition-colors">Participant Dashboard</Link>
              </li>
              <li>
                <a
                  href="https://events.psginstitutions.in/EMS/register/E5294158179"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-[#E01B22] transition-colors inline-flex items-center gap-1 text-[#E08A17]"
                >
                  PSG Payment Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-[#F7F2F2] uppercase tracking-wider">Contact & Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E01B22] shrink-0 mt-0.5" />
                <span>Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E01B22] shrink-0" />
                <a href="mailto:login@psgtech.ac.in" className="hover:text-[#F7F2F2] transition-colors font-mono">login@psgtech.ac.in</a>
              </li>
              <li className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#E01B22] shrink-0" />
                  <span className="font-mono text-[#F7F2F2]">Secretary: Barathvikraman S K</span>
                </div>
                <a href="tel:8148251567" className="pl-6 font-mono text-[#A79798] hover:text-[#E01B22] transition-colors">+91 81482 51567</a>
              </li>
              <li className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#E01B22] shrink-0" />
                  <span className="font-mono text-[#F7F2F2]">Treasurer: Swarna Rathna A</span>
                </div>
                <a href="tel:9952873426" className="pl-6 font-mono text-[#A79798] hover:text-[#E01B22] transition-colors">+91 99528 73426</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#6B5A5C]">
          <p>© 2026 Computer Applications Association - PSG College of Technology. All rights reserved.</p>
          <p className="text-[#E01B22] font-bold tracking-wider">LOGIN 2026 &bull; THE LAST HUMAN</p>
        </div>

      </div>
    </footer>
  );
};
