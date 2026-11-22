import type { RefObject } from "react";
import { PALETA, SECOES } from "./data";
import { createChrome } from "./chorme";
import { resetContent } from "./content";
import {
  createEmblem,
  createMagnetic,
  createPointerParallax,
  createTicker,
} from "./effects";
import { createEngine, type Engine } from "./engine";
import { gsap, useGSAP } from "./motion/gsap";
import { buildIntro } from "./intro";
import { createSplits } from "./split";

/** Espera a fonte e a primeira foto, para a entrada não "pular" */
async function heroReady(root: HTMLElement) {
  const img = root.querySelector<HTMLImageElement>("[data-slide] img");
  const photo = img
    ? Promise.race([
        img.decode().catch(() => {}),
        new Promise((r) => setTimeout(r, 3000)),
      ])
    : Promise.resolve();
  await Promise.all([document.fonts.ready, photo]);
}

/**
 * Liga tudo: splits, cromo, engine, efeitos e intro.
 * Roda dentro de useGSAP (contexto com escopo) e limpa tudo no cleanup,
 * então funciona com React Strict Mode.
 */
export function useMilksea(
  root: RefObject<HTMLElement | null>,
  engineRef: { current: Engine | null },
) {
  useGSAP(
    (_context, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;

      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", el);
      const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      const mqPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      const reduce = () => mqReduce.matches;

      let cancelled = false;
      const undo: Array<() => void> = [];

      const boot = contextSafe(() => {
        if (cancelled) return;

        const splits = createSplits(el);
        undo.push(() => splits.destroy());
        slides.forEach((s) => resetContent(s, splits));

        const chrome = createChrome(el, {
          labels: SECOES.map((s) => s.rotulo),
          palettes: SECOES.map((s) => PALETA[s.tema]),
        });
        chrome.set(0);
        undo.push(() => chrome.destroy());

        const ticker = createTicker(el, reduce());
        const emblem = createEmblem(el, reduce());
        undo.push(
          () => ticker.destroy(),
          () => emblem.destroy(),
        );

        // Interações de ponteiro só em desktop com mouse e sem "reduzir movimento"
        if (mqPointer.matches && !reduce()) {
          undo.push(createMagnetic(el), createPointerParallax(el));
        }

        // As abas do hero avisam por evento, sem acoplar os módulos
        const onTab = () => {
          emblem.boost();
          ticker.kick();
        };
        el.addEventListener("mk:tab", onTab);
        undo.push(() => el.removeEventListener("mk:tab", onTab));

        const engine = createEngine({
          slides,
          splits,
          reduce,
          onTransition: (tl, ctx) => {
            chrome.sync(tl, ctx);
            emblem.boost();
            ticker.kick();
          },
        });
        engineRef.current = engine;
        undo.push(() => engine.destroy());

        // Entrada: qualquer toque/tecla acelera a animação (pular a intro)
        const intro = buildIntro(el, slides[0], splits);
        const skipEvents = [
          "pointerdown",
          "keydown",
          "wheel",
          "touchstart",
        ] as const;
        const skip = () => {
          intro.timeScale(6);
        };
        const offSkip = () =>
          skipEvents.forEach((ev) => window.removeEventListener(ev, skip));
        skipEvents.forEach((ev) =>
          window.addEventListener(ev, skip, { passive: true }),
        );
        undo.push(offSkip);

        intro.eventCallback("onComplete", () => {
          offSkip();
          engine.enable(); // só libera a navegação depois da entrada
        });

        if (reduce()) intro.progress(1, false);
        else intro.play();
      });

      heroReady(el).then(boot);

      return () => {
        cancelled = true;
        undo
          .splice(0)
          .reverse()
          .forEach((fn) => fn());
        engineRef.current = null;
      };
    },
    { scope: root },
  );
}
