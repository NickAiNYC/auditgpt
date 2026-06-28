"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function AlertNode() {
  const nodeRef = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (nodeRef.current) {
      nodeRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      nodeRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });
  return (
    <Sphere ref={nodeRef} args={[1, 32, 32]} scale={1.2}>
      <MeshDistortMaterial
        color="#D97757" attach="material" distort={0.5} speed={2}
        roughness={0.2} metalness={0.8} emissive="#D97757" emissiveIntensity={0.4}
      />
    </Sphere>
  );
}

export function CriticalAlertCanvas() {
  return (
    <div className="h-6 w-6 relative -top-2 -right-2 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4] }} dpr={[1, 2]}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={2} color="#ffffff" />
        <AlertNode />
      </Canvas>
    </div>
  );
}
