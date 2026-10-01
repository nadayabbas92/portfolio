import { useEffect, useRef } from "react";

/**
 * AmbientBackground
 * Ultra-lightweight, high-performance ambient canvas with soft drifting celestial /
 * neural particles and subtle proximity connection threads.
 * Designed to feel premium, futuristic, and non-distracting.
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Pointer position for subtle ambient reaction
    const pointer = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    // Create particles
    const particleCount = window.innerWidth < 768 ? 36 : 64;
    const particles = [];

    const colors = [
      "rgba(34, 211, 238, ",  // Cyan
      "rgba(139, 92, 246, ",  // Violet
      "rgba(99, 102, 241, ",  // Indigo
      "rgba(56, 189, 248, ",  // Sky
    ];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Initialize particle population
    for (let i = 0; i < particleCount; i++) {
      const baseColor = colors[i % colors.length];
      const baseAlpha = 0.2 + Math.random() * 0.35;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.08,
        radius: 1.0 + Math.random() * 1.8,
        baseColor,
        baseAlpha,
        alpha: baseAlpha,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulseAngle: Math.random() * Math.PI * 2,
      });
    }

    const onPointerMove = (e) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Tab visibility handling
    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !animFrameId && !prefersReducedMotion) {
        animFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Main render loop
    const maxConnectionDist = 110;

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth pointer easing
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Wrap around screen edges
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          // Soft breathing opacity
          p.pulseAngle += p.pulseSpeed;
          p.alpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.12;

          // Subtle gentle repulsion from pointer
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (1 - dist / 100) * 0.4;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.baseColor}${Math.max(0, p.alpha)})`;
        ctx.shadowColor = p.baseColor.includes("211") ? "#22d3ee" : "#8b5cf6";
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Draw faint proximity connection threads
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            const lineAlpha = (1 - dist / maxConnectionDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
