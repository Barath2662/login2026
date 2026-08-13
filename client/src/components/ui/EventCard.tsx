import React from 'react';
import { Lock, Unlock, Users, MapPin, Clock } from 'lucide-react';
import { Button } from './Button';

interface EventCardProps {
  event: any;
  isRegistered: boolean;
  onClick: (event: any) => void;
  className?: string;
  isLeftAligned?: boolean; // Used for timeline zig-zag layout
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isRegistered, 
  onClick, 
  className = "",
  isLeftAligned = true
}) => {
  const now = new Date();
  const closesAt = new Date(event.registrationClosesAt);
  const isClosed = now > closesAt;

  return (
    <div 
      className={`w-full p-6 bg-bg-primary border border-border-color rounded-sm transition-all duration-300 hover:border-color-red hover:shadow-[0_0_20px_rgba(239,35,60,0.15)] group ${className}`}
    >
      <div className={`flex flex-col gap-4 ${isLeftAligned ? 'md:text-right' : 'md:text-left'}`}>
        
        <div>
          <span className="font-mono text-xs text-text-secondary uppercase tracking-widest block mb-2">
            WORLD {event.worldNumber < 10 ? `0${event.worldNumber}` : event.worldNumber} // {event.category}
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-text-primary uppercase group-hover:text-color-silver transition-colors">
            {event.title}
          </h3>
        </div>

        <p className="text-sm text-text-secondary line-clamp-3 text-left md:text-inherit">
          {event.description}
        </p>

        {/* Tactical Mini-Specs */}
        <div className={`flex flex-wrap gap-4 mt-2 ${isLeftAligned ? 'md:justify-end' : 'md:justify-start'}`}>
          <div className="flex items-center text-xs text-text-muted font-mono">
            <Users size={12} className="mr-1 text-color-red" />
            {event.isTeam ? `${event.minTeamSize}-${event.maxTeamSize} OP` : 'SOLO'}
          </div>
          <div className="flex items-center text-xs text-text-muted font-mono">
            <MapPin size={12} className="mr-1 text-color-silver" />
            {event.venue || 'TBA'}
          </div>
          <div className="flex items-center text-xs text-text-muted font-mono">
            <Clock size={12} className="mr-1 text-color-silver" />
            {event.time || 'TBA'}
          </div>
        </div>

        <div className={`mt-4 flex ${isLeftAligned ? 'md:justify-end' : 'md:justify-start'}`}>
          <Button
            onClick={() => onClick(event)}
            aria-label={`View dossier for ${event.title}`}
            className={`active:scale-95 cursor-pointer font-mono tracking-wider w-full md:w-auto ${
              isRegistered 
                ? 'bg-color-red/20 text-color-red border border-color-red hover:bg-color-red hover:text-black' 
                : isClosed 
                  ? 'bg-bg-secondary text-text-muted border-none' 
                  : 'bg-transparent border border-color-silver text-color-silver hover:bg-color-silver hover:text-black'
            }`}
          >
            {isRegistered ? (
               <><Unlock size={14} className="mr-2 inline" /> ACCESS GRANTED</>
            ) : (
               <><Lock size={14} className="mr-2 inline" /> VIEW DOSSIER</>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};
