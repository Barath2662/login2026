import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShard = ({ position, color, distort }: { position: [number, number, number], color: string, distort: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Add some random rotation to make them distinct
  const rotation = useMemo(() => [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ] as [number, number, number], []);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Slow continuous rotation
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.y += 0.003;
    
    // Parallax effect based on mouse
    const pointerX = state.pointer.x * 2;
    const pointerY = state.pointer.y * 2;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0] + pointerX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1] + pointerY, 0.05);
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={Math.random() * 0.5 + 0.5}>
        <octahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial 
          color={color} 
          clearcoat={0.5} 
          clearcoatRoughness={0.2} 
          metalness={0.3} 
          roughness={0.4} 
          distort={distort} 
          speed={2} 
          wireframe={Math.random() > 0.8}
        />
      </mesh>
    </Float>
  );
};

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

      {/* Hero Shards */}
      {/* Cyan primary group */}
      <FloatingShard position={[-4, 2, -2]} color="var(--color-red)" distort={0.2} />
      <FloatingShard position={[3, -2, -4]} color="var(--color-red)" distort={0.4} />
      <FloatingShard position={[-5, -1, -5]} color="var(--color-red)" distort={0.3} />
      
      {/* Purple secondary group */}
      <FloatingShard position={[5, 3, -6]} color="#b400ff" distort={0.5} />
      <FloatingShard position={[-2, -3, -3]} color="#b400ff" distort={0.2} />
      
      {/* Danger/Anomaly shards (smaller, high distortion) */}
      <FloatingShard position={[2, 1, 1]} color="#ef4444" distort={0.8} />
      <FloatingShard position={[-1, 4, -1]} color="#ef4444" distort={0.9} />
    </>
  );
};

export const MultiverseHero = () => {
  return (
    <div className="absolute inset-0 z-0">
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

// Add a default export to support React.lazy
export default MultiverseHero;
