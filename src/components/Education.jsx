import { motion } from "framer-motion";
import { FiBookOpen, FiCalendar, FiCheckCircle, FiClock, FiAward } from "react-icons/fi";

export default function Education() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
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
    <section id="education" className="py-24 relative overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute top-1/2 right-1/4 w-[550px] h-[320px] bg-gradient-to-r from-violet-600/8 via-cyan-500/8 to-transparent blur-[130px] rounded-full pointer-events-none" />

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
            <span>Academic Background</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3"
          >
            Education
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base text-zinc-300"
          >
            Formal software engineering degree and technical web coursework.
          </motion.p>
        </div>

        {/* Chronological Connector Track (Desktop) */}
        <div className="relative mb-6 hidden lg:flex items-center justify-between px-10">
          <div className="h-[2px] w-full bg-gradient-to-r from-violet-500/20 via-cyan-400/40 to-violet-500/40 rounded-full relative">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 shadow-[0_0_10px_#22d3ee]"
            />
          </div>
        </div>

        {/* Visual Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
        >
          {/* 1. Large Featured Bento Card (Spans 2 Columns): Bachelors */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="lg:col-span-2 rounded-3xl p-7 sm:p-9 bg-[#0d1428]/80 border border-cyan-400/30 hover:border-cyan-400/60 backdrop-blur-xl shadow-2xl transition-all relative overflow-hidden group flex flex-col justify-between"
          >
            {/* Soft Ambient Backing Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-cyan-500/15 via-violet-600/15 to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <FiBookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                    Degree Program
                  </span>
                </div>

                {/* Status Chip: "In progress" */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-medium shadow-sm">
                  <FiClock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
                  <span>In progress</span>
                </div>
              </div>

              {/* Degree Title */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors mb-2">
                Bachelors in Software Engineering
              </h3>

              {/* Institution */}
              <p className="text-lg text-zinc-200 font-medium mb-6">
                Sir Syed University
              </p>
            </div>

            {/* Progress Metric toward 2026 Graduation */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 mt-4">
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="text-zinc-400">Academic Trajectory</span>
                <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-cyan-400" />
                  Graduation 2026
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "75%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-2">
                <span>Core Curriculum & Labs</span>
                <span className="text-cyan-400 font-medium">Final Phase</span>
              </div>
            </div>
          </motion.div>

          {/* 2 & 3. Vertical Stack of 2 Smaller Bento Cards (Beside/below) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Card 2: Smart Web Designing (Course) */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-3xl p-6 sm:p-7 bg-[#0d1428]/70 border border-white/10 hover:border-violet-500/40 backdrop-blur-xl shadow-xl transition-all relative overflow-hidden group flex flex-col justify-between flex-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  {/* Labeled as Course (not Degree) */}
                  <span className="text-xs font-mono uppercase tracking-wider text-violet-300 font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30">
                    Course
                  </span>
                  <span className="text-xs font-mono text-zinc-300 flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                    <FiCalendar className="w-3.5 h-3.5 text-cyan-400" />
                    2023–2024
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                  Smart Web Designing
                </h3>
                <p className="text-sm text-zinc-300">
                  Malaysian Learning Hub
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Certification</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5" />
                  Completed
                </span>
              </div>
            </motion.div>

            {/* Card 3: Intermediate (Intermediate) */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-3xl p-6 sm:p-7 bg-[#0d1428]/70 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl shadow-xl transition-all relative overflow-hidden group flex flex-col justify-between flex-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  {/* Labeled as Intermediate */}
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30">
                    Intermediate
                  </span>
                  <span className="text-xs font-mono text-zinc-300 flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                    <FiCalendar className="w-3.5 h-3.5 text-cyan-400" />
                    2019–2020
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                  Intermediate
                </h3>
                <p className="text-sm text-zinc-300">
                  Bahria Foundation College Kandiaro
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Pre-Engineering</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5" />
                  Completed
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
