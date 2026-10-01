import { useRef, useEffect, useCallback } from "react";

/**
 * WordmarkSection
 * Full-width interactive brand wordmark featuring "NADAY ABBAS" with TRAE-inspired
 * fluid kinetic typography deformation.
 *
 * Mechanics:
 * - Proximity-driven vertical elongation (scaleY: 1.0 -> 1.36), slight volume preservation (scaleX: 1.0 -> 0.94),
 *   and smooth upward wave lift (translateY: 0 -> -20px).
 * - Continuous Gaussian bell-curve propagation over neighboring letters creates a majestic liquid wave.
 * - Dynamic italic shear/skew aligned with cursor position.
 * - Spring-damped elastic return animation with natural rebound.
 * - Luminous cyan-to-violet gradient illumination and soft halo.
 * - Single-line on desktop, stacked two-line on mobile.
 * - 0% CPU consumption when at rest.
 */
export default function WordmarkSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const animFrameRef = useRef(null);
  const isRunningRef = useRef(false);
  const isInViewRef = useRef(true);
  const isReducedMotionRef = useRef(false);

  // Pointer position relative to canvas
  const pointerRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
    lastMoveTime: 0,
  });

  // Letter objects with spring physics state
  const lettersRef = useRef([]);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1, isMobile: false });

  // Measures and builds letter geometry and font metrics
  const setupLetters = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    if (width <= 0) return;

    const isMobile = width < 640;
    const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

    const height = isMobile
      ? Math.max(180, Math.floor(width * 0.46))
      : Math.max(160, Math.floor(width * 0.18));

    dimensionsRef.current = { width, height, dpr, isMobile };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    const fontFamilies = '"Syne", "Inter", "Unbounded", "Archivo Black", sans-serif';

    const scratchCanvas = document.createElement("canvas");
    const scratchCtx = scratchCanvas.getContext("2d");
    if (!scratchCtx) return;

    const horizontalPadding = isMobile ? 20 : 44;
    const usableWidth = width - horizontalPadding * 2;

    const newLetters = [];

    if (isMobile) {
      // Two stacked lines: "NADAY" and "ABBAS"
      const lines = [
        { text: "NADAY", targetY: height * 0.32 },
        { text: "ABBAS", targetY: height * 0.74 },
      ];

      scratchCtx.font = `900 100px ${fontFamilies}`;
      const measure1 = scratchCtx.measureText("NADAY").width;
      const measure2 = scratchCtx.measureText("ABBAS").width;
      const maxMeasure = Math.max(measure1, measure2, 1);
      const computedFontSize = Math.floor((usableWidth / maxMeasure) * 90);

      const fontString = `900 ${computedFontSize}px ${fontFamilies}`;
      scratchCtx.font = fontString;

      lines.forEach((lineObj) => {
        const fullLineWidth = scratchCtx.measureText(lineObj.text).width;
        let startX = (width - fullLineWidth) / 2;
        const lineLetterHeight = computedFontSize * 1.15;
        const letterCenterY = lineObj.targetY;

        for (let i = 0; i < lineObj.text.length; i++) {
          const char = lineObj.text[i];
          const charWidth = scratchCtx.measureText(char).width;
          const letterCenterX = startX + charWidth / 2;
          startX += charWidth;

          newLetters.push({
            char,
            centerX: letterCenterX,
            centerY: letterCenterY,
            width: charWidth,
            height: lineLetterHeight,
            fontSize: computedFontSize,
            fontString,
            // Physics state
            scaleY: 1.0,
            scaleYVel: 0,
            scaleX: 1.0,
            scaleXVel: 0,
            translateY: 0,
            translateYVel: 0,
            skewX: 0,
            skewXVel: 0,
            glow: 0,
            glowVel: 0,
          });
        }
      });
    } else {
      // Desktop: Single continuous line "NADAY ABBAS"
      const fullText = "NADAY ABBAS";
      scratchCtx.font = `900 100px ${fontFamilies}`;
      const fullMeasure = scratchCtx.measureText(fullText).width || 1;
      const computedFontSize = Math.floor((usableWidth / fullMeasure) * 94);

      const fontString = `900 ${computedFontSize}px ${fontFamilies}`;
      scratchCtx.font = fontString;

      const totalRenderedWidth = scratchCtx.measureText(fullText).width;
      let startX = (width - totalRenderedWidth) / 2;
      const letterHeight = computedFontSize * 1.15;
      const letterCenterY = height / 2;

      for (let i = 0; i < fullText.length; i++) {
        const char = fullText[i];
        if (char === " ") {
          const spaceWidth = scratchCtx.measureText(" ").width;
          startX += spaceWidth;
          continue;
        }

        const charWidth = scratchCtx.measureText(char).width;
        const letterCenterX = startX + charWidth / 2;
        startX += charWidth;

        newLetters.push({
          char,
          centerX: letterCenterX,
          centerY: letterCenterY,
          width: charWidth,
          height: letterHeight,
          fontSize: computedFontSize,
          fontString,
          // Physics state
          scaleY: 1.0,
          scaleYVel: 0,
          scaleX: 1.0,
          scaleXVel: 0,
          translateY: 0,
          translateYVel: 0,
          skewX: 0,
          skewXVel: 0,
          glow: 0,
          glowVel: 0,
        });
      }
    }

    lettersRef.current = newLetters;
  }, []);

  // Main render frame with TRAE-style fluid spring physics deformation
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const { width, height, dpr, isMobile } = dimensionsRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    const now = performance.now();
    const isPointerActive =
      pointerRef.current.active && now - pointerRef.current.lastMoveTime < 500;
    const px = pointerRef.current.x;
    const py = pointerRef.current.y;

    const proximityRadius = isMobile ? 120 : 180;
    let hasActiveMotion = false;
    const letters = lettersRef.current;

    // Spring physics constants (fluid, responsive, elegant critically damped oscillation)
    const springStiffness = 0.16;
    const springDamping = 0.78;

    for (let k = 0; k < letters.length; k++) {
      const letter = letters[k];

      let targetScaleY = 1.0;
      let targetScaleX = 1.0;
      let targetTranslateY = 0;
      let targetSkewX = 0;
      let targetGlow = 0;

      if (isPointerActive && !isReducedMotionRef.current) {
        const dx = px - letter.centerX;
        const dy = py - letter.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < proximityRadius) {
          // Smooth Gaussian bell-curve falloff
          const normDist = dist / proximityRadius;
          const falloff = Math.exp(-Math.pow(normDist * 2.1, 2));

          // Signature TRAE vertical elongation & height stretch
          targetScaleY = 1.0 + falloff * 0.36; // Stretch up to 1.36x
          targetScaleX = 1.0 - falloff * 0.06; // Slight width compensation for elastic liquid feel
          targetTranslateY = -falloff * 20;     // Upward fluid lift
          targetSkewX = -(dx / proximityRadius) * falloff * 0.10; // Dynamic italic shear
          targetGlow = falloff;
        }
      }

      // Spring integration for ScaleY
      const forceScaleY = (targetScaleY - letter.scaleY) * springStiffness;
      letter.scaleYVel = (letter.scaleYVel + forceScaleY) * springDamping;
      letter.scaleY += letter.scaleYVel;

      // Spring integration for ScaleX
      const forceScaleX = (targetScaleX - letter.scaleX) * springStiffness;
      letter.scaleXVel = (letter.scaleXVel + forceScaleX) * springDamping;
      letter.scaleX += letter.scaleXVel;

      // Spring integration for TranslateY
      const forceTranslateY = (targetTranslateY - letter.translateY) * springStiffness;
      letter.translateYVel = (letter.translateYVel + forceTranslateY) * springDamping;
      letter.translateY += letter.translateYVel;

      // Spring integration for SkewX
      const forceSkewX = (targetSkewX - letter.skewX) * springStiffness;
      letter.skewXVel = (letter.skewXVel + forceSkewX) * springDamping;
      letter.skewX += letter.skewXVel;

      // Spring integration for Glow
      const forceGlow = (targetGlow - letter.glow) * 0.18;
      letter.glowVel = (letter.glowVel + forceGlow) * 0.82;
      letter.glow += letter.glowVel;

      // Check if letter has meaningful active movement
      if (
        Math.abs(letter.scaleY - 1.0) > 0.002 ||
        Math.abs(letter.scaleX - 1.0) > 0.002 ||
        Math.abs(letter.translateY) > 0.08 ||
        Math.abs(letter.skewX) > 0.001 ||
        letter.glow > 0.01
      ) {
        hasActiveMotion = true;
      }

      // Draw deformed letter
      ctx.save();
      const renderX = letter.centerX;
      const renderY = letter.centerY + letter.translateY;

      ctx.translate(renderX, renderY);
      ctx.scale(letter.scaleX, letter.scaleY);
      if (Math.abs(letter.skewX) > 0.001) {
        ctx.transform(1, 0, letter.skewX, 1, 0, 0);
      }

      ctx.font = letter.fontString;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Atmospheric soft glowing halo behind elongated letter
      if (letter.glow > 0.03) {
        ctx.save();
        ctx.shadowColor = "rgba(34, 211, 238, 0.75)";
        ctx.shadowBlur = Math.round(letter.glow * 28);
        ctx.fillStyle = "rgba(34, 211, 238, 0.35)";
        ctx.fillText(letter.char, 0, 0);
        ctx.restore();
      }

      // Dynamic color filling: transitions into vibrant electric cyan-indigo gradient when active
      if (letter.glow > 0.05) {
        const grad = ctx.createLinearGradient(
          -letter.width / 2,
          -letter.height / 2,
          letter.width / 2,
          letter.height / 2
        );
        grad.addColorStop(0, "#22d3ee");
        grad.addColorStop(0.45, "#818cf8");
        grad.addColorStop(1, "#c084fc");
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = "#f1f5f9";
      }

      ctx.fillText(letter.char, 0, 0);
      ctx.restore();
    }

    ctx.restore();
    return isPointerActive || hasActiveMotion;
  }, []);

  // Animation loop runner (only active during interaction or settling)
  const startLoop = useCallback(() => {
    if (isRunningRef.current || !isInViewRef.current) return;
    isRunningRef.current = true;

    const tick = () => {
      const continueLoop = renderFrame();
      if (continueLoop && isInViewRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        isRunningRef.current = false;
        renderFrame();
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [renderFrame]);

  // Pointer event handlers
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
      lastMoveTime: performance.now(),
    };

    startLoop();
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
    pointerRef.current.lastMoveTime = performance.now();
    startLoop();
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        active: true,
        lastMoveTime: performance.now(),
      };
      startLoop();
    }
  };

  const handleTouchEnd = () => {
    pointerRef.current.active = false;
    pointerRef.current.lastMoveTime = performance.now();
    startLoop();
  };

  // Setup listeners and observers
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotionRef.current = mediaQuery.matches;
    const handleMotionChange = (e) => {
      isReducedMotionRef.current = e.matches;
      renderFrame();
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    const handleResize = () => {
      setupLetters();
      renderFrame();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    setupLetters();
    renderFrame();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setupLetters();
        renderFrame();
      });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          renderFrame();
        } else {
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
          }
          isRunningRef.current = false;
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotionChange);
      observer.disconnect();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [setupLetters, renderFrame]);

  return (
    <section
      ref={containerRef}
      className="w-full relative overflow-hidden bg-[#060913] select-none py-14 sm:py-20"
      aria-label="Naday Abbas Brand Wordmark"
    >
      <h2 className="sr-only">Naday Abbas</h2>

      {/* Top divider accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 via-cyan-400/30 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Aurora Mesh Glow behind the letters */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-[960px] h-[220px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18)_0%,rgba(34,211,238,0.10)_45%,transparent_70%)] blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Interactive Wordmark Canvas */}
      <div className="w-full flex items-center justify-center px-4 sm:px-6">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onTouchStart={handleTouchMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="block cursor-pointer touch-none transition-opacity duration-300"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
