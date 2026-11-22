import { useCallback, useRef, type ComponentType } from "react";
import { Header, Pagination, Ticker } from "./components/Chrome";
import { SECOES } from "./data";
import type { Engine } from "./motion/engine";
import { useMilksea } from "./hooks/useMilkSea";
import { Colecao, Drop, Inicio, Lojas, Lookbook, type SlideProps } from "./slides";

// Mesma ordem de SECOES em data.ts
const SLIDES: ComponentType<SlideProps>[] = [Inicio, Colecao, Lookbook, Drop, Lojas];
const LABELS = SECOES.map((s) => s.rotulo);

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine | null>(null);

  useMilksea(root, engine);

  // Cliques durante uma transição entram na fila (só o último vale)
  const go = useCallback((i: number) => {
    engine.current?.go(i, { queue: true });
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    const e = engine.current;
    if (e) e.go(e.index + dir, { queue: true });
  }, []);

  return (
    <div ref={root} className="mk-paper fixed inset-0 touch-none overflow-hidden">
      <Header labels={LABELS} onNavigate={go} />
      <Pagination labels={LABELS} onNavigate={go} onStep={step} />

      {/* Palco: acima do ticker (h-10). Slides empilhados; o engine alterna a visibilidade */}
      <main className="absolute inset-x-0 top-0 bottom-10 overflow-hidden">
        {SLIDES.map((Slide, i) => (
          <Slide key={i} go={go} />
        ))}
        {/* Sombra que escurece o slide que está saindo (entre os dois na ordem de empilhamento) */}
        <div
          data-shade
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-sea opacity-0"
          style={{ zIndex: 1 }}
        />
      </main>

      <Ticker />

      {/* Anuncia a seção atual para leitores de tela */}
      <p data-live aria-live="polite" className="sr-only" />

      {/* Cortina da entrada: cobre a tela até as fontes e a foto carregarem */}
      <div data-curtain aria-hidden className="fixed inset-0 z-[70] bg-sea" />
    </div>
  );
}