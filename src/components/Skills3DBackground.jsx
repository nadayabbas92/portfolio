import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Floating Translucent Glass Block
function FloatingGlassBlock({ position, shape = "cube", color, speed = 0.3, mouseX, mouseY }) {
  const meshRef = useRef();
  const initPos = useRef(position);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Slow organic rotation
    meshRef.current.rotation.x += delta * 0.25;
    meshRef.current.rotation.y += delta * 0.3;

    // Drifting float
    const floatY = Math.sin(time * speed + position[0]) * 0.12;

    // Gentle mouse parallax (strictly within safe viewport bounds)
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      initPos.current[0] + mouseX * 0.4,
      0.04
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      initPos.current[1] + floatY + mouseY * 0.25,
      0.04
    );
  });

  return (
    <group ref={meshRef} position={position}>
      {shape === "icosahedron" ? (
        <mesh scale={0.42}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.12}
            metalness={0.2}
            transmission={0.85}
            transparent
            opacity={0.65}
            ior={1.4}
          />
        </mesh>
      ) : (
        <mesh scale={0.4}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.15}
            metalness={0.15}
            transmission={0.88}
            transparent
            opacity={0.65}
            ior={1.4}
          />
        </mesh>
      )}

      {/* Subtle glowing wireframe edges */}
      {shape === "icosahedron" ? (
        <mesh scale={0.43}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
        </mesh>
      ) : (
        <mesh scale={0.41}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}

export default function Skills3DBackground() {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Safely bounded positions to ensure nothing is EVER clipped by viewport edges
  const blocks = [
    { position: [-2.0, 0.7, -1.2], shape: "cube", color: "#38bdf8", speed: 0.35 },
    { position: [2.0, 0.8, -1.5], shape: "icosahedron", color: "#8b5cf6", speed: 0.28 },
    { position: [-1.4, -0.8, -1.0], shape: "icosahedron", color: "#22d3ee", speed: 0.32 },
    { position: [1.5, -0.7, -1.1], shape: "cube", color: "#a855f7", speed: 0.38 },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

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
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  if (isMobile || reducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Canvas
          frameloop={isInView ? "always" : "never"}
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1)]}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 3, 3]} intensity={2} color="#38bdf8" />
          <pointLight position={[-3, -3, 2]} intensity={2.5} color="#8b5cf6" />

          {blocks.map((block, idx) => (
            <FloatingGlassBlock
              key={idx}
              position={block.position}
              shape={block.shape}
              color={block.color}
              speed={block.speed}
              mouseX={mouse.x}
              mouseY={mouse.y}
            />
          ))}
        </Canvas>
      </Suspense>
    </div>
  );
}
