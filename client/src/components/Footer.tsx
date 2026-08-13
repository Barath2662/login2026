import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { Settings } from 'lucide-react';

export const Footer = () => {
  const { reduceMotion, toggleReduceMotion } = useThemeStore();

  return (
    <footer className="bg-bg-secondary border-t border-border-color py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand/Credits */}
          <div className="col-span-1 md:col-span-2">
            <span className="font-mono font-bold text-2xl tracking-tighter text-white mb-4 block">
              LOGIN<span className="text-color-red">2K26</span>
            </span>
            <p className="text-text-secondary mb-4 max-w-sm">
              The Last Human. A cinematic technical symposium by PSG College of Technology. Survive the invasion, clear the Worlds, reach the Star of Login.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-text-secondary hover:text-color-red transition-colors">About</Link></li>
              <li><Link to="/worlds" className="text-text-secondary hover:text-color-red transition-colors">The Worlds</Link></li>
              <li><Link to="/legacy" className="text-text-secondary hover:text-color-red transition-colors">Legacy</Link></li>
              <li><Link to="/contact" className="text-text-secondary hover:text-color-red transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal / Settings */}
          <div>
            <h3 className="font-semibold text-white mb-4">System Settings</h3>
            <div className="space-y-4">
              <button 
                onClick={toggleReduceMotion}
                className="flex items-center space-x-2 text-text-secondary hover:text-white transition-colors group"
              >
                <Settings size={16} className={`group-hover:rotate-90 transition-transform ${reduceMotion ? 'text-color-red' : ''}`} />
                <span>Reduce Motion: {reduceMotion ? <span className="text-color-red font-semibold">ON</span> : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
          <p>© 2026 PSG College of Technology. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
