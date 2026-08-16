import { GlitchText } from '../../components/ui/GlitchText';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-8 px-4">
      
      {/* Page Header */}
      <div className="text-center space-y-4">
        <GlitchText as="h1" className="text-4xl md:text-5xl font-mono font-bold text-white uppercase">
          Comms Uplink
        </GlitchText>
        <p className="text-text-secondary max-w-xl mx-auto">
          Establish a secure connection with the Gatekeepers at Base Command.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Form */}
        <div className="bg-bg-card border border-border-color p-8 rounded-xl shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-color-red/5 to-transparent rounded-xl pointer-events-none" />
          <h2 className="text-xl font-bold text-white mb-6 uppercase relative z-10">Send Transmission</h2>
          
          <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <Input label="Operative Name" placeholder="Your Name" />
            <Input label="Frequency (Email)" type="email" placeholder="you@network.com" />
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Message Payload</label>
              <textarea 
                className="w-full h-32 rounded-sm border border-border-color bg-bg-primary px-3 py-2 text-sm text-white focus:outline-none focus:border-color-red resize-none"
                placeholder="Enter your message..."
              />
            </div>
            <Button type="submit" className="w-full">
              Transmit
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-black/50 border border-border-color p-8 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-6 uppercase">Base Command Coordinates</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-color-red/10 p-3 rounded-full text-color-red shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Physical Location</h3>
                  <p className="text-text-secondary text-sm">
                    PSG College of Technology<br/>
                    Peelamedu<br/>
                    Coimbatore, Tamil Nadu - 641004
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-color-silver/10 p-3 rounded-full text-color-silver shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Secure Channel</h3>
                  <p className="text-text-secondary text-sm hover:text-color-silver transition-colors cursor-pointer">
                    info@login2k26.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-color-danger/10 p-3 rounded-full text-color-danger shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Emergency Frequency</h3>
                  <p className="text-text-secondary text-sm">
                    +91 98765 43210
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
