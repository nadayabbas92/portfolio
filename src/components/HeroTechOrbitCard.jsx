import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import profilePic from "../assets/Naday.png";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiGit,
  SiVuedotjs,
  SiHtml5,
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa6";

// 8 official developer tech icons with official brand colors
const ORBIT_ICONS = [
  {
    key: "JavaScript",
    label: "JavaScript",
    color: "#F7DF1E",
    bg: "#F7DF1E",
    textColor: "#000",
    icon: SiJavascript,
  },
  {
    key: "TypeScript",
    label: "TypeScript",
    color: "#3178C6",
    bg: "#3178C6",
    textColor: "#fff",
    icon: SiTypescript,
  },
  {
    key: "React",
    label: "React",
    color: "#61DAFB",
    bg: "#61DAFB",
    textColor: "#000",
    icon: SiReact,
  },
  {
    key: "Tailwind",
    label: "Tailwind CSS",
    color: "#38BDF8",
    bg: "#38BDF8",
    textColor: "#000",
    icon: SiTailwindcss,
  },
  {
    key: "Git",
    label: "Git",
    color: "#F05032",
    bg: "#F05032",
    textColor: "#fff",
    icon: SiGit,
  },
  {
    key: "Vue",
    label: "Vue.js",
    color: "#42B883",
    bg: "#42B883",
    textColor: "#fff",
    icon: SiVuedotjs,
  },
  {
    key: "HTML5",
    label: "HTML5",
    color: "#E34F26",
    bg: "#E34F26",
    textColor: "#fff",
    icon: SiHtml5,
  },
  {
    key: "CSS3",
    label: "CSS3",
    color: "#1572B6",
    bg: "#1572B6",
    textColor: "#fff",
    icon: FaCss3Alt,
  },
];

