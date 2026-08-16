import { Link } from 'react-router-dom';
import { GlitchText } from '../components/ui/GlitchText';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
      
      <div className="relative mb-8">
        <GlitchText as="h1" className="text-8xl md:text-[10rem] font-mono font-bold text-color-danger">
          404
        </GlitchText>
        <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white uppercase mb-4">
        Sector Not Found
      </h2>
      
      <p className="text-text-secondary max-w-md mx-auto mb-8 font-mono text-sm">
        {'>'} ERR_CONNECTION_REFUSED <br/>
        {'>'} The node you are attempting to access has been corrupted or does not exist in this reality fragment.
      </p>

      <Link to="/">
        <Button variant="primary">
          Return to Base Command
        </Button>
      </Link>
      
    </div>
  );
};
