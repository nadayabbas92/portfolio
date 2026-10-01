import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Floating translucent 3D glass shape (cube / tile)
function FloatingGlassShape({ position, rotation, color, scale = 0.5, mouseX, mouseY }) {
  const meshRef = useRef();
  const speed = useRef(0.25 + Math.random() * 0.25);
  const rotSpeedX = useRef(0.12 + Math.random() * 0.15);
  const rotSpeedY = useRef(0.1 + Math.random() * 0.18);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Slow rotation
    meshRef.current.rotation.x += delta * rotSpeedX.current;
    meshRef.current.rotation.y += delta * rotSpeedY.current;

    // Gentle floating drift
    const t = state.clock.getElapsedTime() * speed.current;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.25;

    // Mouse parallax
    const targetX = position[0] + mouseX * 0.35;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.04);
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 0.3]} />
      <meshPhysicalMaterial
        color={color}
        transmission={0.82}
        opacity={0.65}
        transparent
        roughness={0.18}
        metalness={0.12}
        ior={1.4}
        thickness={0.6}
      />
    </mesh>
  );
}

function FloatingShapesScene({ mouseX, mouseY }) {
  // Balanced shapes distributed across the section background within safe bounds
  const shapes = [
    { position: [-2.6, 1.2, -1.5], rotation: [0.3, 0.4, 0], color: "#38bdf8", scale: 0.55 },
    { position: [2.8, 1.4, -2.0], rotation: [-0.2, 0.6, 0.1], color: "#8b5cf6", scale: 0.65 },
    { position: [-2.8, -1.2, -1.2], rotation: [0.5, -0.3, 0.2], color: "#22d3ee", scale: 0.5 },
    { position: [2.6, -1.1, -1.8], rotation: [-0.4, -0.5, 0], color: "#facc15", scale: 0.55 },
    { position: [-1.4, 2.0, -2.2], rotation: [0.2, 0.2, 0.4], color: "#a855f7", scale: 0.45 },
    { position: [1.5, 2.1, -2.4], rotation: [-0.3, 0.5, -0.2], color: "#06b6d4", scale: 0.45 },
  ];

  return (
    <group>
      {shapes.map((s, idx) => (
        <FloatingGlassShape
          key={idx}
          position={s.position}
          rotation={s.rotation}
          color={s.color}
          scale={s.scale}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </group>
  );
}

export default function SkillsCanvas() {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Only render when section is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  if (isMobile || reducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Canvas
          frameloop={isInView ? "always" : "never"}
          camera={{ position: [0, 0, 4.2], fov: 48 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1)]}
        >
          <ambientLight intensity={1.4} />
          <directionalLight position={[3, 4, 3]} intensity={2.2} color="#38bdf8" />
          <pointLight position={[-3, -3, 2]} intensity={2.2} color="#8b5cf6" />
          <FloatingShapesScene mouseX={mouse.x} mouseY={mouse.y} />
        </Canvas>
      </Suspense>
    </div>
  );
}
