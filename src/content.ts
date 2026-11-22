import { gsap, type Direction } from "./gsap";
import type { Splits } from "./split";

/*
  Convenções de marcação (data-attributes) lidas aqui:
  - data-split="heavy|serif"  títulos (SplitText)
  - data-in                   texto de apoio / elementos que sobem com fade
  - data-media                painéis de foto, revelados por clip-path
*/

/** Estado "antes de entrar" de todo o conteúdo de um slide */
export function resetContent(slide: HTMLElement, splits: Splits, dir: Direction = 1) {
  splits.hide(slide);
  gsap.set(slide.querySelectorAll("[data-in]"), { autoAlpha: 0, y: 28 * dir });
  gsap.set(slide.querySelectorAll("[data-media]"), { clipPath: "inset(100% 0% 0% 0%)" });
  gsap.set(slide.querySelectorAll("[data-media] img"), { scale: 1.3 });
}

/** Coreografia de entrada do conteúdo: fotos → títulos → textos */
export function contentIn(slide: HTMLElement, splits: Splits) {
  const tl = gsap.timeline();

  tl.to(
    slide.querySelectorAll("[data-media]"),
    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "ms.inOut", stagger: 0.1 },
    0,
  ).to(
    slide.querySelectorAll("[data-media] img"),
    { scale: 1, duration: 1.8, ease: "expo.out", stagger: 0.1 },
    0,
  );

  splits.reveal(slide, tl, 0.1);

  tl.to(
    slide.querySelectorAll("[data-in]"),
    { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 },
    0.4,
  );

  return tl;
}