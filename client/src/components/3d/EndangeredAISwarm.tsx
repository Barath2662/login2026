import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const NUM_BOIDS = 60;

const SwarmLogic = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  
  // Initialize instance data
  const { dummy, boids } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const boids = Array.from({ length: NUM_BOIDS }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      rotSpeed: new THREE.Vector3(Math.random() * 0.05, Math.random() * 0.05, Math.random() * 0.05),
      scale: Math.random() * 0.5 + 0.3,
      baseEmissive: Math.random(),
    }));
    return { dummy, boids };
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Pointer converted to world coordinates approximately
    const pointerX = (state.pointer.x * viewport.width) / 2;
    const pointerY = (state.pointer.y * viewport.height) / 2;
    const pointerPos = new THREE.Vector3(pointerX, pointerY, 0);

    boids.forEach((boid, i) => {
      // 1. Orbital logic (gentle pull to center)
      const distToCenter = boid.position.length();
      if (distToCenter > 15) {
        boid.velocity.add(boid.position.clone().normalize().multiplyScalar(-0.01));
      }

      // 2. Mouse tracking / dodging (hostile swarm behavior)
      const distToMouse = boid.position.distanceTo(pointerPos);
      if (distToMouse < 5) {
        // Dodge/scatter away from mouse if too close
        const scatter = boid.position.clone().sub(pointerPos).normalize().multiplyScalar(0.05);
        boid.velocity.add(scatter);
      } else if (distToMouse < 15) {
        // Slowly track/stalk the mouse from a distance
        const track = pointerPos.clone().sub(boid.position).normalize().multiplyScalar(0.005);
        boid.velocity.add(track);
      }

      // 3. Limit speed
      boid.velocity.clampLength(0, 0.2);

      // Update position
      boid.position.add(boid.velocity);
      
      // Update rotation
      boid.rotation.add(boid.rotSpeed);

      // Apply to dummy
      dummy.position.copy(boid.position);
      dummy.rotation.set(boid.rotation.x, boid.rotation.y, boid.rotation.z);
      dummy.scale.setScalar(boid.scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);

      // Emissive pulse math: baseEmissive + time based sine wave
      const pulse = Math.sin(state.clock.elapsedTime * 2 + boid.baseEmissive * 10) * 0.5 + 0.5; // 0 to 1
      const color = new THREE.Color().lerpColors(
        new THREE.Color('#D90429'), // Dying Crimson
        new THREE.Color('#EF233C'), // Light Blood Red
        pulse
      );
      mesh.setColorAt(i, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_BOIDS]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#050505"
        metalness={0.9}
        roughness={0.8}
        wireframe={false}
      />
    </instancedMesh>
  );
};

export const EndangeredAISwarm = () => {
  return (
    <div className="absolute inset-0 z-0 bg-bg-primary">
      <Canvas 
        camera={{ position: [0, 0, 20], fov: 45 }} 
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#050505']} />
        
        {/* Dim ambient light */}
        <ambientLight intensity={0.1} color="#ffffff" />
        
        {/* Harsh directional light */}
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#A8A9AD" />
        
        {/* Stark Silver rim light */}
        <pointLight position={[-10, -10, -10]} intensity={2} color="#E5E5E5" distance={30} />

        <SwarmLogic />
      </Canvas>
    </div>
  );
};

export default EndangeredAISwarm;
