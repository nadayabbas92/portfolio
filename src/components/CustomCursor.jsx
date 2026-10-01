import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [hasMoved, setHasMoved] = useState(false);
  const outerRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Desktop only check (pointer: fine)
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isFinePointer || isTouch) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotX = -100;
    let dotY = -100;
    let isHovering = false;
    let isClicking = false;
    let isVisible = false;
    let rafId = null;

    const onPointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        setHasMoved(true);
        document.body.classList.add("has-custom-cursor");
        if (outerRef.current) outerRef.current.style.opacity = "1";
        if (dotRef.current) dotRef.current.style.opacity = "1";
      }
    };

    const onMouseDown = () => {
      isClicking = true;
    };

    const onMouseUp = () => {
      isClicking = false;
    };

    const onPointerLeave = () => {
      isVisible = false;
      if (outerRef.current) outerRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };

    const onPointerEnter = () => {
      isVisible = true;
      if (outerRef.current) outerRef.current.style.opacity = "1";
      if (dotRef.current) dotRef.current.style.opacity = "1";
    };

    const onMouseOver = (e) => {
      const target = e.target;
      isHovering = !!(
        target &&
        target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor-hover]'
        )
      );
    };

    // Smooth render loop with light easing
    const render = () => {
      // Light easing for outer ring (0.24) and crisp tracking for dot (0.55)
      ringX += (targetX - ringX) * 0.24;
      ringY += (targetY - ringY) * 0.24;

      dotX += (targetX - dotX) * 0.55;
      dotY += (targetY - dotY) * 0.55;

      if (outerRef.current) {
        const scale = isClicking ? 0.75 : isHovering ? 1.5 : 1;
        outerRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
        outerRef.current.style.borderColor = isHovering
          ? "rgba(34, 211, 238, 0.9)"
          : "rgba(139, 92, 246, 0.6)";
        outerRef.current.style.backgroundColor = isHovering
          ? "rgba(34, 211, 238, 0.12)"
          : "rgba(139, 92, 246, 0.04)";
      }

      if (dotRef.current) {
        const dotScale = isClicking ? 1.8 : isHovering ? 0 : 1;
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        dotRef.current.style.backgroundColor = isHovering ? "#8b5cf6" : "#22d3ee";
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerenter", onPointerEnter);
    document.addEventListener("mouseover", onMouseOver);

    rafId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerenter", onPointerEnter);
      document.removeEventListener("mouseover", onMouseOver);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      style={{ display: hasMoved ? "block" : "none" }}
      aria-hidden="true"
    >
      {/* Outer easing ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-violet-500/60 pointer-events-none opacity-0 transition-opacity duration-200"
        style={{ willChange: "transform" }}
      />
      {/* Inner sharp dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-cyan-400 pointer-events-none opacity-0 shadow-[0_0_8px_#22d3ee] transition-opacity duration-200"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
