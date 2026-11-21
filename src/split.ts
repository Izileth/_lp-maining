import { gsap, SplitText } from "./gsap";

/*
  Duas "personalidades" tipográficas (data-split="heavy" | "serif"):
  - heavy: sans pesada, entrada curta e decidida
  - serif: itálica, entrada longa, fluida, com leve inclinação
  Sempre por linhas (com máscara), nunca letra por letra.
*/
type Kind = "heavy" | "serif";

type Entry = {
  el: HTMLElement;
  kind: Kind;
  lines: Element[];
  shown: boolean;
  split?: SplitText;
};

const HIDDEN: Record<Kind, gsap.TweenVars> = {
  heavy: { yPercent: 118, transformOrigin: "0% 100%" },
  serif: { yPercent: 112, skewY: 7, transformOrigin: "0% 100%" },
};

export function createSplits(root: HTMLElement) {
  const entries: Entry[] = [];

  root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    const entry: Entry = {
      el,
      kind: el.dataset.split === "serif" ? "serif" : "heavy",
      lines: [],
      shown: false,
    };

    entry.split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "mk-line",
      autoSplit: true, // refaz o split ao carregar fontes e ao redimensionar
      onSplit(self) {
        entry.lines = self.lines;
        // Preserva o estado caso o split seja refeito depois de revelado
        gsap.set(
          entry.lines,
          entry.shown ? { yPercent: 0, skewY: 0 } : HIDDEN[entry.kind],
        );
      },
    });

    entries.push(entry);
  });

  const within = (slide: HTMLElement) =>
    entries.filter((e) => slide.contains(e.el));

  return {
    /** Esconde os títulos de um slide (estado inicial antes da entrada) */
    hide(slide: HTMLElement) {
      within(slide).forEach((e) => {
        e.shown = false;
        gsap.set(e.lines, HIDDEN[e.kind]);
      });
    },

    /** Adiciona a revelação dos títulos do slide a uma timeline */
    reveal(slide: HTMLElement, tl: gsap.core.Timeline, at = 0) {
      within(slide).forEach((e, i) => {
        const t = at + i * 0.16;
        tl.call(
          () => {
            e.shown = true;
          },
          undefined,
          t,
        );
        if (e.kind === "heavy") {
          tl.to(
            e.lines,
            { yPercent: 0, duration: 0.85, ease: "power4.out", stagger: 0.07 },
            t,
          );
        } else {
          tl.to(
            e.lines,
            {
              yPercent: 0,
              skewY: 0,
              duration: 1.6,
              ease: "expo.out",
              stagger: 0.12,
            },
            t + 0.08,
          );
        }
      });
      return tl;
    },

    destroy() {
      entries.forEach((e) => e.split?.revert());
    },
  };
}

export type Splits = ReturnType<typeof createSplits>;
