import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface WhiskyPourAnimationProps {
  isPouring: boolean;
  onAnimationComplete?: () => void;
}

function WhiskyGlass({ liquidRef }: { liquidRef: React.RefObject<THREE.Mesh | null> }) {
  const glassRef = useRef<THREE.Mesh>(null);
  
  return (
    <group position={[0, -1, 0]}>
      {/* Outer Glass */}
      <mesh ref={glassRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.5, 2, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.97}
          roughness={0.05}
          thickness={0.02}
          ior={1.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent={true}
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner Glass (for thickness effect) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.68, 0.48, 1.95, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.97}
          roughness={0.05}
          thickness={0.02}
          ior={1.5}
          envMapIntensity={1}
          transparent={true}
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Glass Bottom */}
      <mesh position={[0, -0.98, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.48, 0.15, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          roughness={0.05}
          thickness={1}
          ior={1.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
      
      {/* Glass Base (thick bottom) */}
      <mesh position={[0, -1.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.1, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          roughness={0.1}
          thickness={2}
          ior={1.5}
        />
      </mesh>
      
      {/* Whisky Liquid */}
      <mesh ref={liquidRef} position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.65, 0.47, 0.01, 64]} />
        <meshPhysicalMaterial
          color="#964B00"
          transmission={0.5}
          roughness={0}
          metalness={0}
          ior={1.33}
          thickness={2}
          envMapIntensity={0.3}
          emissive="#4a2511"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

function WhiskyBottle({ isPouring }: { isPouring: boolean }) {
  const bottleRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);
  
  useFrame((state, delta) => {
    if (bottleRef.current && isPouring) {
      // Animate bottle tilting
      setRotation(prev => Math.min(prev + delta * 2, Math.PI / 3));
      bottleRef.current.rotation.z = rotation;
      bottleRef.current.position.y = 2 + Math.sin(rotation) * 0.5;
      bottleRef.current.position.x = -1.5 + rotation * 0.8;
    } else if (bottleRef.current && !isPouring && rotation > 0) {
      // Return to original position
      setRotation(prev => Math.max(prev - delta * 2, 0));
      bottleRef.current.rotation.z = rotation;
      bottleRef.current.position.y = 2 + Math.sin(rotation) * 0.5;
      bottleRef.current.position.x = -1.5 + rotation * 0.8;
    }
  });
  
  return (
    <group ref={bottleRef} position={[-1.5, 2, 0]}>
      {/* Bottle Body - Main */}
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.4, 2.5, 64]} />
        <meshPhysicalMaterial
          color="#0d1117"
          transmission={0.9}
          roughness={0.1}
          metalness={0}
          ior={1.5}
          thickness={3}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
      
      {/* Bottle Shoulder */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.3, 64]} />
        <meshPhysicalMaterial
          color="#0d1117"
          transmission={0.9}
          roughness={0.1}
          metalness={0}
          ior={1.5}
          thickness={3}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
      
      {/* Bottle Neck */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 0.4, 64]} />
        <meshPhysicalMaterial
          color="#0d1117"
          transmission={0.9}
          roughness={0.1}
          metalness={0}
          ior={1.5}
          thickness={3}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
      
      {/* Cork/Cap */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.15, 0.3, 32]} />
        <meshStandardMaterial 
          color="#3a2317"
          roughness={0.8}
          metalness={0}
        />
      </mesh>
      
      {/* Cap Top (metal) */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Whisky Liquid Inside */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.33, 0.38, 1.8, 64]} />
        <meshPhysicalMaterial
          color="#964B00"
          transmission={0.2}
          roughness={0}
          metalness={0}
          ior={1.33}
          thickness={1}
          emissive="#4a2511"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Label Background */}
      <mesh position={[0, 0, 0.401]}>
        <planeGeometry args={[0.65, 1.2]} />
        <meshStandardMaterial 
          color="#F5DEB3"
          roughness={0.9}
          metalness={0}
        />
      </mesh>
      
      {/* Label Text Area (gold accent) */}
      <mesh position={[0, 0.3, 0.402]}>
        <planeGeometry args={[0.5, 0.3]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.7}
          roughness={0.3}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Premium Badge */}
      <mesh position={[0, -0.3, 0.403]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial
          color="#8B0000"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function PouringStream({ isPouring, onComplete, liquidRef }: { 
  isPouring: boolean; 
  onComplete?: () => void;
  liquidRef: React.RefObject<THREE.Mesh | null>;
}) {
  const streamRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [streamHeight, setStreamHeight] = useState(0);
  const [liquidLevel, setLiquidLevel] = useState(0.01);
  
  useFrame((state, delta) => {
    if (isPouring && streamRef.current) {
      // Animate stream
      setStreamHeight(prev => Math.min(prev + delta * 3, 3));
      streamRef.current.scale.y = streamHeight;
      streamRef.current.position.y = 2 - streamHeight / 2;
      
      // Animate liquid level in glass
      setLiquidLevel(prev => Math.min(prev + delta * 0.3, 1));
      
      // Update liquid mesh
      if (liquidRef.current) {
        liquidRef.current.scale.y = liquidLevel * 100;
        liquidRef.current.position.y = -0.5 + liquidLevel / 2;
      }
      
      // Animate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y += delta * 2;
        particlesRef.current.position.y = -1 + liquidLevel;
      }
    } else if (!isPouring && streamHeight > 0) {
      // Stop pouring
      setStreamHeight(prev => Math.max(prev - delta * 5, 0));
      if (streamRef.current) {
        streamRef.current.scale.y = streamHeight;
        streamRef.current.position.y = 2 - streamHeight / 2;
      }
      
      if (streamHeight === 0 && onComplete) {
        onComplete();
      }
    }
  });
  
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 1] = Math.random() * 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  
  return (
    <>
      {/* Pouring stream */}
      <mesh ref={streamRef} position={[-0.3, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 1, 16]} />
        <meshPhysicalMaterial
          color="#b8691f"
          transmission={0.8}
          roughness={0.2}
          thickness={1}
        />
      </mesh>
      
      {/* Splash particles */}
      <points ref={particlesRef} position={[0, -1, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#b8691f"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </>
  );
}

function Scene({ isPouring, onAnimationComplete }: WhiskyPourAnimationProps) {
  const liquidRef = useRef<THREE.Mesh>(null);
  
  return (
    <>
      {/* Ambient lighting for overall brightness */}
      <ambientLight intensity={0.3} />
      
      {/* Key light - main directional light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      
      {/* Fill light - softer from opposite side */}
      <directionalLight
        position={[-3, 5, -2]}
        intensity={0.5}
        color="#ffeaa7"
      />
      
      {/* Rim light - highlights edges */}
      <spotLight
        position={[0, 5, -3]}
        intensity={1}
        angle={0.4}
        penumbra={0.5}
        color="#FFD700"
        castShadow
      />
      
      {/* Top spot for glass highlights */}
      <spotLight
        position={[0, 6, 0]}
        intensity={0.8}
        angle={0.3}
        penumbra={1}
        color="#ffffff"
      />
      
      {/* Accent light for whisky glow */}
      <pointLight
        position={[0, 0, 0]}
        intensity={0.3}
        color="#FF8C00"
      />
      
      <WhiskyGlass liquidRef={liquidRef} />
      <WhiskyBottle isPouring={isPouring} />
      <PouringStream isPouring={isPouring} onComplete={onAnimationComplete} liquidRef={liquidRef} />
      
      {/* Table Surface */}
      <mesh position={[0, -2.1, 0]} receiveShadow>
        <boxGeometry args={[10, 0.2, 10]} />
        <meshStandardMaterial 
          color="#2c1810"
          roughness={0.2}
          metalness={0}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Table Reflection/Polish Effect */}
      <mesh position={[0, -2.09, 0]} receiveShadow>
        <boxGeometry args={[10, 0.01, 10]} />
        <meshPhysicalMaterial
          color="#2c1810"
          roughness={0.05}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
      
      <Environment preset="apartment" />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={10}
      />
    </>
  );
}

export default function WhiskyPourAnimation({ isPouring, onAnimationComplete }: WhiskyPourAnimationProps) {
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    if (isPouring) {
      setTimeout(() => setShowMessage(true), 1000);
    } else {
      setShowMessage(false);
    }
  }, [isPouring]);
  
  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-gradient-to-b from-amber-900/20 to-amber-950/40">
      <Canvas
        shadows
        camera={{ position: [5, 3, 5], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene isPouring={isPouring} onAnimationComplete={onAnimationComplete} />
      </Canvas>
      
      {/* Message Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
          showMessage ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-amber-900/90 backdrop-blur-md px-8 py-6 rounded-2xl border border-amber-700/50 shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            Let's have a premium whisky
          </h3>
          <p className="text-lg md:text-xl text-amber-100 text-center">
            before we discuss investment opportunities
          </p>
        </div>
      </div>
    </div>
  );
}