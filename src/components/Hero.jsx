import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PERSONAL_INFO } from "../constants";
import MagneticButton from "./MagneticButton";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { FiDownload, FiArrowDown, FiMapPin } from "react-icons/fi";
import HeroTechOrbitCard from "./HeroTechOrbitCard";

const ROTATING_TAGLINES = [
  "Building clean interfaces",
  "Crafting responsive UIs with React",
  "Always learning",
];

export default function Hero() {
  // Typewriter effect state
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentFullText = ROTATING_TAGLINES[taglineIdx];

    if (!isDeleting) {
      if (displayedText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, 65);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setTaglineIdx((prev) => (prev + 1) % ROTATING_TAGLINES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, taglineIdx]);

  const scrollToProjects = (e) => {
    e.preventDefault();
    const target = document.querySelector("#projects");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPlay = (e) => {
    e.preventDefault();
    const target = document.querySelector("#game");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="about"
      className="relative min-h-[95vh] lg:min-h-[100dvh] flex flex-col justify-center pt-24 pb-12 overflow-hidden"
    >
      {/* Soft Ambient Aurora Mesh Glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[450px] bg-gradient-to-r from-violet-600/10 via-cyan-500/8 to-transparent blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-6 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Bio & Info */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Availability Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0d1428]/90 border border-cyan-400/30 backdrop-blur-md mb-5 shadow-lg shadow-violet-950/40"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-cyan-300">
                {PERSONAL_INFO.availability}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <FiMapPin className="w-3.5 h-3.5 text-cyan-400" />
                {PERSONAL_INFO.location}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-2"
            >
              Naday Abbas
            </motion.h1>

            {/* Role with Animated Gradient */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-3"
            >
              <span className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-300 bg-clip-text text-transparent animate-gradient-text">
                {PERSONAL_INFO.role}
              </span>
            </motion.div>

            {/* Typewriter Tagline with Blinking Cursor (Fixed cleanly) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-8 mb-4 flex items-center"
            >
              <span className="text-sm sm:text-base font-mono text-cyan-300/90 font-medium">
                {displayedText}
              </span>
              <span className="w-2 h-4 bg-cyan-400 ml-1 inline-block animate-pulse" />
            </motion.div>

            {/* Short Bio */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl mb-7 font-normal"
            >
              {PERSONAL_INFO.bio}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto"
            >
              <MagneticButton
                href="#projects"
                onClick={scrollToProjects}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium text-base shadow-lg shadow-violet-600/30 hover:shadow-cyan-500/40 transition-all border border-violet-400/30 group"
              >
                <span>View Projects</span>
                <FiArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </MagneticButton>

              <MagneticButton
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Naday_Abbas_Resume.pdf"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0d1428] hover:bg-[#131b35] text-zinc-200 hover:text-white font-medium text-base border border-white/15 hover:border-cyan-400/50 transition-all shadow-md group"
              >
                <FiDownload className="mr-2 w-4 h-4 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download Resume</span>
              </MagneticButton>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-3 text-zinc-300"
            >
              <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 font-semibold mr-2">
                Connect
              </span>
              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2.5 rounded-full bg-[#0d1428] hover:bg-violet-600/25 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2.5 rounded-full bg-[#0d1428] hover:bg-violet-600/25 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href={PERSONAL_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="p-2.5 rounded-full bg-[#0d1428] hover:bg-violet-600/25 text-zinc-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Hero Orbit Card + Math Code Snippet from Reference Image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Soft Ambient Radial Backing Glow */}
            <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18)_0%,rgba(34,211,238,0.12)_45%,transparent_70%)] blur-3xl pointer-events-none -z-10" />

            {/* Central Picture with Orbiting Tech Badges & Code Terminal */}
            <HeroTechOrbitCard />
          </div>
        </div>
      </div>
    </section>
  );
}
