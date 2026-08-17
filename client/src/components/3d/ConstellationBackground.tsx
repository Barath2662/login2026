import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const Scene = () => {
  return (
    <>
      <color attach="background" args={['#050505']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="var(--color-red)" />
      <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#b400ff" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#ef4444" distance={10} />

      {/* Cyberpunk Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />
    </>
  );
};

export const ConstellationBackground = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-50 pointer-events-none hidden md:block">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }} 
        gl={{ alpha: false, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]} // limit pixel ratio for performance
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default ConstellationBackground;
