"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function AnimatedCloudSphere() {
  const sphereRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.03;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2}>
      <MeshDistortMaterial
        color="#FDFBF7"
        attach="material"
        distort={0.6}
        speed={1.2}
        roughness={0.1}
        metalness={0.05}
        emissive="#D97757"
        emissiveIntensity={0.15}
        transparent
        opacity={0.8}
        envMapIntensity={1}
        clearcoat={0.5}
        clearcoatRoughness={0.2}
      />
    </Sphere>
  );
}

export function TelemetryVisualization() {
  return (
    <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0 mix-blend-multiply">
      <Canvas camera={{ position: [0, 0, 6] }} dpr={[1, 2]}>
        <ambientLight intensity={2} color="#FDFBF7" />
        <directionalLight position={[4, 4, 4]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-3, -3, -3]} intensity={1.2} color="#D97757" />
        <AnimatedCloudSphere />
      </Canvas>
    </div>
  );
}
