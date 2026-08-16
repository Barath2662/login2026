import { LegacyGallery } from '../components/ui/LegacyGallery';
import { GlitchText } from '../components/ui/GlitchText';

export const LegacyPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-hidden">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <GlitchText as="h1" className="text-4xl md:text-5xl font-mono font-bold text-white uppercase">
          Legacy Data
        </GlitchText>
        <p className="text-text-secondary">
          Accessing archived records from previous iterations of the LOGIN symposium.
        </p>
      </div>

      {/* 3D Coverflow Gallery */}
      <LegacyGallery />

    </div>
  );
};
