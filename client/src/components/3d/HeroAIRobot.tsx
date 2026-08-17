import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';
import robotModelUrl from '../../assets/models/endangered-ai.glb?url';

const RobotModel = () => {
  // Load the model using the imported URL
  const { scene } = useGLTF(robotModelUrl, true, true, (error) => {
    console.warn("Model failed to load, returning fallback.", error);
  });
  
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Mouse tracking float effect
    const targetX = (state.pointer.x * 2);
    const targetY = (state.pointer.y * 2);
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX * 0.2, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY * 0.2, 0.05);
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        {scene ? (
          <primitive object={scene} scale={2} position={[0, -1.5, 0]} />
        ) : (
          // Fallback mesh if model doesn't exist yet
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[1, 2, 4, 8]} />
            <meshStandardMaterial color="#A8A9AD" metalness={0.8} roughness={0.2} />
          </mesh>
        )}
      </Float>
    </group>
  );
};

// Preload the model
useGLTF.preload(robotModelUrl);

export const HeroAIRobot = () => {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true }}>
        <color attach="background" args={['#050505']} />
        
        {/* Ambient Light */}
        <ambientLight intensity={0.8} color="#ffffff" />
        
        {/* Main Directional Light */}
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#A8A9AD" />
        
        {/* Stark Silver Rim Light from behind */}
        <spotLight 
          position={[0, 5, -10]} 
          intensity={5} 
          angle={0.6} 
          penumbra={0.5} 
          color="#E5E5E5" 
          distance={50}
          castShadow
        />

        <RobotModel />
      </Canvas>
    </div>
  );
};

export default HeroAIRobot;
