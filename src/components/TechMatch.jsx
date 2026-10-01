import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRotateCcw, FiSend, FiAward } from "react-icons/fi";
import { BRAND_LOGOS } from "./brandLogos";

// 6 official technology keys to make 6 pairs (12 cards in a 4x3 grid)
const TECH_KEYS = ["React", "JavaScript", "HTML5", "CSS3", "Tailwind", "Git"];

function createShuffledDeck() {
  const cards = [];
  TECH_KEYS.forEach((key) => {
    const item = BRAND_LOGOS[key];
    cards.push({
      key,
      name: item.name,
      color: item.color,
      svg: item.svg,
    });
    cards.push({
      key,
      name: item.name,
      color: item.color,
      svg: item.svg,
    });
  });

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards.map((card, idx) => ({ ...card, id: idx }));
}

// Particle colors for celebration burst
const CONFETTI_COLORS = ["#8B5CF6", "#22D3EE", "#A78BFA", "#38BDF8", "#F472B6", "#34D399"];

function ConfettiBurst() {
  const particles = Array.from({ length: 32 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360 + (Math.random() * 20 - 10);
        const rad = (angle * Math.PI) / 180;
        const dist = 70 + Math.random() * 120;
        const x = Math.cos(rad) * dist;
        const y = Math.sin(rad) * dist - 20;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const size = 6 + Math.random() * 6;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x,
              y,
              scale: [0, 1.2, 0.8],
              opacity: [1, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 1.1 + Math.random() * 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: i % 2 === 0 ? "50%" : "2px",
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function TechMatch() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [bestMoves, setBestMoves] = useState(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const timerRef = useRef(null);
  const hasStartedRef = useRef(false);

  // Initialize deck and load best score
  useEffect(() => {
    setCards(createShuffledDeck());
    try {
      const saved = localStorage.getItem("naday_tech_match_best");
      if (saved) {
        setBestMoves(parseInt(saved, 10));
      }
    } catch {
      // LocalStorage fallback
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  // Timer loop
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  // Restart handler
  const handleRestart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    hasStartedRef.current = false;
    setCards(createShuffledDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setTimerRunning(false);
    setIsChecking(false);
    setIsWon(false);
    setIsNewBest(false);
  }, []);

  // Card click handler
  const handleCardClick = (id) => {
    // Prevent interaction if checking, already face-up, or game completed
    if (isChecking || isWon) return;
    if (flipped.includes(id) || matched.includes(id)) return;

    // Start timer on first card click
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      setTimerRunning(true);
    }

    if (flipped.length === 0) {
      setFlipped([id]);
    } else if (flipped.length === 1) {
      const firstId = flipped[0];
      const secondId = id;
      setFlipped([firstId, secondId]);
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.key === secondCard.key) {
        // Matched!
        const nextMatched = [...matched, firstId, secondId];
        setMatched(nextMatched);
        setFlipped([]);

        // Check win condition (all 12 cards matched)
        if (nextMatched.length === 12) {
          setTimerRunning(false);
          setIsWon(true);

          let isRecord = false;
          if (bestMoves === null || nextMoves < bestMoves) {
            setBestMoves(nextMoves);
            setIsNewBest(true);
            isRecord = true;
            try {
              localStorage.setItem("naday_tech_match_best", String(nextMoves));
            } catch {
              // LocalStorage fallback
            }
          }
        }
      } else {
        // Mismatch: flip back after ~700ms
        setIsChecking(true);
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 700);
      }
    }
  };

  const handleHireClick = (e) => {
    e.preventDefault();
    const contactElem = document.querySelector("#contact");
    if (contactElem) {
      const topOffset = 75;
      const elementPosition = contactElem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs.toString().padStart(2, "0")}`;
  };

  return (
    <section id="game" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Subtle background neural grid pattern */}
      <div
        className="absolute inset-0 bg-neural-pattern opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Soft Aurora Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] bg-gradient-to-r from-violet-600/10 via-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[520px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Simple One-line Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Before you go, play a quick round.
          </h2>
        </div>

        {/* Slim Single-Line Status Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#0a0f20]/80 border border-white/10 backdrop-blur-md mb-4 text-xs sm:text-sm font-mono text-zinc-300 shadow-lg">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider">Moves:</span>
              <span className="text-cyan-300 font-bold">{moves}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider">Time:</span>
              <span className="text-zinc-100 font-semibold">{formatTime(time)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider">Best:</span>
              <span className="text-amber-400 font-bold">
                {bestMoves !== null ? `${bestMoves} moves` : "—"}
              </span>
            </div>
          </div>

          {/* Small Restart Icon Button */}
          <button
            onClick={handleRestart}
            aria-label="Restart game"
            title="Restart game"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-cyan-300 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"
          >
            <FiRotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Game Card Grid Container */}
        <div className="relative rounded-3xl p-3 sm:p-4 bg-[#0a0f20]/85 border border-white/10 backdrop-blur-xl shadow-2xl">
          {/* 4x3 Grid (12 Cards) */}
          <div
            className="grid grid-cols-4 gap-2.5 sm:gap-3.5"
            role="grid"
            aria-label="Tech Match Memory Card Grid"
          >
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id);
              const isMatched = matched.includes(card.id);
              const isFaceUp = isFlipped || isMatched;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleCardClick(card.id)}
                  disabled={isFaceUp || isChecking}
                  aria-label={
                    isFaceUp ? `${card.name} card, matched` : `Card ${card.id + 1}, face down`
                  }
                  aria-pressed={isFaceUp}
                  className={`relative aspect-[4/3] sm:aspect-square w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all select-none ${
                    !isFaceUp && !isChecking
                      ? "hover:scale-[1.03] active:scale-95 cursor-pointer group"
                      : "cursor-default"
                  }`}
                  style={{
                    perspective: "1000px",
                  }}
                >
                  <div
                    className="w-full h-full relative"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: reducedMotion
                        ? "opacity 300ms ease"
                        : "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: reducedMotion
                        ? "none"
                        : isFaceUp
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    {/* Card Back Face: Dark glass with violet-to-cyan gradient border & "NA." mark */}
                    <div
                      className={`absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-violet-600/40 via-cyan-400/35 to-violet-500/25 shadow-md transition-all duration-300 ${
                        !isFaceUp ? "group-hover:from-violet-500/70 group-hover:to-cyan-400/60" : ""
                      }`}
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        opacity: reducedMotion ? (isFaceUp ? 0 : 1) : 1,
                        pointerEvents: isFaceUp ? "none" : "auto",
                      }}
                    >
                      <div className="w-full h-full rounded-[15px] bg-[#090e1f]/95 backdrop-blur-md flex items-center justify-center">
                        <span className="font-mono font-bold text-xs sm:text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 select-none">
                          NA.
                        </span>
                      </div>
                    </div>

                    {/* Card Front Face: Dark glass with official logo & soft glow */}
                    <div
                      className={`absolute inset-0 rounded-2xl p-[1px] transition-all duration-300 ${
                        isMatched
                          ? "bg-gradient-to-br from-cyan-400 via-teal-400 to-violet-400 shadow-lg shadow-cyan-500/20"
                          : "bg-gradient-to-br from-white/25 via-white/10 to-transparent shadow-md"
                      }`}
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: reducedMotion ? "none" : "rotateY(180deg)",
                        opacity: reducedMotion ? (isFaceUp ? 1 : 0) : 1,
                      }}
                    >
                      <div
                        className={`w-full h-full rounded-[15px] bg-[#080d1d]/95 backdrop-blur-md flex items-center justify-center p-2 relative overflow-hidden transition-transform duration-300 ${
                          isMatched ? "scale-[0.98]" : ""
                        }`}
                      >
                        {/* Soft subtle colored ambient glow matching brand */}
                        <div
                          className="absolute inset-0 opacity-20 pointer-events-none rounded-[15px] blur-md"
                          style={{ backgroundColor: card.color }}
                        />

                        {/* Official vector brand logo */}
                        <div
                          className="w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center relative z-10 [&>svg]:w-full [&>svg]:h-full"
                          style={{ filter: `drop-shadow(0 0 10px ${card.color}90)` }}
                          dangerouslySetInnerHTML={{ __html: card.svg }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Inline Celebration Win Modal */}
          <AnimatePresence>
            {isWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-2 sm:inset-3 rounded-2xl bg-[#060913]/92 backdrop-blur-xl border border-cyan-400/40 p-6 flex flex-col items-center justify-center text-center z-20 shadow-2xl"
              >
                {/* Confetti Particle Burst */}
                {!reducedMotion && <ConfettiBurst />}

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 p-0.5 mb-3 shadow-lg shadow-cyan-500/30 flex items-center justify-center"
                >
                  <div className="w-full h-full rounded-full bg-[#060913] flex items-center justify-center text-cyan-300">
                    <FiAward className="w-6 h-6" />
                  </div>
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Tech Matched!</h3>

                <p className="text-sm font-mono text-zinc-300 mb-1">
                  Done in <span className="text-cyan-300 font-semibold">{moves} moves</span>,{" "}
                  <span className="text-violet-300 font-semibold">{time} seconds</span>
                </p>

                {isNewBest && (
                  <span className="inline-block px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-medium mb-5">
                    ★ New Personal Best!
                  </span>
                )}

                {!isNewBest && <div className="mb-4" />}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs relative z-30">
                  <button
                    onClick={handleRestart}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"
                  >
                    <FiRotateCcw className="w-4 h-4" />
                    <span>Play again</span>
                  </button>

                  <a
                    href="#contact"
                    onClick={handleHireClick}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0d1428] hover:bg-[#131b35] text-cyan-300 hover:text-white border border-cyan-400/40 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"
                  >
                    <FiSend className="w-3.5 h-3.5" />
                    <span>Hire me</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
