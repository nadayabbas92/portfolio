import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BRAND_LOGOS } from "./brandLogos";

// Preload high-DPI circular glass badge textures with official brand icons
function preloadLogoTextures() {
  return new Promise((resolve) => {
    const keys = Object.keys(BRAND_LOGOS);
    const textures = {};
    let loadedCount = 0;
    let failed = false;

    keys.forEach((key) => {
      const item = BRAND_LOGOS[key];
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        failed = true;
        resolve(null);
        return;
      }

      const img = new Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.svg)}`;

      img.onload = () => {
        if (failed) return;
        ctx.clearRect(0, 0, 256, 256);

        const centerX = 128;
        const centerY = 128;
        const radius = 104;

        // Soft ambient glow
        ctx.save();
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 22;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Badge background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10, 16, 32, 0.88)";
        ctx.fill();

        // Neon border ring
        ctx.lineWidth = 4;
        ctx.strokeStyle = item.color;
        ctx.stroke();
        ctx.restore();

        // Inner subtle rim highlight
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 4, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
        ctx.stroke();

        // Draw centered vector brand logo
        const iconPadding = 64;
        const iconSize = 256 - iconPadding * 2;
        ctx.drawImage(img, iconPadding, iconPadding, iconSize, iconSize);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;

        textures[key] = texture;
        loadedCount += 1;

        if (loadedCount === keys.length) {
          resolve(textures);
        }
      };

      img.onerror = () => {
        failed = true;
        resolve(null);
      };
    });
  });
}

// Glowing stardust particles along an orbital ring
function OrbitStardust({ radius, color, count = 36 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const baseCol = new THREE.Color(color);
    const whiteCol = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 0.07;
      pos[i * 3] = Math.cos(angle) * (radius + spread);
      pos[i * 3 + 1] = Math.sin(angle) * (radius + spread);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

      const mixed = baseCol.clone().lerp(whiteCol, Math.random() * 0.4);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [radius, color, count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.034}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Orbiting Icon Badge with world-space billboarding and 3D depth perception
function OrbitingIconBadge({ texture, angleOffset, radius, speed }) {
  const meshRef = useRef();
  const worldPos = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime() * speed + angleOffset;

    // Local position along this ring's orbit plane
    const localX = Math.cos(t) * radius;
    const localY = Math.sin(t) * radius;
    meshRef.current.position.set(localX, localY, 0);

    // Billboarding: Keep badge always facing camera directly in world space
    meshRef.current.getWorldPosition(worldPos.current);
    meshRef.current.quaternion.copy(state.camera.quaternion);

    // 3D Depth scaling & opacity:
    // Foreground (z > 0): larger & brighter. Background (z < 0): smaller & softened behind frame.
    const zDepth = worldPos.current.z;
    const depthScale = THREE.MathUtils.clamp(1.0 + zDepth * 0.13, 0.82, 1.16);
    meshRef.current.scale.set(depthScale, depthScale, depthScale);

    if (meshRef.current.material) {
      const depthOpacity = THREE.MathUtils.clamp(0.92 + zDepth * 0.12, 0.65, 1.0);
      meshRef.current.material.opacity = depthOpacity;
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.52, 0.52]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.95}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Orbit 1: Primary Cyan Inner Orbital Ring (Holds 3 icons: React, JavaScript, Tailwind)
function PrimaryCyanOrbit({ textures, mouseX, mouseY, radius }) {
  const orbitGroupRef = useRef();
  const speed = 0.28;

  // 3 icons evenly spaced at 120 deg (2*PI/3)
  const items = useMemo(
    () => [
      { name: "React", angle: 0 },
      { name: "JavaScript", angle: (Math.PI * 2) / 3 },
      { name: "Tailwind", angle: (Math.PI * 4) / 3 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (!orbitGroupRef.current) return;

    // Distinct Primary Inclination: Tilted ~66° around X, slightly tilted in Y and Z
    const targetRotX = 1.15 + mouseY * 0.12;
    const targetRotY = 0.26 + mouseX * 0.12;
    const targetRotZ = -0.14;

    orbitGroupRef.current.rotation.x = THREE.MathUtils.damp(
      orbitGroupRef.current.rotation.x,
      targetRotX,
      3.5,
      delta
    );
    orbitGroupRef.current.rotation.y = THREE.MathUtils.damp(
      orbitGroupRef.current.rotation.y,
      targetRotY,
      3.5,
      delta
    );
    orbitGroupRef.current.rotation.z = targetRotZ;
  });

  return (
    <group ref={orbitGroupRef}>
      {/* Primary Holographic Cyan Ring */}
      <mesh>
        <torusGeometry args={[radius, 0.012, 16, 128]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.72}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner thin glow line */}
      <mesh scale={0.97}>
        <torusGeometry args={[radius, 0.005, 16, 96]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Cyan stardust particle trail */}
      <OrbitStardust radius={radius} color="#22d3ee" count={36} />

      {/* 3 Icons smoothly orbiting on Orbit 1 */}
      {items.map((item) => (
        <OrbitingIconBadge
          key={item.name}
          texture={textures[item.name]}
          angleOffset={item.angle}
          radius={radius}
          speed={speed}
        />
      ))}
    </group>
  );
}

// Orbit 2: Secondary Violet Outer Orbital Ring (Holds 3 icons: HTML5, CSS3, Git)
function SecondaryVioletOrbit({ textures, mouseX, mouseY, radius }) {
  const orbitGroupRef = useRef();
  const speed = -0.22; // Counter-harmonic rotation for striking 3D visual dynamics

  // 3 icons evenly spaced at 120 deg (2*PI/3)
  const items = useMemo(
    () => [
      { name: "HTML5", angle: 0 },
      { name: "CSS3", angle: (Math.PI * 2) / 3 },
      { name: "Git", angle: (Math.PI * 4) / 3 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (!orbitGroupRef.current) return;

    // Distinct Secondary Inclination: Tilted ~48° around X, opposite Y yaw for 3D cross-orbital depth
    const targetRotX = 0.84 - mouseY * 0.10;
    const targetRotY = -0.24 - mouseX * 0.10;
    const targetRotZ = 0.20;

    orbitGroupRef.current.rotation.x = THREE.MathUtils.damp(
      orbitGroupRef.current.rotation.x,
      targetRotX,
      3.5,
      delta
    );
    orbitGroupRef.current.rotation.y = THREE.MathUtils.damp(
      orbitGroupRef.current.rotation.y,
      targetRotY,
      3.5,
      delta
    );
    orbitGroupRef.current.rotation.z = targetRotZ;
  });

  return (
    <group ref={orbitGroupRef}>
      {/* Secondary Holographic Violet Ring */}
      <mesh>
        <torusGeometry args={[radius, 0.010, 16, 128]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.62}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer subtle glow rim */}
      <mesh scale={1.03}>
        <torusGeometry args={[radius, 0.005, 16, 96]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Violet stardust particle trail */}
      <OrbitStardust radius={radius} color="#8b5cf6" count={36} />

      {/* 3 Icons smoothly orbiting on Orbit 2 */}
      {items.map((item) => (
        <OrbitingIconBadge
          key={item.name}
          texture={textures[item.name]}
          angleOffset={item.angle}
          radius={radius}
          speed={speed}
        />
      ))}
    </group>
  );
}

// Responsive Camera Controller with Safe Bounded FOV
function ResponsiveCamera({ isMobile, isTablet }) {
  const { camera } = useThree();

  useEffect(() => {
    if (isMobile) {
      camera.position.set(0, 0, 6.2);
    } else if (isTablet) {
      camera.position.set(0, 0, 5.6);
    } else {
      camera.position.set(0, 0, 5.2);
    }
    camera.updateProjectionMatrix();
  }, [camera, isMobile, isTablet]);

  return null;
}

export default function HeroCanvas() {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ isMobile: false, isTablet: false });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [textures, setTextures] = useState(null);

  // Preload textures on mount
  useEffect(() => {
    let isMounted = true;
    preloadLogoTextures().then((loaded) => {
      if (isMounted) {
        setTextures(loaded);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setScreenSize({
        isMobile: w < 640,
        isTablet: w >= 640 && w < 1024,
      });
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

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
      mediaQuery.removeEventListener("change", handleMotionChange);
      observer.disconnect();
    };
  }, []);

  if (reducedMotion || !textures) {
    return null;
  }

  // Radii scaled to ensure safe containment across viewports
  const radius1 = screenSize.isMobile ? 1.48 : screenSize.isTablet ? 1.60 : 1.70;
  const radius2 = screenSize.isMobile ? 1.84 : screenSize.isTablet ? 1.98 : 2.10;

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none z-0 overflow-visible"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Canvas
          frameloop={isInView ? "always" : "never"}
          camera={{ position: [0, 0, 5.2], fov: 44 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1)]}
        >
          <ResponsiveCamera
            isMobile={screenSize.isMobile}
            isTablet={screenSize.isTablet}
          />
          <ambientLight intensity={1.8} />

          {/* Orbit 1: Primary Cyan Orbital Ring (React, JS, Tailwind) */}
          <PrimaryCyanOrbit
            textures={textures}
            mouseX={mouse.x}
            mouseY={mouse.y}
            radius={radius1}
          />

          {/* Orbit 2: Secondary Violet Orbital Ring (HTML5, CSS3, Git) */}
          <SecondaryVioletOrbit
            textures={textures}
            mouseX={mouse.x}
            mouseY={mouse.y}
            radius={radius2}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
