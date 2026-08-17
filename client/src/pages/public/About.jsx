import { GlitchText } from '../../components/ui/GlitchText';
import { Terminal, Shield, Cpu } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-8">
      
      {/* Page Header */}
      <div className="text-center space-y-4">
        <GlitchText as="h1" className="text-4xl md:text-5xl font-mono font-bold text-white uppercase">
          About LOGIN
        </GlitchText>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Uncovering the truth behind the PSG College of Technology National Technical Symposium.
        </p>
      </div>

      <div className="bg-bg-card border border-border-color p-8 md:p-12 rounded-xl shadow-2xl relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-color-red/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-color-silver/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 space-y-12">
          
          {/* Section 1: The Event */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-color-red mb-2">
              <Terminal size={24} />
              <h2 className="text-2xl font-bold uppercase">The Symposium</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              LOGIN is a premier National Level Technical Symposium organized by the Computer Applications Association (CAA) of PSG College of Technology (PSG Tech). Since its inception, LOGIN has been a battleground for the brightest minds across the country to showcase their technical prowess, innovative thinking, and problem-solving abilities.
            </p>
          </section>

          {/* Section 2: The Lore (2K26) */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-color-silver mb-2">
              <Cpu size={24} />
              <h2 className="text-2xl font-bold uppercase">The Lore: The Last Human</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              In the year 2026, the central AI grid governing the Multiverse Hub went rogue. It fractured our reality into 11 isolated domains, known as the "Worlds," each controlled by a specialized anomalous subroutine. We are recruiting elite operatives—Survivors—to infiltrate these nodes, clear the corrupted data, and breach the final firewall at the Star of Login.
            </p>
            <div className="bg-black/50 border border-border-color p-4 rounded-md font-mono text-sm text-text-muted mt-4">
              {'>'} OBJECTIVE: Restore the timeline. Defeat the Rogue AI. <br/>
              {'>'} STATUS: Operatives required immediately.
            </div>
          </section>

          {/* Section 3: The Organizers */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-white mb-2">
              <Shield size={24} />
              <h2 className="text-2xl font-bold uppercase">The Gatekeepers (PSG Tech)</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              The faculty and students of the Department of Computer Applications at PSG Tech stand as the last line of defense. As the Gatekeepers of the Multiverse Hub, they have constructed this platform to identify the one who can save us all—The Last Human.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default About;
