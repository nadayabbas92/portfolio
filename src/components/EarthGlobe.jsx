import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Converts Lat/Long to 3D Cartesian Vector on sphere of given radius
function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Procedurally generates high-tech continental landmass point cloud
function useWorldLandmassPoints(radius = 1.95, pointCount = 1800) {
  return useMemo(() => {
    // Generate an offscreen canvas with simplified world landmasses to sample points
    const canvas = document.createElement("canvas");
    canvas.width = 360;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");

    if (!ctx) return new Float32Array(0);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 360, 180);
    ctx.fillStyle = "#ffffff";

    // Simplified continental polygon paths (X: 0..360 where 180 is prime meridian, Y: 0..180 where 90 is equator)
    // North America
    ctx.beginPath();
    ctx.ellipse(85, 48, 42, 28, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // South America
    ctx.beginPath();
    ctx.ellipse(120, 118, 22, 38, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Eurasia
    ctx.beginPath();
    ctx.ellipse(245, 45, 65, 26, 0.05, 0, Math.PI * 2);
    ctx.fill();
    // Africa
    ctx.beginPath();
    ctx.ellipse(198, 92, 26, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    // South Asia / Pakistan / India region
    ctx.beginPath();
    ctx.ellipse(248, 68, 24, 22, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Australia
    ctx.beginPath();
    ctx.ellipse(312, 130, 24, 18, -0.1, 0, Math.PI * 2);
    ctx.fill();
    // East Asia / Japan / Archipelago
    ctx.beginPath();
    ctx.ellipse(285, 62, 20, 22, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // UK & Western Europe
    ctx.beginPath();
    ctx.ellipse(182, 42, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    const imgData = ctx.getImageData(0, 0, 360, 180).data;
    const validPoints = [];

    // Dense grid scan with stochastic sampling for organic digital dot look
    for (let lat = -80; lat <= 80; lat += 2.5) {
      for (let lon = -180; lon <= 180; lon += 3.0) {
        const x = Math.floor(lon + 180);
        const y = Math.floor(90 - lat);
        const idx = (y * 360 + x) * 4;

        if (imgData[idx] > 100) {
          // Point is on land
          const pos = latLongToVector3(lat, lon, radius);
          validPoints.push(pos.x, pos.y, pos.z);
        } else if (Math.random() < 0.04) {
          // Sparse oceanic background points for cosmic texture
          const pos = latLongToVector3(lat, lon, radius * 0.99);
          validPoints.push(pos.x, pos.y, pos.z);
        }
      }
    }

    return new Float32Array(validPoints);
  }, [radius]);
}

// Glowing Location Beacon for Karachi, PK (Lat: 24.86, Lon: 67.00)
function LocationBeacon({ radius = 1.95 }) {
  const pulseRef1 = useRef();
  const pulseRef2 = useRef();
  const targetPos = useMemo(
    () => latLongToVector3(24.86, 67.0, radius + 0.02),
    [radius]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pulseRef1.current) {
      const s1 = 1 + (t % 1.5) * 1.8;
      const op1 = Math.max(0, 1 - (t % 1.5) / 1.5);
      pulseRef1.current.scale.set(s1, s1, s1);
      pulseRef1.current.material.opacity = op1 * 0.8;
    }
    if (pulseRef2.current) {
      const s2 = 1 + ((t + 0.75) % 1.5) * 1.8;
      const op2 = Math.max(0, 1 - ((t + 0.75) % 1.5) / 1.5);
      pulseRef2.current.scale.set(s2, s2, s2);
      pulseRef2.current.material.opacity = op2 * 0.8;
    }
  });

  return (
    <group position={targetPos}>
      {/* Central bright glowing pin marker */}
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>

      {/* Primary Expanding Pulse Wave */}
      <mesh ref={pulseRef1}>
        <ringGeometry args={[0.045, 0.07, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary Staggered Pulse Wave */}
      <mesh ref={pulseRef2}>
        <ringGeometry args={[0.045, 0.07, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Glowing Orbital Arcs & Equatorial Ring
function OrbitalDataRings({ radius = 1.95 }) {
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  useFrame((_, delta) => {
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.18;
      ringRef1.current.rotation.x += delta * 0.05;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.12;
      ringRef2.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group>
      {/* Tilted Cyan Orbital Ring */}
      <mesh ref={ringRef1} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[radius * 1.22, 0.008, 16, 128]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Counter-Tilted Violet Orbital Ring */}
      <mesh ref={ringRef2} rotation={[-0.5, -0.3, 0.2]}>
        <torusGeometry args={[radius * 1.3, 0.006, 16, 128]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Interactive Earth Globe Core
function InteractiveGlobeScene({ isDragging, dragDelta, onPointerDown }) {
  const globeGroupRef = useRef();
  const radius = 1.95;
  const landmassPoints = useWorldLandmassPoints(radius);

  // Smooth rotation with inertia
  const rotVelocity = useRef({ x: 0, y: 0.003 });

  useFrame((_, delta) => {
    if (!globeGroupRef.current) return;

    if (isDragging) {
      globeGroupRef.current.rotation.y += dragDelta.x * 0.006;
      globeGroupRef.current.rotation.x = THREE.MathUtils.clamp(
        globeGroupRef.current.rotation.x + dragDelta.y * 0.006,
        -0.6,
        0.6
      );
      rotVelocity.current.y = dragDelta.x * 0.001;
    } else {
      // Natural slow planetary rotation
      globeGroupRef.current.rotation.y += (0.003 + rotVelocity.current.y) * (delta * 60);
      rotVelocity.current.y *= 0.94; // Inertia damping
    }
  });

  return (
    <group ref={globeGroupRef} onPointerDown={onPointerDown}>
      {/* Inner Dark Navy Sphere with Subtle Specular Highlight */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 48, 48]} />
        <meshStandardMaterial
          color="#060914"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Atmospheric Inner Glow Shell */}
      <mesh>
        <sphereGeometry args={[radius * 0.995, 48, 48]} />
        <meshBasicMaterial
          color="#0e172f"
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* High-Tech Landmass Dot Grid */}
      {landmassPoints.length > 0 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={landmassPoints.length / 3}
              array={landmassPoints}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.038}
            color="#38bdf8"
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Karachi, PK Live Location Marker */}
      <LocationBeacon radius={radius} />

      {/* Orbiting Celestial Data Rings */}
      <OrbitalDataRings radius={radius} />

      {/* Outer Atmospheric Corona */}
      <mesh scale={1.12}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function EarthGlobe() {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setDragDelta({ x: dx, y: dy });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragDelta({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="w-full h-full min-h-[360px] sm:min-h-[420px] relative select-none cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
    >
      {/* Floating Holographic Coordinates Badge */}
      <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-[#0a0f20]/90 border border-cyan-400/30 backdrop-blur-md text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Karachi, PK • 24.86° N, 67.00° E</span>
      </div>

      {/* Drag Hint Pill */}
      <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm text-[11px] font-mono text-zinc-400 pointer-events-none">
        Drag to rotate
      </div>

      <Suspense fallback={null}>
        <Canvas
          frameloop={isInView ? "always" : "never"}
          camera={{ position: [0, 0, 4.8], fov: 46 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1)]}
        >
          <ambientLight intensity={1.4} />
          <directionalLight position={[4, 3, 3]} intensity={2.0} color="#38bdf8" />
          <pointLight position={[-4, -3, 2]} intensity={1.8} color="#8b5cf6" />

          <InteractiveGlobeScene
            isDragging={isDragging}
            dragDelta={dragDelta}
            onPointerDown={handlePointerDown}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
