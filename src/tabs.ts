import { gsap } from "./gsap";

export type Tabs = { select(i: number): void; destroy(): void };

/*
  Abas do hero (Coleção / Lookbook / Drop).
  Marcação esperada dentro de `root`:
  - [data-tab-img="i"]   foto de cada aba (empilhadas)
  - [data-tab-item="i"]  textos/CTAs de cada aba (empilhados em grid, sem layout shift)
  - [data-tab-btn]       botões do seletor
*/
export function createTabs(
  root: HTMLElement,
  opts: { reduce: () => boolean; onChange?: () => void },
): Tabs {
  const imgs = Array.from(root.querySelectorAll<HTMLElement>("[data-tab-img]"));
  const items = Array.from(
    root.querySelectorAll<HTMLElement>("[data-tab-item]"),
  );
  const btns = Array.from(root.querySelectorAll<HTMLElement>("[data-tab-btn]"));

  const idx = (el: HTMLElement) => Number(el.dataset.tabItem);
  const itemsOf = (i: number) => items.filter((el) => idx(el) === i);

  let current = 0;
  let tl: gsap.core.Timeline | null = null;

  const a11y = (i: number) => {
    btns.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
    items.forEach((el) => {
      const on = idx(el) === i;
      el.inert = !on; // CTA da aba escondida não recebe foco
      el.setAttribute("aria-hidden", String(!on));
    });
  };

  imgs.forEach((el, i) =>
    gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 }),
  );
  gsap.set(
    items.filter((el) => idx(el) !== 0),
    { autoAlpha: 0 },
  );
  a11y(0);

  const select = (next: number) => {
    if (next === current || next < 0 || next >= imgs.length) return;

    // Clique rápido: finaliza a troca anterior na hora, sem sobrepor animações
    tl?.progress(1, false);

    const from = current;
    const dir = next > from ? 1 : -1;
    current = next;
    a11y(next);

    const inn = imgs[next];
    const out = imgs[from];

    gsap.set(inn, {
      autoAlpha: 1,
      zIndex: 2,
      clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    });
    gsap.set(out, { zIndex: 1 });

    const t = gsap.timeline({
      defaults: { ease: "ms.inOut" },
      onComplete: () => {
        gsap.set(out, { autoAlpha: 0, zIndex: 0 });
        gsap.set(inn, { clipPath: "none", zIndex: 1 });
        if (tl === t) tl = null;
      },
    });

    // Foto: nova entra por máscara lateral; a antiga recua com escala e deslocamento
    t.to(inn, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05 }, 0)
      .fromTo(
        inn.querySelector("img"),
        { scale: 1.25, xPercent: 6 * dir },
        {
          scale: 1,
          xPercent: 0,
          duration: 1.5,
          ease: "expo.out",
          overwrite: "auto",
        },
        0,
      )
      .to(
        out.querySelector("img"),
        { scale: 1.12, xPercent: -5 * dir, duration: 1.05 },
        0,
      )
      // Texto: sai rápido, entra logo depois
      .to(
        itemsOf(from),
        { autoAlpha: 0, y: -14, duration: 0.35, ease: "power2.in" },
        0,
      )
      .fromTo(
        itemsOf(next),
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
        },
        0.3,
      );

    tl = t;
    opts.onChange?.();
    if (opts.reduce()) t.progress(1, false);
  };

  return {
    select,
    destroy() {
      tl?.kill();
      tl = null;
    },
  };
}
