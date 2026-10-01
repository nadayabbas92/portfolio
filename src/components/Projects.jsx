import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { PROJECTS } from "../constants";
import { FiExternalLink, FiGithub, FiLayers, FiGlobe } from "react-icons/fi";

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  // 3D Tilt calculation & light-follow glare
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 26 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 26 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);

    setGlare({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  // Only Movie Flix (index 0) gets the Featured badge as explicitly requested
  const isFeatured = index === 0;

  // Extract clean host name for browser mockup address bar
  let displayHost = "project.app";
  try {
    const url = new URL(project.liveUrl);
    displayHost = url.hostname.replace("www.", "");
  } catch {
    displayHost = "project.app";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        className="p-6 sm:p-8 rounded-3xl bg-[#0d1428]/80 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all duration-300 shadow-2xl overflow-hidden relative"
      >
        {/* Violet to Cyan glow on hover */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Dynamic Light-Follow Glare Highlight */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}) 0%, transparent 60%)`,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Real Screenshot inside Browser-Window Mockup Frame with Depth Parallax */}
          <div
            className="lg:col-span-6 relative overflow-hidden rounded-2xl border border-white/15 bg-[#060913] shadow-xl group-hover:border-cyan-400/50 transition-colors"
            style={{ transform: "translateZ(20px)" }}
          >
            {/* Browser Header Bar */}
            <div className="px-4 py-2.5 bg-[#0a0f1d] border-b border-white/10 flex items-center justify-between gap-3">
              {/* Traffic light window dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              {/* URL Address Bar */}
              <div className="flex-1 max-w-[260px] mx-auto px-3 py-0.5 rounded-md bg-black/40 border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center justify-center gap-1.5 truncate">
                <FiGlobe className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{displayHost}</span>
              </div>

              <div className="w-8" />
            </div>

            {/* Screenshot Image with Parallax & Hover Zoom */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#070b16]">
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060913]/70 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Details & Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                <FiLayers className="w-3.5 h-3.5" />
                <span>Project 0{index + 1}</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2.5">
              {project.title}
            </h3>

            {/* Project Tagline */}
            <p className="text-base text-zinc-200 font-medium mb-4">
              {project.tagline}
            </p>

            {/* What I Built */}
            <div className="mb-5 p-4 rounded-xl bg-black/40 border border-white/10 shadow-inner">
              <p className="text-xs uppercase font-mono text-zinc-400 font-semibold mb-1">
                What I Built
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.whatIBuilt}
              </p>
            </div>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 mb-7">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-[#131b35] text-zinc-200 border border-white/10 group-hover:border-cyan-400/30 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Actions: Live Demo + GitHub opening in new tab */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-medium shadow-md shadow-violet-600/30 hover:shadow-cyan-500/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>Live Demo</span>
                <FiExternalLink className="w-4 h-4" />
              </a>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0a0f1d] hover:bg-[#151e36] text-zinc-200 hover:text-white text-sm font-medium border border-white/15 hover:border-cyan-400/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <FiGithub className="w-4 h-4 text-zinc-300" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-violet-600/8 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header with shortened concise intro */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0d1428] border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Showcase</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Featured Projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base text-zinc-300"
          >
            A selection of frontend web applications I've designed and developed.
          </motion.p>
        </div>

        {/* Project Cards Stack */}
        <div className="space-y-12">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
