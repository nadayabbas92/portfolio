import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { RiReactjsLine, RiHtml5Line } from "react-icons/ri";
import { DiJavascript1 } from "react-icons/di";
import { TbBrandTailwind } from "react-icons/tb";
import { FaCss3Alt, FaGithub, FaGitAlt } from "react-icons/fa6";

const SkillsCanvas = lazy(() => import("./SkillsCanvas"));

const SKILL_ICONS = {
  React: <RiReactjsLine className="w-9 h-9 text-cyan-400 group-hover:scale-110 transition-transform" />,
  JavaScript: <DiJavascript1 className="w-9 h-9 text-yellow-400 group-hover:scale-110 transition-transform" />,
  "Tailwind CSS": <TbBrandTailwind className="w-9 h-9 text-cyan-300 group-hover:scale-110 transition-transform" />,
  HTML: <RiHtml5Line className="w-9 h-9 text-orange-500 group-hover:scale-110 transition-transform" />,
  CSS: <FaCss3Alt className="w-9 h-9 text-blue-500 group-hover:scale-110 transition-transform" />,
  Git: <FaGitAlt className="w-9 h-9 text-red-500 group-hover:scale-110 transition-transform" />,
  GitHub: <FaGithub className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />,
};

const SKILLS_DATA = [
  {
    name: "React",
    badge: "Frontend",
    desc: "Building interactive component-based user interfaces and managing state with hooks.",
    featured: true,
  },
  {
    name: "JavaScript",
    badge: "Frontend",
    desc: "Writing modern ES6+ application logic, event handling, and data transformations.",
  },
  {
    name: "Tailwind CSS",
    badge: "Frontend",
    desc: "Crafting clean, responsive mobile-first layouts with utility classes.",
  },
  {
    name: "HTML",
    badge: "Frontend",
    desc: "Structuring clean, semantic, accessible content for web pages.",
  },
  {
    name: "CSS",
    badge: "Frontend",
    desc: "Styling layouts with modern Flexbox, Grid, transitions, and media queries.",
  },
  {
    name: "Git",
    badge: "Tools",
    desc: "Tracking changes, managing commits, and handling branching workflows.",
  },
  {
    name: "GitHub",
    badge: "Tools",
    desc: "Hosting code repositories, tracking issues, and managing deployments.",
  },
];

export default function Technologies() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* 3D Floating Translucent Glass Shapes Drifting Background with Mouse Parallax */}
      <Suspense fallback={null}>
        <SkillsCanvas />
      </Suspense>

      {/* Soft Ambient Aurora Accents (Non-clipping) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-violet-600/10 via-cyan-500/8 to-transparent blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0d1428] border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Tech Stack</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3"
          >
            Technologies
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base text-zinc-300"
          >
            The focused frontend and workflow tools I use to build responsive user experiences.
          </motion.p>
        </div>

        {/* Balanced Grid: 7 Skills filling 8 slots (React spans 2), equal heights, single badge, no overflowing footers */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
        >
          {SKILLS_DATA.map((skill) => {
            const isFeatured = skill.featured;

            return (
              <motion.div
                key={skill.name}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`animated-gradient-border p-6 rounded-2xl transition-all duration-300 group shadow-lg flex flex-col justify-between h-full ${
                  isFeatured ? "lg:col-span-2" : "lg:col-span-1"
                }`}
              >
                <div>
                  {/* Top Bar with Icon & SINGLE Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 group-hover:border-cyan-400/40 transition-colors shadow-inner">
                      {SKILL_ICONS[skill.name]}
                    </div>
                    {/* Exactly one badge per card to prevent crowding and overflow */}
                    <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                      {skill.badge}
                    </span>
                  </div>

                  {/* Skill Name */}
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {skill.name}
                  </h3>

                  {/* Short honest description */}
                  <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                    {skill.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
