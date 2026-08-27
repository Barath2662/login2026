import React from 'react';
import { CoordinatorsSection } from '../components/home/CoordinatorsSection';
import { GraduationCap, Award, ShieldAlert } from 'lucide-react';

interface AdvisorCardProps {
  name: string;
  role: string;
  designation: string;
  node: string;
}

const AdvisorCard: React.FC<AdvisorCardProps> = ({ name, role, designation, node }) => {
  return (
    <div className="border border-[#2A1A1D] bg-[#130C0E]/40 p-5 rounded-[2px] relative overflow-hidden group hover:border-[#E01B22]/40 transition-colors">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E01B22]/30 group-hover:border-[#E01B22] transition-all" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E01B22]/30 group-hover:border-[#E01B22] transition-all" />
      
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-[2px] border border-[#2A1A1D] bg-[#0A0607]/80 flex items-center justify-center text-[#A79798] group-hover:border-[#E01B22]/30 group-hover:text-[#E01B22] transition-colors shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-mono text-[#E01B22] font-black uppercase tracking-wider block">
            {node}
          </span>
          <h4 className="font-display font-black text-sm text-[#F7F2F2] uppercase tracking-wide">
            {name}
          </h4>
          <p className="text-[10px] font-mono text-[#A79798] uppercase tracking-wide">
            {role}
          </p>
          <p className="text-[10px] font-mono text-[#6B5A5C] tracking-wide pt-1">
            {designation}
          </p>
        </div>
      </div>
    </div>
  );
};

export const CoordinatorsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0607] pt-24 pb-16 relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      {/* Render student coordinators section directly */}
      <CoordinatorsSection />

      {/* Faculty Advisor Section */}
      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-12 relative z-10">
        
        {/* Section divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2A1A1D]" />
          </div>
          <span className="relative px-4 bg-[#0A0607] font-mono text-[9px] text-[#6B5A5C] tracking-[0.3em] uppercase">
            // ADVISORY NETWORKS NODES
          </span>
        </div>

        {/* Section Header */}
        <div className="text-center space-y-2 select-none">
          <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block">
            ✦ ACADEMIC ADVISORY
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            FACULTY MANAGEMENT NODES
          </h3>
        </div>

        {/* Advisors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdvisorCard 
            name="Dr. G. R. Karpagam"
            role="Head of Department"
            designation="Dept. of Computer Applications"
            node="NODE // HOD"
          />
          <AdvisorCard 
            name="Dr. J. Jasmine"
            role="Faculty Advisor"
            designation="Computer Applications Association"
            node="NODE // ADV_01"
          />
          <AdvisorCard 
            name="Dr. A. B. Ramesh"
            role="Co-Faculty Advisor"
            designation="Computer Applications Association"
            node="NODE // ADV_02"
          />
        </div>

      </div>

    </div>
  );
};

export default CoordinatorsPage;
