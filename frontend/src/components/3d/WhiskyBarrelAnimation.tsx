import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';

interface BarrelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  age: number;
  label: string;
  onClick?: () => void;
}

function WoodenBarrel({ position, rotation = [0, 0, 0], age, label, onClick }: BarrelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += delta * 0.1;
      
      // Hover effect
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  // Create procedural wood texture with cleanup
  const woodTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d')!;
    
    // Wood grain gradient
    const gradient = context.createLinearGradient(0, 0, 512, 0);
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(0.5, '#A0522D');
    gradient.addColorStop(1, '#654321');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    
    // Add wood grain lines
    context.strokeStyle = '#4B2F20';
    context.lineWidth = 1;
    for (let i = 0; i < 512; i += 8) {
      context.beginPath();
      context.moveTo(0, i + Math.sin(i * 0.01) * 10);
      context.lineTo(512, i + Math.sin(i * 0.01) * 10);
      context.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 4);
    return texture;
  }, []);

  // Cleanup texture on unmount
  React.useEffect(() => {
    return () => {
      if (woodTexture) {
        woodTexture.dispose();
      }
    };
  }, [woodTexture]);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group
        ref={meshRef}
        position={position}
        rotation={rotation}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        {/* Barrel Body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1, 2.5, 16, 1, false]} />
          <meshStandardMaterial
            color="#8B4513"
            roughness={0.8}
            metalness={0.1}
            map={woodTexture}
          />
        </mesh>
        
        {/* Barrel Top */}
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 16]} />
          <meshStandardMaterial
            color="#654321"
            roughness={0.9}
            metalness={0}
          />
        </mesh>
        
        {/* Barrel Bottom */}
        <mesh position={[0, -1.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 0.1, 16]} />
          <meshStandardMaterial
            color="#654321"
            roughness={0.9}
            metalness={0}
          />
        </mesh>
        
        {/* Metal Bands */}
        {[0.8, 0, -0.8].map((y, index) => (
          <mesh key={index} position={[0, y, 0]} castShadow>
            <torusGeometry args={[1.22, 0.05, 8, 16]} />
            <meshStandardMaterial
              color="#2C2416"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
        ))}
        
        {/* Age Label */}
        <Center position={[0, 0, 1.3]}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.3}
            height={0.05}
            curveSegments={12}
          >
            {age} YEARS
            <meshStandardMaterial
              color="#FFD700"
              metalness={0.6}
              roughness={0.3}
              emissive="#FFD700"
              emissiveIntensity={0.2}
            />
          </Text3D>
        </Center>
        
        {/* Distillery Label */}
        <Center position={[0, -0.5, 1.3]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.15}
            height={0.02}
            curveSegments={8}
          >
            {label}
            <meshStandardMaterial
              color="#FFFFFF"
              metalness={0.2}
              roughness={0.6}
            />
          </Text3D>
        </Center>
        
        {/* Hover Glow */}
        {hovered && (
          <pointLight
            position={[0, 0, 2]}
            intensity={0.5}
            color="#FFD700"
            distance={3}
          />
        )}
      </group>
    </Float>
  );
}

interface AgeCounterProps {
  targetAge: number;
  duration?: number;
}

function AgeCounter({ targetAge, duration = 3 }: AgeCounterProps) {
  const [currentAge, setCurrentAge] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    
    const updateAge = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const age = Math.floor(easedProgress * targetAge);
      
      setCurrentAge(age);
      
      if (progress < 1) {
        requestAnimationFrame(updateAge);
      }
    };
    
    updateAge();
  }, [targetAge, duration]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-6xl md:text-8xl font-bold text-premium-gold text-center"
    >
      <span className="tabular-nums">{currentAge}</span>
      <span className="text-3xl md:text-4xl ml-2">Years</span>
    </motion.div>
  );
}

interface ParallaxWoodGrainProps {
  className?: string;
}

function ParallaxWoodGrain({ className = "" }: ParallaxWoodGrainProps) {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        style={{ 
          y: y1,
          backgroundImage: `repeating-linear-gradient(
            90deg,
            #8B4513,
            #8B4513 2px,
            #A0522D 2px,
            #A0522D 4px
          )`
        }}
        className="absolute inset-0 opacity-10"
      />
      <motion.div
        style={{ 
          y: y2,
          backgroundImage: `repeating-linear-gradient(
            88deg,
            #654321,
            #654321 3px,
            #8B4513 3px,
            #8B4513 6px
          )`
        }}
        className="absolute inset-0 opacity-5"
      />
      <motion.div
        style={{ 
          y: y3,
          backgroundImage: `repeating-linear-gradient(
            92deg,
            #4B2F20,
            #4B2F20 1px,
            transparent 1px,
            transparent 3px
          )`
        }}
        className="absolute inset-0 opacity-5"
      />
    </div>
  );
}

interface BarrelData {
  id: string;
  age: number;
  distillery: string;
  position: [number, number, number];
}

export default function WhiskyBarrelAnimation() {
  const [selectedBarrel, setSelectedBarrel] = useState<BarrelData | null>(null);
  
  const barrels: BarrelData[] = [
    { id: '1', age: 12, distillery: 'HIGHLAND', position: [-3, 0, 0] },
    { id: '2', age: 18, distillery: 'SPEYSIDE', position: [0, 0, 0] },
    { id: '3', age: 25, distillery: 'ISLAY', position: [3, 0, 0] },
  ];
  
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-amber-950 to-amber-900">
      {/* Parallax Wood Grain Background */}
      <ParallaxWoodGrain className="z-0" />
      
      {/* 3D Barrel Scene */}
      <div className="relative z-10 h-[600px]">
        <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
          />
          
          {/* Barrels */}
          {barrels.map((barrel) => (
            <WoodenBarrel
              key={barrel.id}
              position={barrel.position}
              age={barrel.age}
              label={barrel.distillery}
              onClick={() => setSelectedBarrel(barrel)}
            />
          ))}
          
          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial
              color="#2C1810"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.5}
          />
        </Canvas>
      </div>
      
      {/* Age Counter Display */}
      <div className="relative z-20 py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-center text-white mb-8"
          >
            Premium Aged Collection
          </motion.h2>
          
          {selectedBarrel && (
            <div className="text-center">
              <AgeCounter targetAge={selectedBarrel.age} />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-amber-100 mt-4"
              >
                {selectedBarrel.distillery} Distillery
              </motion.p>
            </div>
          )}
          
          {!selectedBarrel && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-amber-100 text-xl"
            >
              Click on a barrel to explore its heritage
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Info Cards */}
      <div className="relative z-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {barrels.map((barrel) => (
              <motion.div
                key={barrel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: barrel.age * 0.02 }}
                className={`bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-amber-700/30 cursor-pointer transition-all ${
                  selectedBarrel?.id === barrel.id ? 'ring-2 ring-premium-gold' : ''
                }`}
                onClick={() => setSelectedBarrel(barrel)}
              >
                <h3 className="text-2xl font-bold text-premium-gold mb-2">
                  {barrel.age} Year Old
                </h3>
                <p className="text-amber-100 mb-4">{barrel.distillery}</p>
                <div className="space-y-2 text-sm text-amber-200">
                  <p>• Cask Strength: 58.4% ABV</p>
                  <p>• Limited Edition: 500 Bottles</p>
                  <p>• Investment Grade: AAA</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}