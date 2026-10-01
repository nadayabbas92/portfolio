import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageIntro({ onComplete }) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#060913]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-1"
            >
              <span>Naday</span>
              <span className="text-cyan-400">.</span>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "90px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
              className="h-[2.5px] bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-400 mt-3 rounded-full shadow-[0_0_10px_#22d3ee]"
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-xs uppercase tracking-widest text-cyan-300/80 mt-2.5 font-mono"
            >
              Web Developer
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
