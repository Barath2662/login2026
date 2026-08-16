import { GlitchText } from '../../components/ui/GlitchText';
import { AlertCircle } from 'lucide-react';

const AdminTeams = () => {

  return (
    <div className="space-y-6">
      <div>
        <GlitchText as="h1" className="text-3xl font-mono font-bold uppercase tracking-widest text-white mb-2">
          Global <span className="text-color-silver">Squads</span>
        </GlitchText>
        <p className="text-text-secondary font-mono text-sm">
          System-wide directory of all formed operative teams.
        </p>
      </div>

      <div className="bg-bg-card border border-border-color rounded-sm shadow-xl p-12 flex flex-col items-center justify-center text-center">
        <AlertCircle size={48} className="text-color-silver mb-4 opacity-80" />
        <h2 className="text-xl font-bold text-white mb-2">Endpoint Not Supported</h2>
        <p className="text-text-muted max-w-md">
          The current backend API specification does not support a global view of all operative squads. Squad queries can only be performed by individual operatives for their own teams.
        </p>
      </div>
    </div>
  );
};

export default AdminTeams;
