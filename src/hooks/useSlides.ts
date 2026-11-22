import { useCallback, useEffect, useRef, useState } from "react";

// Mantenha igual ao duration-900 usado no container em App.tsx
export const DURATION = 900;

export function useSlides(total: number) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const locked = useRef(false);

  const goTo = useCallback(
    (alvo: number) => {
      const i = Math.max(0, Math.min(total - 1, alvo));
      if (locked.current || i === indexRef.current) return;
      locked.current = true;
      indexRef.current = i;
      setIndex(i);
      window.setTimeout(() => {
        locked.current = false;
      }, DURATION + 150); // folga para a inércia do trackpad
    },
    [total],
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return;
      if (e.deltaY > 0) next();
      else prev();
    };

    const onKey = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (alvo && ["INPUT", "TEXTAREA", "SELECT"].includes(alvo.tagName)) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(total - 1);
    };

    let y0 = 0;
    let x0 = 0;
    const onTouchStart = (e: TouchEvent) => {
      y0 = e.touches[0].clientY;
      x0 = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = y0 - e.changedTouches[0].clientY;
      const dx = x0 - e.changedTouches[0].clientX;
      if (Math.abs(dy) < 50 || Math.abs(dy) < Math.abs(dx)) return;
      if (dy > 0) next();
      else prev();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev, goTo, total]);

  return { index, goTo };
}