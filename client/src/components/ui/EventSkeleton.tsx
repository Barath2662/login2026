import { motion } from 'framer-motion';

export const EventSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 relative flex flex-col items-center">
      {/* Central Line Skeleton */}
      <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-bg-secondary opacity-50" />
      
      {/* 3 Skeleton Cards */}
      {[1, 2, 3].map((index) => (
        <div 
          key={index} 
          className={`relative w-full md:w-5/12 my-8 flex flex-col ${
            index % 2 === 0 ? 'md:self-end md:ml-auto md:text-left' : 'md:self-start md:mr-auto md:text-right text-left'
          }`}
        >
          {/* Node dot on the line */}
          <div className="hidden md:block absolute top-1/2 w-4 h-4 rounded-full bg-bg-secondary -translate-y-1/2"
            style={{ [index % 2 === 0 ? 'left' : 'right']: '-2rem' }}
          />
          
          {/* Shimmering Card */}
          <motion.div 
            className="p-6 border border-bg-secondary rounded-lg bg-bg-primary overflow-hidden relative"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-color-silver-dim/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            
            <div className="w-1/3 h-4 bg-bg-secondary rounded mb-4" />
            <div className="w-2/3 h-8 bg-bg-secondary rounded mb-4" />
            <div className="w-full h-16 bg-bg-secondary rounded mb-6" />
            <div className="w-1/2 h-10 bg-bg-secondary rounded mt-auto" />
          </motion.div>
        </div>
      ))}
    </div>
  );
};
