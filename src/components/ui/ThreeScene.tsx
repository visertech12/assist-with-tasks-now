
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";

// 3D Card component that will perform the 360 rotation
function RotatingCard() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create texture for the card
  const texture = useTexture({
    map: "https://i.imgur.com/fHyUA5I.png", // Credit card texture placeholder
  });

  // Animation loop for rotation with improved movement
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
      
      // Add slight wobble effect
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.02;
    }
  });

  return (
    <group>
      {/* Main card body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[3, 4.5, 0.2]} />
        <meshStandardMaterial 
          color="#1A1F2C" 
          metalness={0.8}
          roughness={0.1}
          envMapIntensity={1.5}
        />
        
        {/* Card holographic element */}
        <mesh position={[0, 0, 0.11]} rotation={[0, 0, 0]}>
          <planeGeometry args={[2.8, 4.3]} />
          <meshPhysicalMaterial 
            color="#000000"
            metalness={0.9}
            roughness={0.1}
            iridescence={0.3}
            iridescenceIOR={1.5}
            clearcoat={1}
            transmission={0.05}
          />
        </mesh>

        {/* Card chip */}
        <mesh position={[-0.8, 0.8, 0.11]}>
          <boxGeometry args={[0.6, 0.6, 0.05]} />
          <meshStandardMaterial 
            color="#FFD700"
            metalness={0.9}
            roughness={0.1}
            emissive="#FFD700"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Card logo */}
        <mesh position={[0.8, 0.8, 0.11]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial 
            color="#FFC107"
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Card number area */}
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[2.5, 0.4]} />
          <meshStandardMaterial 
            color="#FFFFFF"
            metalness={0.3}
            roughness={0.7}
            opacity={0.7}
            transparent
          />
        </mesh>
        
        {/* Card holder name area */}
        <mesh position={[0, -1.5, 0.11]}>
          <planeGeometry args={[2.5, 0.5]} />
          <meshStandardMaterial 
            color="#FFFFFF"
            metalness={0.3}
            roughness={0.7}
            opacity={0.5}
            transparent
          />
        </mesh>
      </mesh>
    </group>
  );
}

// Enhanced background particle system
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  // More interesting particle movement
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0003;
      pointsRef.current.rotation.x += 0.0001;
      
      // Pulse effect
      pointsRef.current.scale.x = 1 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
      pointsRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
      pointsRef.current.scale.z = 1 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    }
  });
  
  // Create particles with improved distribution
  const particleCount = 2000;
  const positionsArray = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Create a sphere distribution
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, [particleCount]);
  
  // Create sizes for particles
  const sizes = useMemo(() => {
    const data = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      data[i] = Math.random() * 0.2 + 0.05;
    }
    return data;
  }, [particleCount]);
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positionsArray}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#FFC107" 
        transparent 
        opacity={0.7} 
        sizeAttenuation 
        depthWrite={false}
      />
    </points>
  );
}

// Add subtle ambient light animation
function AnimatedLights() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const pointRef = useRef<THREE.PointLight>(null);
  
  useFrame(({ clock }) => {
    if (ambientRef.current) {
      ambientRef.current.intensity = 0.2 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
    
    if (pointRef.current) {
      pointRef.current.intensity = 0.5 + Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
      pointRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.7) * 10;
      pointRef.current.position.y = Math.cos(clock.getElapsedTime() * 0.5) * 10;
    }
  });
  
  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.2} />
      <pointLight ref={pointRef} position={[-10, -10, -10]} color="#FFC107" intensity={0.5} />
    </>
  );
}

// The scene wrapper component
const ThreeSceneContent = () => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 45 }} 
      gl={{ 
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
      }}
      shadows
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 15, 30]} />
      
      <AnimatedLights />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1}
        castShadow
      />
      
      <ParticleField />
      <RotatingCard />
      <Environment preset="night" />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
};

// Client-side only wrapper with improved loading handling
const ThreeScene = () => {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Simulate loading completion
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-amber-400 text-lg">Loading 3D Scene...</div>
        </div>
      )}
      <div className={`transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <ThreeSceneContent />
      </div>
    </div>
  );
};

export default ThreeScene;
