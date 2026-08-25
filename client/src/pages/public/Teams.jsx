import React from 'react';
import { GlitchText } from '../../components/ui/GlitchText';

const Teams = () => {
  return (
    <div className="bg-bg-primary text-white min-h-[50vh] flex flex-col justify-center py-20 border-t border-border-color">
      <section className="relative w-full px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <GlitchText as="h2" className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#E5E5E5]">
            CORE <span className="text-color-red">COMMAND</span>
          </GlitchText>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto font-mono">
            THE ARCHITECTS BEHIND THE MULTIVERSE
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-bg-card border border-border-color p-6 flex flex-col items-center text-center rounded-sm hover:border-color-red transition-colors shadow-lg shadow-black/50">
              <div className="w-24 h-24 rounded-full bg-bg-secondary mb-4 border-2 border-color-red flex items-center justify-center text-color-red font-mono text-xl">
                0{i}
              </div>
              <h3 className="text-xl font-bold text-white mb-1 uppercase">COMMANDER {i}</h3>
              <p className="text-xs text-color-silver font-mono">SYSTEM ARCHITECT</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Teams;
