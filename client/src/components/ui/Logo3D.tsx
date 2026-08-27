// Removed unused React import

export const Logo3D = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      {/* Background ambient red glow */}
      <div
        className="absolute inset-[-10%] rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(224, 27, 34, 0.22) 0%, rgba(224, 27, 34, 0.05) 55%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />
      
      {/* Main logo graphic */}
      <img
        src="/assets/login.png"
        alt="LOGIN 2K26 Logo"
        className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(224,27,34,0.45)]"
      />
    </div>
  );
};
