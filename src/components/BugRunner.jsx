import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRotateCcw, FiSend, FiVolume2, FiVolumeX, FiAward, FiZap } from "react-icons/fi";

// Sound Synthesizer via Web Audio API (zero external assets)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (!muted) this.init();
  }

  playJump() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // Audio safety fallback
    }
  }

  playCollect() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.06); // A5
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.19);
    } catch {
      // Audio safety fallback
    }
  }

  playPowerup() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.14, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.05 + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.13);
      });
    } catch {
      // Audio safety fallback
    }
  }

  playCrash() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.26);
    } catch {
      // Audio safety fallback
    }
  }

  playSquash() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.1);
    } catch {
      // Audio safety fallback
    }
  }
}

const COLLECTIBLE_TYPES = [
  { name: "React", color: "#61DAFB", points: 50, symbol: "⚛" },
  { name: "JS", color: "#F7DF1E", points: 50, symbol: "JS" },
  { name: "TS", color: "#3178C6", points: 50, symbol: "TS" },
  { name: "Tailwind", color: "#38BDF8", points: 50, symbol: "≈" },
  { name: "HTML5", color: "#E34F26", points: 50, symbol: "5" },
  { name: "CSS3", color: "#1572B6", points: 50, symbol: "3" },
  { name: "Git", color: "#F05032", points: 50, symbol: "⎇" },
];