export default function HeroTechOrbitCard() {
  const containerRef = useRef(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredTech, setHoveredTech] = useState(null);
  const [orbitRadius, setOrbitRadius] = useState(190);

  // Responsive radius calculation
  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setOrbitRadius(140);
      } else if (w < 768) {
        setOrbitRadius(165);
      } else if (w < 1024) {
        setOrbitRadius(180);
      } else {
        setOrbitRadius(205);
      }
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  // 3D Tilt calculation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsPaused(false);
    setHoveredTech(null);
  };

  // Continuous smooth orbital rotation loop
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused) {
        // Smooth rotation (~18 degrees per second)
        setCurrentAngle((prev) => (prev + delta * 18) % 360);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[560px] aspect-square relative flex items-center justify-center select-none mx-auto"
    >
      {/* Background Radial Dot Matrix Grid (Direct in background, no outer bounding box) */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.35) 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "center center",
          maskImage: "radial-gradient(circle at center, black 45%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 45%, transparent 80%)",
        }}
      />

      {/* Soft Ambient Radial Backing Aurora Glow */}
      <div
        className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] lg:w-[480px] lg:h-[480px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.2)_0%,rgba(34,211,238,0.14)_45%,transparent_70%)] blur-3xl pointer-events-none -z-10"
        style={{
          backgroundColor: hoveredTech
            ? `${ORBIT_ICONS.find((t) => t.key === hoveredTech)?.color}15`
            : undefined,
          transition: "background-color 0.4s ease",
        }}
      />

      {/* Floating Code Tag: const developer = "Naday"; */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-2 left-2 sm:-top-2 sm:left-4 z-40 px-4 py-2 rounded-2xl bg-[#0a0f20]/90 backdrop-blur-xl border border-white/20 shadow-2xl font-mono text-xs sm:text-sm text-zinc-300 pointer-events-none"
        style={{ transform: "translateZ(40px)" }}
      >
        <span className="text-violet-400 font-medium">const</span>{" "}
        <span className="text-cyan-300 font-semibold">developer</span> ={" "}
        <span className="text-emerald-400 font-medium">"Naday"</span>;
      </motion.div>

      {/* Floating Open-To-Work Chip */}
      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
        className="absolute bottom-2 right-2 sm:-bottom-2 sm:right-4 z-40 px-3.5 py-1.5 rounded-full bg-[#0a0f20]/90 backdrop-blur-xl border border-cyan-400/40 shadow-2xl flex items-center gap-2 pointer-events-none"
        style={{ transform: "translateZ(45px)" }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <span className="text-xs font-mono font-medium text-cyan-200">
          React · Open to work
        </span>
      </motion.div>

      {/* Exact Circular Orbit Track Guide Ring (Matches orbitRadius identically) */}
      <div
        className="absolute rounded-full border border-white/20 border-dashed pointer-events-none"
        style={{
          width: `${orbitRadius * 2}px`,
          height: `${orbitRadius * 2}px`,
        }}
      />

      {/* Concentric Subtle Inner/Outer Guide Rings */}
      <div
        className="absolute rounded-full border border-cyan-400/15 pointer-events-none animate-pulse"
        style={{
          width: `${orbitRadius * 2 + 10}px`,
          height: `${orbitRadius * 2 + 10}px`,
        }}
      />

      {/* Center Portal: Large Framed Profile Picture of Naday */}
      <div
        className="relative z-20 w-[130px] h-[130px] sm:w-[155px] sm:h-[155px] lg:w-[175px] lg:h-[175px] rounded-full p-[4px] bg-gradient-to-tr from-[#bef264] via-[#22d3ee] to-[#8b5cf6] shadow-[0_0_36px_rgba(190,242,100,0.5)] transition-all duration-500 hover:scale-105 group"
        style={{ transform: "translateZ(30px)" }}
      >
        {/* Inner dark circle with profile image */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#060913] border-4 border-[#090e1f] relative">
          <img
            src={profilePic}
            alt="Naday Abbas - Web Developer"
            className="w-full h-full object-cover object-top grayscale contrast-110 brightness-95 group-hover:grayscale-[15%] group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060913]/65 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Floating Live DEV Status Pill on avatar */}
        <div className="absolute -bottom-1 -right-1 z-30 px-2.5 py-0.5 rounded-full bg-[#0a0f20]/95 border border-[#bef264]/70 text-[10px] sm:text-[11px] font-mono font-bold text-[#bef264] flex items-center gap-1.5 shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#bef264] animate-ping" />
          <span>&lt;DEV /&gt;</span>
        </div>
      </div>

      {/* 8 Orbiting Tech Badges Exactly Centered on the Orbit Line */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transform: "translateZ(20px)" }}
      >
        {ORBIT_ICONS.map((tech, index) => {
          const IconComponent = tech.icon;

          // Mathematical Angle along the circle
          const angleDeg = (currentAngle + (index * 360) / ORBIT_ICONS.length) % 360;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Exact X & Y coordinates centered on the orbit line
          const x = Math.cos(angleRad) * orbitRadius;
          const y = Math.sin(angleRad) * orbitRadius;

          const isHovered = hoveredTech === tech.key;

          return (
            <div
              key={tech.key}
              onMouseEnter={() => {
                setIsPaused(true);
                setHoveredTech(tech.key);
              }}
              onMouseLeave={() => {
                setIsPaused(false);
                setHoveredTech(null);
              }}
              className="absolute pointer-events-auto cursor-pointer transition-transform duration-300"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) scale(${isHovered ? 1.28 : 1})`,
                zIndex: isHovered ? 50 : 25,
              }}
            >
              {/* Circular High-DPI Glass Badge */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-15 lg:h-15 rounded-full bg-[#0b1022]/90 border backdrop-blur-xl flex items-center justify-center p-2.5 sm:p-3 shadow-xl transition-all duration-300 group"
                style={{
                  borderColor: isHovered ? tech.color : "rgba(255, 255, 255, 0.22)",
                  boxShadow: isHovered
                    ? `0 0 24px ${tech.color}95, 0 4px 16px rgba(0,0,0,0.6)`
                    : "0 6px 16px rgba(0, 0, 0, 0.45)",
                }}
              >
                <IconComponent
                  className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                  style={{ color: tech.color }}
                />
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-[#060913]/95 border text-xs font-mono text-white whitespace-nowrap shadow-2xl pointer-events-none flex items-center gap-1.5"
                  style={{ borderColor: tech.color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  <span>{tech.label}</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
