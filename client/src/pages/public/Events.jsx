import { GlitchText } from '../../components/ui/GlitchText';
import { InvasionTimeline } from '../../components/ui/InvasionTimeline';
import { UnifiedDossierModal } from '../../components/ui/UnifiedDossierModal';
import { useSearchParams } from 'react-router-dom';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const worldParam = searchParams.get('world');

  return (
    <div className="bg-bg-primary min-h-screen text-white pt-24 pb-20">
      <section className="py-12 px-4 relative">
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-5 mix-blend-overlay pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <GlitchText as="h2" className="text-3xl md:text-5xl font-mono font-bold uppercase">
              The Multiverse Grid
            </GlitchText>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              11 isolated realities. Infinite anomalous permutations. Only one path to the core.
            </p>
          </div>

          <InvasionTimeline />
        </div>
      </section>

      {/* Modal for World Details */}
      <UnifiedDossierModal
        isOpen={!!worldParam}
        id={worldParam || undefined}
        onClose={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('world');
          setSearchParams(newParams);
        }}
      />
    </div>
  );
};

export default Events;
