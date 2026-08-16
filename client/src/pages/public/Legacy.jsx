import { LegacyGallery } from '../../components/ui/LegacyGallery';
import { GlitchText } from '../../components/ui/GlitchText';

const Legacy = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-8 px-4">
      
      {/* Page Header */}
      <div className="text-center space-y-4">
        <GlitchText as="h1" className="text-4xl md:text-5xl font-mono font-bold text-white uppercase">
          Hall of Survivors
        </GlitchText>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Archives of the operatives who conquered previous anomalies in the Multiverse.
        </p>
      </div>

      <div className="bg-bg-card border border-border-color p-4 md:p-8 rounded-xl shadow-2xl">
        <LegacyGallery />
      </div>
      
    </div>
  );
};

export default Legacy;
