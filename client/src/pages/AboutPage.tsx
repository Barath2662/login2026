import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0C] py-12 px-4 sm:px-6 lg:px-8 text-[#F2F2F4]">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-mono text-[#E01B24] font-bold tracking-widest uppercase">ABOUT THE SYMPOSIUM</span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-wider">
            LOGIN <span className="text-[#E01B24]">2026</span>
          </h1>
          <p className="text-sm text-[#9A9AA2] font-mono">
            35TH EDITION • 18 & 19 SEPTEMBER 2026 • PSG COLLEGE OF TECHNOLOGY
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-[#141418] border border-[#2A1416] p-8 rounded-2xl space-y-6 shadow-2xl">
          <h2 className="text-xl font-display font-bold text-[#E01B24]">A LEGACY OF 35 YEARS</h2>
          <p className="text-xs sm:text-sm text-[#9A9AA2] font-body leading-relaxed">
            LOGIN is the flagship national-level technical symposium organized annually by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore.
          </p>
          <p className="text-xs sm:text-sm text-[#9A9AA2] font-body leading-relaxed">
            Over the past three and a half decades, LOGIN has served as a premier battleground for students across India, fostering innovation, analytical brilliance, and competitive coding spirit. The 2026 edition introduces the theme <strong className="text-[#F2F2F4]">"THE LAST HUMAN"</strong> — a testament to endurance, skill, and mastery.
          </p>
        </div>

        {/* Association & College Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#141418] border border-[#2A1416] p-6 rounded-2xl space-y-3">
            <h3 className="font-display font-bold text-sm text-[#F2F2F4]">PSG COLLEGE OF TECHNOLOGY</h3>
            <p className="text-xs text-[#9A9AA2] leading-relaxed">
              An autonomous, government-aided institution affiliated with Anna University. Founded in 1951, PSG Tech stands as one of India's premier engineering institutions.
            </p>
          </div>

          <div className="bg-[#141418] border border-[#2A1416] p-6 rounded-2xl space-y-3">
            <h3 className="font-display font-bold text-sm text-[#F2F2F4]">COMPUTER APPLICATIONS ASSOCIATION</h3>
            <p className="text-xs text-[#9A9AA2] leading-relaxed">
              Driven by the students and faculty of the Department of Computer Applications, CAA organizes workshops, hackathons, and technical symposiums.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
