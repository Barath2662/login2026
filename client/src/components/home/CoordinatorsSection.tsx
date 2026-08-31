import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface CoordinatorsSectionProps {
  isHomePage?: boolean;
}

export const CoordinatorsSection: React.FC<CoordinatorsSectionProps> = ({ isHomePage = false }) => {
  const websiteTeam = [
    { name: 'NITHEESH MUTHU KRISHNAN C', url: 'https://www.linkedin.com/in/nitheeshmk5/' },
    { name: 'CHINNAYA K', url: 'https://www.linkedin.com/search/results/all/?keywords=CHINNAYA%20K' },
    { name: 'TAMILINI S', url: 'https://www.linkedin.com/search/results/all/?keywords=TAMILINI%20S' },
    { name: 'BARATHVIKRAMAN S K', url: 'https://www.linkedin.com/search/results/all/?keywords=BARATHVIKRAMAN%20S%20K' },
    { name: 'SABARISH', url: 'https://www.linkedin.com/search/results/all/?keywords=SABARISH' },
    { name: 'KARTHEESVARAN', url: 'https://www.linkedin.com/search/results/all/?keywords=KARTHEESVARAN' }
  ];

  const allGroups = [
    {
      title: 'CORE LEADERSHIP',
      items: [
        { role: 'TREASURER', name: 'SWARNA RATHNA A' },
        { role: 'SECRETARY', name: 'BARATHVIKRAMAN S K', highlight: true },
        { role: 'PLACEMENT REPRESENTATIVE', name: 'TINO BRITTY J' }
      ]
    },
    {
      title: 'EXECUTIVE COORDINATORS',
      items: [
        { role: 'EXECUTIVE COORDINATOR', name: 'STEPHINA SMILY C' },
        { role: 'EXECUTIVE COORDINATOR', name: 'ARAVINDH KANNAN M S' },
        { role: 'EXECUTIVE COORDINATOR', name: 'MUGUNDHAN K P' }
      ]
    },
    {
      title: 'DEPARTMENT COORDINATORS',
      items: [
        { role: 'ALUMNI COORDINATOR', name: 'SAKTHIVEL MALLAIAH R G A' },
        { role: 'TECHNICAL COORDINATOR', name: 'TAMILINI S' },
        { role: 'PUBLIC RELATION', name: 'GAYATHRI S' },
        { role: 'STUDENT DEVELOPMENT', name: 'DEEPIKAA B S' }
      ]
    },
    {
      title: 'EXECUTIVE MEMBERS',
      items: [
        { role: 'EXECUTIVE MEMBER', name: 'NITHEESH MUTHU KRISHNAN C' },
        { role: 'EXECUTIVE MEMBER', name: 'SURIYA G V' },
        { role: 'EXECUTIVE MEMBER', name: 'DIVYADHARSHINI K' }
      ]
    },
    {
      title: 'FACULTY COORDINATORS',
      items: [
        { role: 'FACULTY COORDINATOR', name: 'MR. SUNDAR C' },
        { role: 'FACULTY COORDINATOR', name: 'MS A MANORANJITHAM' }
      ]
    },
    {
      title: 'VERTICAL COORDINATORS',
      items: [
        { role: 'VERTICAL COORDINATOR', name: 'SAMPLE NAME 1' },
        { role: 'VERTICAL COORDINATOR', name: 'SAMPLE NAME 2' }
      ]
    },
    {
      title: 'EVENTS COORDINATORS',
      items: [
        { role: 'EVENT COORDINATOR', name: 'SAMPLE NAME 3' },
        { role: 'EVENT COORDINATOR', name: 'SAMPLE NAME 4' }
      ]
    },
    {
      title: 'VOLUNTEERS LIST',
      items: [
        { role: 'VOLUNTEER', name: 'SAMPLE NAME 5' },
        { role: 'VOLUNTEER', name: 'SAMPLE NAME 6' },
        { role: 'VOLUNTEER', name: 'SAMPLE NAME 7' }
      ]
    }
  ];

  const displayGroups = isHomePage
    ? allGroups.filter(
        (g) =>
          g.title !== 'VERTICAL COORDINATORS' &&
          g.title !== 'EVENTS COORDINATORS' &&
          g.title !== 'VOLUNTEERS LIST'
      )
    : allGroups;

  return (
    <section id="coordinators-section" className="py-20 px-4 sm:px-6 bg-[#130C0E] border-b border-[#2A1A1D] relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0607_1px,transparent_1px),linear-gradient(to_bottom,#0a0607_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25 pointer-events-none" />

      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(224,27,34,0.08)_0%,_transparent_75%)] pointer-events-none filter blur-3xl z-0" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-2 select-none">
          <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block uppercase">
            ✦ LEADERSHIP PROFILE
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            DEPARTMENT COORDINATORS
          </h2>
          <p className="text-xs sm:text-sm text-[#A79798] font-mono tracking-wider max-w-lg mx-auto">
            The organizing core behind the 35th grand edition of LOGIN.
          </p>
        </div>

        {isHomePage && (
          <div className="relative max-w-5xl mx-auto w-full overflow-hidden bg-[#0A0607]/80 border border-[#2A1A1D] rounded-[2px] shadow-2xl group">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E01B22]/50 z-20 transition-all duration-500 group-hover:border-[#E01B22]" />

            <div className="absolute top-4 left-4 text-[9px] font-mono text-[#E01B22]/80 z-20 flex flex-col space-y-1">
              <span>SYS // TEAM_UNIT_05</span>
              <span>DEPT: MCA</span>
            </div>
            <div className="absolute top-4 right-4 text-[9px] font-mono text-[#E01B22]/80 z-20 text-right">
              <span>STATUS: ACTIVE</span>
            </div>

            <img
              src="/coords.webp"
              alt="Department Coordinators"
              className="w-full max-h-[500px] object-cover object-top relative z-10 filter contrast-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/coords_bold.webp';
              }}
            />
          </div>
        )}

        {/* Single compact leadership panel */}
        <div className="max-w-5xl mx-auto pb-10">
          <div className="border border-[#2A1A1D] bg-[#0A0607]/85 rounded-[2px] p-4 sm:p-5 shadow-[0_0_25px_rgba(224,27,34,0.08)]">
            <div className="space-y-4">
              {displayGroups.map((group) => (
                <div key={group.title} className="rounded-[2px] border border-[#1F1415] bg-[#0A0607]/60 p-3">
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E01B22]" />
                    <span className="font-mono text-[9px] text-[#A79798] tracking-[0.22em] uppercase font-bold">
                      {group.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.items.map((item) => (
                      <div
                        key={`${group.title}-${item.name}`}
                        className={`border p-3 transition-all duration-200 min-h-[74px] flex items-center gap-4 text-left ${
                          item.highlight
                            ? 'border-[#E01B22] bg-[#1A080A]/90 shadow-[0_0_18px_rgba(224,27,34,0.18)]'
                            : 'border-[#2A1A1D] bg-[#0A0607]/90 hover:border-[#E01B22]/60'
                        } rounded-[2px]`}
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=1A080A`}
                            alt={item.name}
                            className="w-10 h-10 rounded-full border border-[#E01B22]/40 bg-[#12090A] p-0.5 object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-mono text-[8px] text-[#E01B22] font-bold tracking-[0.18em] uppercase mb-1">
                            {item.role}
                          </p>
                          <h3 className="font-display font-black text-[11px] sm:text-[12px] text-[#F7F2F2] tracking-wide uppercase leading-snug">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pb-10">
          <div className="border border-[#2A1A1D] bg-[#0A0607]/85 rounded-[2px] p-4 sm:p-5 shadow-[0_0_25px_rgba(224,27,34,0.08)]">
            <div className="mb-4 flex items-center justify-center gap-2 text-center">
              <ShieldCheck className="w-4 h-4 text-[#E01B22]" />
              <span className="font-mono text-[10px] text-[#A79798] tracking-[0.25em] uppercase font-bold">
                WEBSITE TEAM
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {websiteTeam.map((member) => (
                <div key={member.name} className="border border-[#2A1A1D] bg-[#0A0607]/90 rounded-[2px] p-3 flex items-center gap-4 text-left min-h-[74px] hover:border-[#E01B22]/60 transition-colors">
                  <div className="flex-shrink-0">
                    <img
                      src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=1A080A`}
                      alt={member.name}
                      className="w-10 h-10 rounded-full border border-[#E01B22]/40 bg-[#12090A] p-0.5 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center w-full">
                    <p className="font-mono text-[8px] text-[#E01B22] font-bold tracking-[0.18em] uppercase mb-1">DEVELOPER</p>
                    <h3 className="font-display font-black text-[11px] sm:text-[12px] text-[#F7F2F2] tracking-wide uppercase leading-snug">
                      {member.name}
                    </h3>
                    <a
                      href={member.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center justify-center gap-1.5 self-start rounded-[2px] border border-[#E01B22]/40 bg-[#1A080A]/80 px-2 py-0.5 text-[8px] font-mono text-[#E01B22] uppercase tracking-[0.18em] transition hover:border-[#E01B22] hover:bg-[#230A0C]"
                    >
                      <span className="flex h-3 w-3 items-center justify-center rounded-sm bg-[#E01B22] text-[7px] font-black text-[#12090A] leading-none">
                        in
                      </span>
                      LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoordinatorsSection;
