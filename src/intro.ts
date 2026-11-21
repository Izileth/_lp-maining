import { gsap } from "./gsap";
import type { Splits } from "./split";

/*
  Entrada cinematográfica (uma única master timeline).
  Ritmo: movimento → pausa → movimento. Nada anima tudo ao mesmo tempo.
  1 composição  2 logo  3 menu  4 título  5 apoio  6 CTA  7 foto  8 emblema  9 indicadores  10 ticker
*/
export function buildIntro(
  root: HTMLElement,
  slide: HTMLElement,
  splits: Splits,
) {
  const all = <T extends HTMLElement>(sel: string, scope: ParentNode = root) =>
    Array.from(scope.querySelectorAll<T>(sel));
  const part = (name: string) => all(`[data-in='${name}']`, slide);

  const curtain = all("[data-curtain]");
  const logo = all("[data-intro='logo']");
  const nav = all("[data-nav-btn]");
  const actions = all("[data-intro='actions'] > *");
  const ind = all("[data-nav-ind]");
  const pagination = all("[data-intro='pagination']");
  const ticker = all("[data-intro='ticker']");
  const media = all("[data-media]", slide);
  const mediaImgs = all("[data-media] img", slide);

  // Estados iniciais (a cortina ainda cobre a tela)
  gsap.set(logo, { autoAlpha: 0, scale: 0.6 });
  gsap.set([...nav, ...actions], { autoAlpha: 0, y: -16 });
  gsap.set(ind, { autoAlpha: 0 });
  gsap.set(pagination, { autoAlpha: 0, x: 18 });
  gsap.set(ticker, { yPercent: 100 });
  gsap.set(part("emblem"), { scale: 0.5 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: "ms.out" } });

  tl.to(curtain, { yPercent: -100, duration: 1.1, ease: "ms.inOut" }, 0.15) // 1
    .to(logo, { autoAlpha: 1, scale: 1, duration: 0.9 }, 0.95) // 2
    .to(
      [...nav, ...actions],
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 },
      1.1,
    ) // 3
    .to(ind, { autoAlpha: 1, duration: 0.6 }, 1.5);

  splits.reveal(slide, tl, 1.55); // 4 (termina por volta de 3.2s: respiro visual)

  tl.to(
    [...part("badge"), ...part("text")],
    { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" },
    2.5,
  ) // 5
    .to(
      part("cta"),
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
      2.9,
    ) // 6
    .to(
      media,
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "ms.inOut" },
      3.15,
    ) // 7
    .to(mediaImgs, { scale: 1, duration: 2.2, ease: "expo.out" }, 3.15)
    .to(
      part("emblem"),
      { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: "back.out(1.6)" },
      4.2,
    ) // 8
    .to(
      part("tabs"),
      { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
      4.4,
    )
    .to(
      pagination,
      { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
      4.55,
    ) // 9
    .to(ticker, { yPercent: 0, duration: 0.9, ease: "ms.inOut" }, 4.8) // 10
    .set(curtain, { display: "none" });

  return tl;
}
