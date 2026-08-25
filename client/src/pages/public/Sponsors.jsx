import React from 'react';
import { GlitchText } from '../../components/ui/GlitchText';

const Sponsors = () => {
  return (
    <div className="bg-bg-primary text-white min-h-[50vh] flex flex-col justify-center py-20 border-t border-border-color">
      <section className="relative w-full px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <GlitchText as="h2" className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#E5E5E5]">
            ALLIED <span className="text-color-red">FORCES</span>
          </GlitchText>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto font-mono">
            STRATEGIC PARTNERS AND SPONSORS
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-80">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 w-48 bg-bg-card border border-border-color rounded-sm flex items-center justify-center text-color-silver font-mono text-sm hover:opacity-100 hover:border-color-red hover:text-color-red transition-all cursor-default">
              SPONSOR_{i}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Sponsors;
