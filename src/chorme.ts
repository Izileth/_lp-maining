import { gsap } from "./gsap";
//import type { TransitionCtx } from "./engine";

export type Palette = { ink: string; paper: string };

/*
  "Cromo" = tudo que fica fixo na tela e acompanha os slides:
  contador rolante, paginação vertical com progresso, pílula ativa do menu,
  cores do tema e anúncio para leitores de tela.
*/
export function createChrome(
  root: HTMLElement,
  cfg: { labels: string[]; palettes: Palette[] },
) {
  const { labels, palettes } = cfg;
  const total = labels.length;

  const one = <T extends HTMLElement>(sel: string) =>
    root.querySelector<T>(sel)!;
  const all = <T extends HTMLElement>(sel: string) =>
    Array.from(root.querySelectorAll<T>(sel));

  const strip = one("[data-counter-strip]");
  const fill = one("[data-pg-fill]");
  const ind = one("[data-nav-ind]");
  const nav = one("[data-nav]");
  const live = one("[data-live]");
  const dots = all("[data-pg-dot]");
  const navBtns = all("[data-nav-btn]");
  const marked = all("[data-i]");

  let current = 0;

  const vars = (i: number) => ({
    "--ink": palettes[i].ink,
    "--paper": palettes[i].paper,
  });
  const stripY = (i: number) => -(100 / total) * i;
  const dotState = (k: number, i: number) => ({
    scale: k === i ? 1.9 : 1,
    opacity: k <= i ? 1 : 0.3,
  });
  const pos = (i: number) => ({
    x: navBtns[i]?.offsetLeft ?? 0,
    width: navBtns[i]?.offsetWidth ?? 0,
  });

  const mark = (i: number) => {
    marked.forEach((el) => {
      if (Number(el.dataset.i) === i) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });
    live.textContent = labels[i];
  };

  /** Estado imediato (sem animação) */
  const set = (i: number) => {
    current = i;
    gsap.set(strip, { yPercent: stripY(i) });
    gsap.set(fill, { scaleY: total > 1 ? i / (total - 1) : 0 });
    dots.forEach((d, k) => gsap.set(d.firstElementChild, dotState(k, i)));
    gsap.set(ind, pos(i));
    gsap.set(document.documentElement, vars(i));
    mark(i);
  };

  /** Adiciona as animações do cromo à timeline de transição */
  const sync = (tl: gsap.core.Timeline, { to }: TransitionCtx) => {
    current = to;
    tl.to(strip, { yPercent: stripY(to), duration: 0.95, ease: "ms.inOut" }, 0)
      .to(
        fill,
        {
          scaleY: total > 1 ? to / (total - 1) : 0,
          duration: 0.95,
          ease: "ms.inOut",
        },
        0,
      )
      .to(ind, { ...pos(to), duration: 0.9, ease: "ms.inOut" }, 0)
      .to(
        document.documentElement,
        { ...vars(to), duration: 0.9, ease: "power2.inOut" },
        0.05,
      );
    dots.forEach((d, k) => {
      tl.to(
        d.firstElementChild,
        { ...dotState(k, to), duration: 0.6, ease: "power3.out" },
        0.1,
      );
    });
    mark(to);
  };

  // A pílula precisa se reposicionar quando o menu aparece/some ou a fonte carrega
  const ro = new ResizeObserver(() => gsap.set(ind, pos(current)));
  ro.observe(nav);

  return {
    set,
    sync,
    destroy() {
      ro.disconnect();
    },
  };
}