export default function BugRunner() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const soundRef = useRef(new SoundFX());

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState("idle"); // 'idle' | 'playing' | 'gameover'
  const [isMuted, setIsMuted] = useState(true);
  const [invincibleTimeLeft, setInvincibleTimeLeft] = useState(0);

  const gameStateRef = useRef("idle");
  const isReducedMotionRef = useRef(false);
  const isInViewRef = useRef(true);

  // Keep state ref in sync
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Load high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("naday_bug_runner_best");
      if (saved) {
        setBestScore(parseInt(saved, 10));
      }
    } catch {
      // LocalStorage fallback
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotionRef.current = mediaQuery.matches;
    const handleMotionChange = (e) => (isReducedMotionRef.current = e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => mediaQuery.removeEventListener("change", handleMotionChange);
  }, []);

  // Sound toggle
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundRef.current.setMuted(nextMuted);
  };

  // Scroll to contact for Hire Me CTA
  const scrollToContact = (e) => {
    e.preventDefault();
    const contactElem = document.querySelector("#contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Game Engine Ref
  const gameRef = useRef({
    // Canvas dimensions
    width: 760,
    height: 250,
    dpr: 1,

    // Timing
    lastTime: 0,
    elapsed: 0,
    gameSpeed: 280, // px per second

    // Player
    player: {
      x: 70,
      y: 0,
      width: 28,
      height: 42,
      vy: 0,
      isGrounded: true,
      isDucking: false,
      jumpHoldTimer: 0,
      runFrame: 0,
      invincibleUntil: 0,
    },

    // Entities
    obstacles: [],
    collectibles: [],
    particles: [],
    toasts: [],
    stars: [],

    // Spawning timers
    obstacleTimer: 1.5,
    collectibleTimer: 2.2,
    powerupTimer: 14.0,

    // Screen Shake & Glitch
    shakeMagnitude: 0,
    glitchFlash: 0,

    // Controls
    keys: {
      jump: false,
      duck: false,
    },
  });

  // Start game action
  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.player.y = 0;
    g.player.vy = 0;
    g.player.isGrounded = true;
    g.player.isDucking = false;
    g.player.invincibleUntil = 0;
    g.obstacles = [];
    g.collectibles = [];
    g.toasts = [];
    g.particles = [];
    g.gameSpeed = 280;
    g.obstacleTimer = 1.2;
    g.collectibleTimer = 1.8;
    g.powerupTimer = 12.0;
    g.shakeMagnitude = 0;
    g.glitchFlash = 0;

    setScore(0);
    setInvincibleTimeLeft(0);
    setGameState("playing");
    soundRef.current.playJump();
  }, []);

  // Jump trigger
  const triggerJump = useCallback(() => {
    const g = gameRef.current;
    if (gameStateRef.current === "idle" || gameStateRef.current === "gameover") {
      startGame();
      return;
    }

    if (g.player.isGrounded && !g.player.isDucking) {
      g.player.vy = -470;
      g.player.isGrounded = false;
      g.player.jumpHoldTimer = 0.22;
      soundRef.current.playJump();

      // Jump dust particles
      for (let i = 0; i < 7; i++) {
        g.particles.push({
          x: g.player.x + 14,
          y: g.height - 42,
          vx: (Math.random() - 0.7) * 90,
          vy: -Math.random() * 60,
          color: "#22d3ee",
          size: 2 + Math.random() * 3,
          alpha: 0.8,
          life: 0.35,
        });
      }
    }
  }, [startGame]);

  // Duck trigger
  const setDucking = useCallback((ducking) => {
    const g = gameRef.current;
    if (gameStateRef.current === "playing") {
      g.player.isDucking = ducking;
    }
  }, []);

  // Keyboard controls with selective event prevention
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only capture when section is hovered/active or playing
      const isSpace = e.code === "Space";
      const isUp = e.code === "ArrowUp" || e.code === "KeyW";
      const isDown = e.code === "ArrowDown" || e.code === "KeyS";

      if (isSpace || isUp) {
        if (isInViewRef.current) {
          e.preventDefault();
        }
        gameRef.current.keys.jump = true;
        triggerJump();
      } else if (isDown) {
        if (isInViewRef.current) {
          e.preventDefault();
        }
        gameRef.current.keys.duck = true;
        setDucking(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        gameRef.current.keys.jump = false;
        gameRef.current.player.jumpHoldTimer = 0;
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        gameRef.current.keys.duck = false;
        setDucking(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [triggerJump, setDucking]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = null;
    const g = gameRef.current;

    // Build parallax starfield
    g.stars = Array.from({ length: 42 }, () => ({
      x: Math.random() * 760,
      y: Math.random() * 180,
      size: Math.random() * 1.8 + 0.5,
      speedMult: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      g.width = Math.floor(rect.width);
      g.height = Math.floor(rect.height);
      g.dpr = dpr;

      canvas.width = g.width * dpr;
      canvas.height = g.height * dpr;
    };

    resize();
    window.addEventListener("resize", resize);

    // Visibility management (Pause when offscreen/tab hidden)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isInViewRef.current = false;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Physics constants
    const gravity = 1380;
    const groundYOffset = 42; // Distance from bottom to floor

    let scoreAccumulator = 0;

    const tick = (now) => {
      if (!g.lastTime) g.lastTime = now;
      let dt = Math.min((now - g.lastTime) / 1000, 0.08); // cap delta-time
      g.lastTime = now;

      if (isInViewRef.current) {
        g.elapsed += dt;

        const groundLevel = g.height - groundYOffset;
        const isPlaying = gameStateRef.current === "playing";
        const isIdle = gameStateRef.current === "idle";

        // Current theme hue transition every 500 points
        const cycleProgress = (scoreAccumulator % 1000) / 1000;
        const isCyanPhase = cycleProgress < 0.5;

        // Base scroll speed
        const speed = isPlaying ? g.gameSpeed : 140;

        // 1. UPDATE GAME STATE
        if (isPlaying) {
          // Increase score with distance
          scoreAccumulator += dt * 14;
          const currentScoreInt = Math.floor(scoreAccumulator);
          setScore(currentScoreInt);

          // Speed scaling
          g.gameSpeed = Math.min(540, 280 + currentScoreInt * 0.22);

          // Invincibility countdown
          if (g.player.invincibleUntil > g.elapsed) {
            setInvincibleTimeLeft(Math.ceil(g.player.invincibleUntil - g.elapsed));
          } else {
            setInvincibleTimeLeft(0);
          }

          // 2. SPAWN OBSTACLES
          g.obstacleTimer -= dt;
          if (g.obstacleTimer <= 0) {
            const types = ["bug", "error_block", "drone_404"];
            // Early game spawns bugs/errors; 404 drones appear after score 100
            const allowedTypes = currentScoreInt > 100 ? types : ["bug", "error_block"];
            const chosenType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];

            if (chosenType === "bug") {
              g.obstacles.push({
                type: "bug",
                x: g.width + 30,
                y: groundLevel - 20,
                width: 24,
                height: 20,
                anim: 0,
              });
            } else if (chosenType === "error_block") {
              g.obstacles.push({
                type: "error_block",
                x: g.width + 30,
                y: groundLevel - 34,
                width: 26,
                height: 34,
                glitchTimer: 0,
              });
            } else if (chosenType === "drone_404") {
              // Drone floats at head height requiring ducking
              g.obstacles.push({
                type: "drone_404",
                x: g.width + 30,
                y: groundLevel - 46,
                width: 32,
                height: 20,
                anim: 0,
              });
            }

            // Next spawn timer based on speed (randomized gap)
            g.obstacleTimer = 1.35 + Math.random() * 1.4 - Math.min(0.6, currentScoreInt * 0.0006);
          }

          // 3. SPAWN COLLECTIBLES
          g.collectibleTimer -= dt;
          if (g.collectibleTimer <= 0) {
            const item = COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];
            // Float either at jump height or floor height
            const floatY = Math.random() > 0.4 ? groundLevel - 65 : groundLevel - 25;
            g.collectibles.push({
              type: "logo",
              data: item,
              x: g.width + 20,
              y: floatY,
              size: 22,
              anim: 0,
            });
            g.collectibleTimer = 2.2 + Math.random() * 2.5;
          }

          // 4. SPAWN POWERUP (Coffee)
          g.powerupTimer -= dt;
          if (g.powerupTimer <= 0) {
            g.collectibles.push({
              type: "coffee",
              data: { name: "Coffee", color: "#f59e0b", points: 100, symbol: "☕" },
              x: g.width + 30,
              y: groundLevel - 60,
              size: 24,
              anim: 0,
            });
            g.powerupTimer = 18.0 + Math.random() * 10.0;
          }
        }

        // PLAYER PHYSICS
        const p = g.player;

        // Variable height jump boost
        if (g.keys.jump && p.jumpHoldTimer > 0) {
          p.vy -= 180 * dt;
          p.jumpHoldTimer -= dt;
        }

        // Gravity & Velocity
        p.vy += gravity * dt;
        p.y += p.vy * dt;

        // Ground collision
        if (p.y >= 0) {
          if (!p.isGrounded && isPlaying) {
            // Landing dust
            for (let i = 0; i < 4; i++) {
              g.particles.push({
                x: p.x + (i % 2 === 0 ? 4 : 20),
                y: groundLevel - 2,
                vx: (i % 2 === 0 ? -1 : 1) * (40 + Math.random() * 50),
                vy: -Math.random() * 30,
                color: "#22d3ee",
                size: 2,
                alpha: 0.6,
                life: 0.25,
              });
            }
          }
          p.y = 0;
          p.vy = 0;
          p.isGrounded = true;
        }

        // Running animation step
        p.runFrame += dt * (speed * 0.04);

        // Player running particle trail
        if (p.isGrounded && (isPlaying || isIdle) && Math.random() < 0.4) {
          g.particles.push({
            x: p.x + 2,
            y: groundLevel - 3,
            vx: -speed * 0.3 - Math.random() * 30,
            vy: -Math.random() * 25,
            color: p.invincibleUntil > g.elapsed ? "#f59e0b" : "#8b5cf6",
            size: 2 + Math.random() * 2,
            alpha: 0.7,
            life: 0.3,
          });
        }

        // Hitbox calculation
        const playerHeight = p.isDucking ? 22 : 38;
        const playerTop = groundLevel - (playerHeight + (p.isDucking ? 0 : -p.y));
        const playerBox = {
          left: p.x + 4,
          right: p.x + p.width - 4,
          top: playerTop + 2,
          bottom: groundLevel + p.y - 2,
        };

        const isInvincible = p.invincibleUntil > g.elapsed;

        // UPDATE OBSTACLES & HIT DETECTION
        for (let i = g.obstacles.length - 1; i >= 0; i--) {
          const obs = g.obstacles[i];
          obs.x -= speed * dt;
          obs.anim += dt * 8;

          // Check collision with player
          if (isPlaying) {
            const obsBox = {
              left: obs.x + 3,
              right: obs.x + obs.width - 3,
              top: obs.y + 3,
              bottom: obs.y + obs.height - 2,
            };

            const overlaps =
              playerBox.right > obsBox.left &&
              playerBox.left < obsBox.right &&
              playerBox.bottom > obsBox.top &&
              playerBox.top < obsBox.bottom;

            if (overlaps) {
              if (isInvincible) {
                // Obliterate obstacle with bonus!
                soundRef.current.playSquash();
                scoreAccumulator += 80;
                g.toasts.push({
                  text: "+80 SQUASHED!",
                  x: obs.x,
                  y: obs.y - 15,
                  color: "#f59e0b",
                  alpha: 1,
                  life: 0.8,
                });
                for (let k = 0; k < 14; k++) {
                  g.particles.push({
                    x: obs.x + 12,
                    y: obs.y + 12,
                    vx: (Math.random() - 0.5) * 220,
                    vy: (Math.random() - 0.7) * 200,
                    color: "#f43f5e",
                    size: 3 + Math.random() * 3,
                    alpha: 1,
                    life: 0.5,
                  });
                }
                g.obstacles.splice(i, 1);
                continue;
              } else {
                // GAME OVER TRIGGER
                soundRef.current.playCrash();
                if (!isReducedMotionRef.current) {
                  g.shakeMagnitude = 14;
                  g.glitchFlash = 1.0;
                }

                setGameState("gameover");
                const finalScore = Math.floor(scoreAccumulator);

                // Check Best score
                if (finalScore > bestScore) {
                  setBestScore(finalScore);
                  try {
                    localStorage.setItem("naday_bug_runner_best", String(finalScore));
                  } catch {}
                }

                // Crash burst particles
                for (let k = 0; k < 20; k++) {
                  g.particles.push({
                    x: p.x + 14,
                    y: groundLevel + p.y - 20,
                    vx: (Math.random() - 0.5) * 240,
                    vy: (Math.random() - 0.8) * 260,
                    color: k % 2 === 0 ? "#f43f5e" : "#22d3ee",
                    size: 3 + Math.random() * 4,
                    alpha: 1,
                    life: 0.6,
                  });
                }
                break;
              }
            }
          }

          // Remove off-screen
          if (obs.x + obs.width < -30) {
            g.obstacles.splice(i, 1);
          }
        }

        // UPDATE COLLECTIBLES
        for (let i = g.collectibles.length - 1; i >= 0; i--) {
          const col = g.collectibles[i];
          col.x -= speed * dt;
          col.anim += dt * 4;

          if (isPlaying) {
            const colBox = {
              left: col.x - col.size / 2,
              right: col.x + col.size / 2,
              top: col.y - col.size / 2,
              bottom: col.y + col.size / 2,
            };

            const overlaps =
              playerBox.right > colBox.left &&
              playerBox.left < colBox.right &&
              playerBox.bottom > colBox.top &&
              playerBox.top < colBox.bottom;

            if (overlaps) {
              if (col.type === "coffee") {
                soundRef.current.playPowerup();
                p.invincibleUntil = g.elapsed + 5.0; // 5s invincibility
                scoreAccumulator += col.data.points;
                g.toasts.push({
                  text: "☕ COFFEE BOOST! (5s)",
                  x: col.x,
                  y: col.y - 20,
                  color: "#f59e0b",
                  alpha: 1,
                  life: 1.1,
                });
              } else {
                soundRef.current.playCollect();
                scoreAccumulator += col.data.points;
                g.toasts.push({
                  text: `+${col.data.points} ${col.data.name}`,
                  x: col.x,
                  y: col.y - 20,
                  color: col.data.color,
                  alpha: 1,
                  life: 0.9,
                });
              }

              // Sparkle particle burst
              for (let k = 0; k < 12; k++) {
                g.particles.push({
                  x: col.x,
                  y: col.y,
                  vx: (Math.random() - 0.5) * 160,
                  vy: (Math.random() - 0.5) * 160,
                  color: col.data.color,
                  size: 2 + Math.random() * 3,
                  alpha: 1,
                  life: 0.45,
                });
              }

              g.collectibles.splice(i, 1);
              continue;
            }
          }

          if (col.x < -30) {
            g.collectibles.splice(i, 1);
          }
        }

        // UPDATE PARTICLES
        for (let i = g.particles.length - 1; i >= 0; i--) {
          const pt = g.particles[i];
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.life -= dt;
          pt.alpha = Math.max(0, pt.life / 0.45);
          if (pt.life <= 0) {
            g.particles.splice(i, 1);
          }
        }

        // UPDATE FLOATING TOASTS
        for (let i = g.toasts.length - 1; i >= 0; i--) {
          const t = g.toasts[i];
          t.y -= 38 * dt;
          t.life -= dt;
          t.alpha = Math.max(0, t.life / 0.9);
          if (t.life <= 0) {
            g.toasts.splice(i, 1);
          }
        }

        // UPDATE SCREEN SHAKE & GLITCH
        if (g.shakeMagnitude > 0) {
          g.shakeMagnitude -= dt * 25;
          if (g.shakeMagnitude < 0) g.shakeMagnitude = 0;
        }
        if (g.glitchFlash > 0) {
          g.glitchFlash -= dt * 4;
          if (g.glitchFlash < 0) g.glitchFlash = 0;
        }

        // 2. DRAW CANVAS RENDER FRAME
        ctx.save();
        ctx.scale(g.dpr, g.dpr);

        // Apply screen shake
        if (g.shakeMagnitude > 0 && !isReducedMotionRef.current) {
          const sx = (Math.random() - 0.5) * g.shakeMagnitude;
          const sy = (Math.random() - 0.5) * g.shakeMagnitude;
          ctx.translate(sx, sy);
        }

        // Clear & Background Gradient (Violet to Cyan day/night cycle)
        ctx.clearRect(0, 0, g.width, g.height);

        const bgGrad = ctx.createLinearGradient(0, 0, 0, g.height);
        if (isCyanPhase) {
          bgGrad.addColorStop(0, "#081525");
          bgGrad.addColorStop(0.65, "#060913");
          bgGrad.addColorStop(1, "#03060d");
        } else {
          bgGrad.addColorStop(0, "#120926");
          bgGrad.addColorStop(0.65, "#060913");
          bgGrad.addColorStop(1, "#03060d");
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, g.width, g.height);

        // Parallax stars
        for (let i = 0; i < g.stars.length; i++) {
          const st = g.stars[i];
          st.x -= speed * dt * st.speedMult;
          if (st.x < -5) st.x = g.width + 5;

          ctx.beginPath();
          ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${st.alpha * 0.75})`;
          ctx.fill();
        }

        // Cyber Grid Floor
        const gridSpacing = 28;
        const gridOffsetX = (g.elapsed * speed) % gridSpacing;

        ctx.strokeStyle = isCyanPhase ? "rgba(34, 211, 238, 0.4)" : "rgba(139, 92, 246, 0.4)";
        ctx.lineWidth = 1.5;

        // Ground top line
        ctx.beginPath();
        ctx.moveTo(0, groundLevel);
        ctx.lineTo(g.width, groundLevel);
        ctx.stroke();

        // Floor glow strip
        ctx.fillStyle = isCyanPhase
          ? "rgba(34, 211, 238, 0.08)"
          : "rgba(139, 92, 246, 0.08)";
        ctx.fillRect(0, groundLevel, g.width, groundYOffset);

        // Vertical moving grid lines
        ctx.strokeStyle = isCyanPhase ? "rgba(34, 211, 238, 0.22)" : "rgba(139, 92, 246, 0.22)";
        ctx.lineWidth = 1;
        for (let x = -gridOffsetX; x < g.width + gridSpacing; x += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, groundLevel);
          ctx.lineTo(x - 20, g.height);
          ctx.stroke();
        }

        // DRAW COLLECTIBLES
        for (let i = 0; i < g.collectibles.length; i++) {
          const col = g.collectibles[i];
          const hoverOffset = Math.sin(col.anim * 3) * 4;
          const cy = col.y + hoverOffset;

          ctx.save();
          // Glow halo
          ctx.shadowColor = col.data.color;
          ctx.shadowBlur = 12;

          // Outer glass ring
          ctx.beginPath();
          ctx.arc(col.x, cy, col.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(10, 16, 32, 0.85)";
          ctx.fill();
          ctx.strokeStyle = col.data.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Symbol
          ctx.fillStyle = col.data.color;
          ctx.font = `bold ${col.type === "coffee" ? 13 : 11}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(col.data.symbol, col.x, cy + 0.5);
          ctx.restore();
        }

        // DRAW OBSTACLES
        for (let i = 0; i < g.obstacles.length; i++) {
          const obs = g.obstacles[i];

          if (obs.type === "bug") {
            // Neon Bug / Beetle
            ctx.save();
            ctx.shadowColor = "#f43f5e";
            ctx.shadowBlur = 10;

            const legWiggle = Math.sin(obs.anim * 6) * 3;

            // Beetle legs
            ctx.strokeStyle = "#fb7185";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(obs.x + 4, obs.y + 12);
            ctx.lineTo(obs.x - 3, obs.y + 18 + legWiggle);
            ctx.moveTo(obs.x + 12, obs.y + 12);
            ctx.lineTo(obs.x + 12, obs.y + 20 - legWiggle);
            ctx.moveTo(obs.x + 20, obs.y + 12);
            ctx.lineTo(obs.x + 27, obs.y + 18 + legWiggle);
            ctx.stroke();

            // Shell body
            ctx.fillStyle = "#e11d48";
            ctx.beginPath();
            ctx.ellipse(obs.x + 12, obs.y + 10, 10, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#ffe4e6";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Glowing Eyes
            ctx.fillStyle = "#38bdf8";
            ctx.beginPath();
            ctx.arc(obs.x + 6, obs.y + 7, 1.5, 0, Math.PI * 2);
            ctx.arc(obs.x + 10, obs.y + 7, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Antennae
            ctx.strokeStyle = "#fda4af";
            ctx.beginPath();
            ctx.moveTo(obs.x + 6, obs.y + 6);
            ctx.lineTo(obs.x + 2, obs.y);
            ctx.moveTo(obs.x + 10, obs.y + 6);
            ctx.lineTo(obs.x + 12, obs.y);
            ctx.stroke();

            ctx.restore();
          } else if (obs.type === "error_block") {
            // Glitching Red Error Block
            ctx.save();
            ctx.shadowColor = "#ef4444";
            ctx.shadowBlur = 12;

            ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

            // "ERR!" text
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("ERR!", obs.x + obs.width / 2, obs.y + obs.height / 2);
            ctx.restore();
          } else if (obs.type === "drone_404") {
            // Flying 404 Drone
            ctx.save();
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur = 10;

            const hoverY = Math.sin(obs.anim * 4) * 3;
            const dy = obs.y + hoverY;

            // Drone body
            ctx.fillStyle = "#0c172e";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(obs.x, dy, obs.width, obs.height, 4);
            ctx.fill();
            ctx.stroke();

            // 404 Text
            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 10px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("404", obs.x + obs.width / 2, dy + obs.height / 2);

            // Flashing red siren on top
            ctx.fillStyle = Math.sin(obs.anim * 8) > 0 ? "#f43f5e" : "#fbbf24";
            ctx.beginPath();
            ctx.arc(obs.x + obs.width / 2, dy - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // DRAW PLAYER (Neon Developer Runner)
        if (gameStateRef.current !== "gameover") {
          ctx.save();
          const pY = groundLevel + p.y;
          const isDucking = p.isDucking;
          const legPhase = Math.sin(p.runFrame * 2);

          // Coffee Aura
          if (isInvincible) {
            ctx.shadowColor = "#f59e0b";
            ctx.shadowBlur = 24;
            ctx.strokeStyle = "rgba(245, 158, 11, 0.75)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(p.x + 14, pY - 20, 26, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.shadowColor = "#22d3ee";
            ctx.shadowBlur = 10;
          }

          if (isDucking) {
            // Sliding / Ducking pose
            // Head
            ctx.fillStyle = "#22d3ee";
            ctx.beginPath();
            ctx.arc(p.x + 24, pY - 10, 6, 0, Math.PI * 2);
            ctx.fill();

            // Torso (sliding)
            ctx.fillStyle = "#8b5cf6";
            ctx.beginPath();
            ctx.roundRect(p.x + 4, pY - 14, 20, 10, 3);
            ctx.fill();

            // Slide sparks
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p.x, pY - 2);
            ctx.lineTo(p.x + 24, pY - 2);
            ctx.stroke();
          } else {
            // Normal / Jumping runner pose
            const bodyTop = pY - 36;

            // Head & Visor
            ctx.fillStyle = "#22d3ee";
            ctx.beginPath();
            ctx.arc(p.x + 14, bodyTop + 6, 7, 0, Math.PI * 2);
            ctx.fill();

            // Cyan neon visor line
            ctx.fillStyle = "#060913";
            ctx.fillRect(p.x + 12, bodyTop + 4, 8, 3);

            // Violet Hoodie / Torso
            ctx.fillStyle = "#8b5cf6";
            ctx.beginPath();
            ctx.roundRect(p.x + 6, bodyTop + 14, 16, 14, 3);
            ctx.fill();

            // "NA" chip badge on back
            ctx.fillStyle = "#22d3ee";
            ctx.font = "bold 6px monospace";
            ctx.fillText("NA", p.x + 10, bodyTop + 22);

            // Legs animation
            ctx.strokeStyle = "#c084fc";
            ctx.lineWidth = 3;
            ctx.lineCap = "round";

            if (p.isGrounded) {
              // Left Leg
              ctx.beginPath();
              ctx.moveTo(p.x + 9, bodyTop + 28);
              ctx.lineTo(p.x + 9 + legPhase * 6, pY - 2);
              ctx.stroke();

              // Right Leg
              ctx.beginPath();
              ctx.moveTo(p.x + 18, bodyTop + 28);
              ctx.lineTo(p.x + 18 - legPhase * 6, pY - 2);
              ctx.stroke();
            } else {
              // Jumping / Tucked legs
              ctx.beginPath();
              ctx.moveTo(p.x + 8, bodyTop + 28);
              ctx.lineTo(p.x + 4, bodyTop + 34);
              ctx.moveTo(p.x + 18, bodyTop + 28);
              ctx.lineTo(p.x + 22, bodyTop + 34);
              ctx.stroke();
            }
          }
          ctx.restore();
        }

        // DRAW PARTICLES
        for (let i = 0; i < g.particles.length; i++) {
          const pt = g.particles[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha;
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // DRAW FLOATING TOASTS
        for (let i = 0; i < g.toasts.length; i++) {
          const t = g.toasts[i];
          ctx.save();
          ctx.font = "bold 11px monospace";
          ctx.fillStyle = t.color;
          ctx.shadowColor = t.color;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = t.alpha;
          ctx.fillText(t.text, t.x, t.y);
          ctx.restore();
        }

        // Glitch flash on collision
        if (g.glitchFlash > 0 && !isReducedMotionRef.current) {
          ctx.fillStyle = `rgba(244, 63, 94, ${g.glitchFlash * 0.35})`;
          ctx.fillRect(0, 0, g.width, g.height);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section id="game" className="py-16 sm:py-20 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-gradient-to-r from-violet-600/10 via-cyan-500/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Simple One-line Heading strictly as requested */}
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Before you go, squash some bugs.
          </h2>
        </div>

        {/* HUD: One slim line above canvas (Score, Best, Sound Toggle) */}
        <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-[#0a0f20]/90 border border-white/10 backdrop-blur-md mb-3 text-xs sm:text-sm font-mono text-zinc-300 shadow-lg">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider">Score:</span>
              <span className="text-cyan-300 font-bold tracking-widest">
                {String(score).padStart(5, "0")}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider">Best:</span>
              <span className="text-amber-400 font-bold tracking-widest">
                {String(bestScore).padStart(5, "0")}
              </span>
            </div>

            {invincibleTimeLeft > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-amber-300 font-bold animate-pulse">
                <FiZap className="w-3.5 h-3.5" />
                <span>BOOST {invincibleTimeLeft}s</span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute game sound" : "Mute game sound"}
            title={isMuted ? "Unmute game sound" : "Mute game sound"}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-cyan-300 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {isMuted ? <FiVolumeX className="w-4 h-4" /> : <FiVolume2 className="w-4 h-4 text-cyan-300" />}
          </button>
        </div>

        {/* Game Canvas Container */}
        <div
          onClick={triggerJump}
          className="relative rounded-2xl overflow-hidden border border-white/15 hover:border-cyan-400/40 transition-colors bg-[#060913] shadow-2xl cursor-pointer group"
          style={{ aspectRatio: "3 / 1" }}
        >
          <canvas
            ref={canvasRef}
            aria-label="Bug Runner endless runner game canvas"
            className="w-full h-full block"
          />

          {/* Idle State Prompt Overlay */}
          <AnimatePresence>
            {gameState === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20"
              >
                <div className="px-4 py-1.5 rounded-full bg-[#0a0f20]/90 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-mono shadow-xl flex items-center gap-2 animate-bounce">
                  <span>Press Space or tap to start</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Over Compact Overlay */}
          <AnimatePresence>
            {gameState === "gameover" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()} // Prevent clicking overlay from triggering jump
                className="absolute inset-2 sm:inset-3 rounded-xl bg-[#060913]/94 backdrop-blur-xl border border-rose-500/40 p-4 sm:p-6 flex flex-col items-center justify-center text-center z-20 shadow-2xl"
              >
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2 border border-rose-500/30">
                  <FiAward className="w-5 h-5" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Bugs Caught You!</h3>

                <p className="text-xs sm:text-sm font-mono text-zinc-300 mb-4">
                  Final Score: <span className="text-cyan-300 font-bold">{score}</span> • Best:{" "}
                  <span className="text-amber-400 font-bold">{bestScore}</span>
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full max-w-xs">
                  <button
                    onClick={startGame}
                    className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 cursor-pointer"
                  >
                    <FiRotateCcw className="w-3.5 h-3.5" />
                    <span>Play again</span>
                  </button>

                  <a
                    href="#contact"
                    onClick={scrollToContact}
                    className="flex-1 py-2 px-4 rounded-xl bg-[#0d1428] hover:bg-[#131b35] text-cyan-300 hover:text-white border border-cyan-400/40 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"
                  >
                    <FiSend className="w-3 h-3" />
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
