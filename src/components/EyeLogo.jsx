"use client";
import { useEffect, useRef } from "react";

/**
 * Nirvaya Eyecare logo – the iris follows the mouse (finger on touch screens).
 * Uses ONLY the designer's artwork (no typed text), so font, spacing and style
 * are exactly as designed.
 *
 *   public/logo/logo-frame.webp     N + eyelids   (sits on top)
 *   public/logo/logo-iris.webp      iris          (moves, sits underneath the frame)
 *   public/logo/logo-wordmark.webp  NIRVAYA / EYECARE / tagline
 *
 * There is no white fill behind the iris: the page background shows through
 * the eye, exactly like the original artwork.
 *
 * Usage:
 *   <EyeLogo className="h-12 w-auto" />               // mark + wordmark
 *   <EyeLogo showText={false} className="h-10 w-auto" />  // mark only
 */

// ---- artwork geometry (units = pixels of the original 7395 x 4131 frame) ----
const FRAME = { w: 7395, h: 4131 };
const IRIS = { x: 3748, y: 1170, w: 2381, h: 2380 };
const IRIS_CENTER = { x: 4938.5, y: 2360.0 };
// Max travel, measured so the iris never leaves the eye opening
const LIMIT = { left: 300, right: 512, up: 187, down: 155 };

// ---- wordmark placement (tweak these 3 numbers to fine-tune the lock-up) ----
const WORDMARK_RATIO = 4055 / 1270;   // width / height of the wordmark image
const WORDMARK_HEIGHT = 4131 * 1.0;          // 1.0 = same height as the eye mark
const GAP = 500;                                  // space between mark and wordmark
const WORDMARK_DY = 0;                            // move wordmark up (-) / down (+)

export default function EyeLogo({
  className = "",
  showText = true,
  basePath = "/logo",
}) {
  const irisRef = useRef(null);
  const centerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;

    const onMove = (e) => {
      const p = e.touches ? e.touches[0] : e;
      if (!p || !centerRef.current) return;
      const r = centerRef.current.getBoundingClientRect();
      const dx = p.clientX - (r.left + r.width / 2);
      const dy = p.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 300);            // near cursor = small move, far = full
      const ux = dx / dist, uy = dy / dist;
      tx = ux * k * (ux > 0 ? LIMIT.right : LIMIT.left);
      ty = uy * k * (uy > 0 ? LIMIT.down : LIMIT.up);
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = () => {
      cx += (tx - cx) * 0.14;                        // smooth easing
      cy += (ty - cy) * 0.14;
      irisRef.current?.setAttribute("transform", `translate(${cx.toFixed(1)} ${cy.toFixed(1)})`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onLeave);
    document.addEventListener("mouseleave", onLeave);
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const wmW = WORDMARK_HEIGHT * WORDMARK_RATIO;
  const vbW = showText ? FRAME.w + GAP + wmW : FRAME.w;
  const vbH = Math.max(FRAME.h, WORDMARK_HEIGHT + Math.abs(WORDMARK_DY));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${vbW} ${vbH}`}
      className={className}
      role="img"
      aria-label="Nirvaya Eyecare"
    >
      {/* iris – moves with the cursor, sits UNDER the frame */}
      <g ref={irisRef}>
        <image href={`${basePath}/logo-iris.webp`} x={IRIS.x} y={IRIS.y} width={IRIS.w} height={IRIS.h} />
      </g>

      {/* N + eyelids on top (the eye opening is transparent) */}
      <image href={`${basePath}/logo-frame.webp`} x="0" y="0" width={FRAME.w} height={FRAME.h} />

      {/* invisible marker used to find the eye centre on screen */}
      <circle ref={centerRef} cx={IRIS_CENTER.x} cy={IRIS_CENTER.y} r="2" fill="none" />

      {/* wordmark image from the designer */}
      {showText && (
        <image
          href={`${basePath}/logo-wordmark.webp`}
          x={FRAME.w + GAP}
          y={Math.max(0, WORDMARK_DY)}
          width={wmW}
          height={WORDMARK_HEIGHT}
        />
      )}
    </svg>
  );
}
