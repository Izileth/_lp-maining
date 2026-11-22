import { gsap } from "./gsap";

/* ───────────────────────── Ticker ───────────────────────── */

/*
  Loop contínuo: a trilha tem dois grupos idênticos e anima xPercent 0 → -50,
  então o reinício é invisível. A velocidade é em px/s (não em segundos),
  por isso se mantém constante em qualquer largura de tela.
*/
export function createTicker(root: HTMLElement, reduce: boolean) {
  const wrap = root.querySelector<HTMLElement>("[data-ticker]")!;
  const track = wrap.querySelector<HTMLElement>("[data-ticker-track]")!;

  const loop = gsap.to(track, {
    xPercent: -50,
    ease: "none",
    duration: 60,
    repeat: -1,
    paused: reduce,
  });

  const fit = () => {
    const half = track.scrollWidth / 2;
    const speed = window.innerWidth < 768 ? 45 : 70; // px/s
    if (half > 0) loop.duration(half / speed);
  };
  const ro = new ResizeObserver(fit);
  ro.observe(track);
  fit();

  /** Acelera e desacelera suavemente (chamado a cada troca de slide) */
  const kick = () => {
    if (reduce) return;
    gsap.killTweensOf(loop, "timeScale");
    gsap
      .timeline()
      .to(loop, { timeScale: 5, duration: 0.5, ease: "power2.out" })
      .to(loop, { timeScale: 1, duration: 1.6, ease: "power2.inOut" });
  };

  const slow = () => {
    gsap.killTweensOf(loop, "timeScale");
    gsap.to(loop, { timeScale: 0.25, duration: 0.6, ease: "power2.out" });
  };
  const resume = () => {
    gsap.killTweensOf(loop, "timeScale");
    gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power2.inOut" });
  };
  wrap.addEventListener("pointerenter", slow);
  wrap.addEventListener("pointerleave", resume);

  return {
    kick,
    destroy() {
      wrap.removeEventListener("pointerenter", slow);
      wrap.removeEventListener("pointerleave", resume);
      ro.disconnect();
      gsap.killTweensOf(loop);
      loop.kill();
    },
  };
}

/* ───────────────────────── Emblema ───────────────────────── */

export function createEmblem(root: HTMLElement, reduce: boolean) {
  const el = root.querySelector<SVGElement>("[data-emblem]");
  if (!el) return { boost() {}, destroy() {} };

  const spin = gsap.to(el, {
    rotation: 360,
    duration: 22,
    ease: "none",
    repeat: -1,
    transformOrigin: "50% 50%",
    paused: reduce,
  });

  const hit = el.parentElement as HTMLElement;
  const fast = () => {
    gsap.killTweensOf(spin, "timeScale");
    gsap.to(spin, { timeScale: 4, duration: 0.6, ease: "power2.out" });
  };
  const calm = () => {
    gsap.killTweensOf(spin, "timeScale");
    gsap.to(spin, { timeScale: 1, duration: 1, ease: "power2.inOut" });
  };
  hit.addEventListener("pointerenter", fast);
  hit.addEventListener("pointerleave", calm);

  return {
    /** Reação sutil a cada troca de slide/aba */
    boost() {
      if (reduce) return;
      gsap.killTweensOf(spin, "timeScale");
      gsap
        .timeline()
        .to(spin, { timeScale: 6, duration: 0.35, ease: "power2.out" })
        .to(spin, { timeScale: 1, duration: 1.4, ease: "power2.inOut" });
    },
    destroy() {
      hit.removeEventListener("pointerenter", fast);
      hit.removeEventListener("pointerleave", calm);
      gsap.killTweensOf(spin);
      spin.kill();
    },
  };
}

/* ───────────────────────── Magnético (desktop) ───────────────────────── */

export function createMagnetic(root: HTMLElement, strength = 0.32) {
  const offs: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    offs.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });

  return () => offs.forEach((off) => off());
}

/* ───────────────────────── Parallax do ponteiro (desktop) ───────────────────────── */

/*
  Camadas marcadas com data-depth="N" se movem até ±N/2 px na direção oposta ao mouse.
  As fotos usam -inset-4 (16px de sobra), então mantenha |depth| ≤ 16.
*/
export function createPointerParallax(root: HTMLElement) {
  const layers = Array.from(
    root.querySelectorAll<HTMLElement>("[data-depth]"),
  ).map((el) => ({
    depth: Number(el.dataset.depth),
    x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
    y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
  }));

  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    for (const l of layers) {
      l.x(-nx * l.depth);
      l.y(-ny * l.depth);
    }
  };

  window.addEventListener("pointermove", move, { passive: true });
  return () => window.removeEventListener("pointermove", move);
}
