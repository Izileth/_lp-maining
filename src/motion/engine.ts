import { gsap, Observer, type Direction } from "./gsap";
import { contentIn, resetContent } from "../content";
import type { Splits } from "../split";

export type TransitionCtx = { from: number; to: number; dir: Direction };

export type EngineOptions = {
  slides: HTMLElement[];
  splits: Splits;
  reduce: () => boolean;
  /** Permite ao "cromo" (contador, paginação, tema) entrar na mesma timeline */
  onTransition?: (tl: gsap.core.Timeline, ctx: TransitionCtx) => void;
};

export type Engine = {
  go(to: number, opts?: { queue?: boolean }): boolean;
  readonly index: number;
  enable(): void;
  disable(): void;
  destroy(): void;
};

const DURATION = 1.15;

export function createEngine({
  slides,
  splits,
  reduce,
  onTransition,
}: EngineOptions): Engine {
  const stage = slides[0].parentElement as HTMLElement;
  const shade = stage.querySelector<HTMLElement>("[data-shade]");
  const last = slides.length - 1;

  let index = 0;
  let busy = false;
  let enabled = false;
  let armed = true; // 1 troca por gesto de roda
  let pending: number | null = null;
  let active: gsap.core.Timeline | null = null;
  let contentTl: gsap.core.Timeline | null = null; // entrada do conteúdo (independe do lock)

  slides.forEach((s, i) => {
    gsap.set(s, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 0 });
    s.inert = i !== 0;
  });

  function finish(from: number, to: number) {
    const out = slides[from];
    const inc = slides[to];
    gsap.set(out, { autoAlpha: 0, zIndex: 0 });
    out.inert = true;
    gsap.set(
      [out, inc].map((s) => s.querySelector("[data-inner]")),
      { clearProps: "transform" },
    );
    gsap.set(inc, { clearProps: "clipPath" });
    if (shade) gsap.set(shade, { opacity: 0 });
    resetContent(out, splits);

    active = null;
    busy = false;

    // Um clique feito durante a animação vira "próximo destino"
    if (pending !== null && pending !== index) {
      const next = pending;
      pending = null;
      go(next);
    } else {
      pending = null;
    }
  }

  function go(target: number, { queue = false }: { queue?: boolean } = {}) {
    const to = gsap.utils.clamp(0, last, target);
    if (!enabled) return false;
    if (busy) {
      if (queue) pending = to;
      return false;
    }
    if (to === index) return false;

    contentTl?.progress(1, false); // fecha a entrada anterior antes de começar outra
    contentTl = null;

    const from = index;
    const dir: Direction = to > from ? 1 : -1;
    const inc = slides[to];
    const out = slides[from];
    const round = inc.dataset.wipe === "round"; // variação: cantos arredondados que "fecham"

    const corner = round ? " round 56px" : "";
    const hidden =
      dir > 0
        ? `inset(100% 0% 0% 0%${corner})`
        : `inset(0% 0% 100% 0%${corner})`;
    const shown = `inset(0% 0% 0% 0%${round ? " round 0px" : ""})`;
    const dur = round ? DURATION + 0.2 : DURATION;

    busy = true;
    index = to;
    inc.inert = false;

    resetContent(inc, splits, dir);
    gsap.set(inc, { autoAlpha: 1, zIndex: 2, clipPath: hidden });
    gsap.set(out, { zIndex: 1 });

    const inInner = inc.querySelector("[data-inner]");
    const outInner = out.querySelector("[data-inner]");

    const tl = gsap.timeline({
      defaults: { ease: "ms.inOut" },
      onComplete: () => finish(from, to),
    });
    active = tl;

    // Slide novo entra por máscara; o que sai recua em câmera lenta (profundidade)
    tl.to(inc, { clipPath: shown, duration: dur }, 0)
      .fromTo(
        inInner,
        { yPercent: 14 * dir },
        { yPercent: 0, duration: dur },
        0,
      )
      .to(outInner, { yPercent: -10 * dir, duration: dur }, 0);
    if (shade) tl.to(shade, { opacity: 0.45, duration: dur }, 0);

    // Conteúdo entra numa timeline própria: a navegação destrava quando o wipe termina
    contentTl = contentIn(inc, splits).delay(dur * 0.42);

    onTransition?.(tl, { from, to, dir });

    if (reduce()) tl.timeScale(100); // prefers-reduced-motion: troca praticamente instantânea
    return true;
  }

  /* ───────── Entradas do usuário ───────── */

  const step = (dir: Direction, self?: Observer) => {
    if (!enabled) return;
    const isWheel = self?.event?.type === "wheel";
    if (isWheel) {
      if (!armed) return;
      armed = false; // consome o gesto: inércia do trackpad não dispara outra troca
    }
    go(index + dir);
  };

  const observer = Observer.create({
    target: window,
    type: "wheel,touch",
    wheelSpeed: -1, // alinha o sentido da roda com o do toque
    tolerance: 14,
    preventDefault: true,
    allowClicks: true,
    ignore: "input, textarea, select",
    onStopDelay: 0.15,
    onStop: () => {
      armed = true;
    },
    onUp: (self) => step(1, self),
    onDown: (self) => step(-1, self),
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    if (
      (e.target as HTMLElement | null)?.closest(
        "input, textarea, select, [contenteditable]",
      )
    )
      return;

    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
      case "PageDown":
        e.preventDefault();
        go(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        go(index - 1);
        break;
      case "Home":
        e.preventDefault();
        go(0);
        break;
      case "End":
        e.preventDefault();
        go(last);
        break;
    }
  };
  window.addEventListener("keydown", onKey);

  return {
    go,
    get index() {
      return index;
    },
    enable() {
      enabled = true;
    },
    disable() {
      enabled = false;
    },
    destroy() {
      observer.kill();
      window.removeEventListener("keydown", onKey);
      active?.kill();
      contentTl?.kill();
    },
  };
}
