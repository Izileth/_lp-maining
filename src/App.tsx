import type { ComponentType } from "react";
import Header from "./Header";
import { SECOES } from "./data";
import { Colecao, Drop, Inicio, Lojas, Lookbook, type SlideProps } from "./slides";
import { useSlides } from "./useSlides";

// Mesma ordem de SECOES
const SLIDES: ComponentType<SlideProps>[] = [Inicio, Colecao, Lookbook, Drop, Lojas];

export default function App() {
  const { index, goTo } = useSlides(SLIDES.length);
  const tema = SECOES[index].tema;
  const escuro = tema === "escuro";

  return (
    <>
      <Header index={index} goTo={goTo} tema={tema} />

      {/* Pontos laterais */}
      <nav
        aria-label="Slides"
        className={`fixed right-1.5 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3 transition-colors duration-700 sm:right-3 lg:right-8 ${escuro ? "text-milk" : "text-sea"
          }`}
      >
        <span className="mb-1 hidden font-heavy text-[10px] tabular-nums lg:block">
          {String(index + 1).padStart(2, "0")}/{String(SLIDES.length).padStart(2, "0")}
        </span>
        {SECOES.map((s, i) => (
          <button
            key={s.rotulo}
            onClick={() => goTo(i)}
            aria-label={`Ir para ${s.rotulo}`}
            aria-current={index === i}
            className={`w-1.5 rounded-full bg-current transition-all duration-500 ${index === i ? "h-7 opacity-100" : "h-1.5 opacity-30 hover:opacity-60"
              }`}
          />
        ))}
      </nav>

      {/* Palco dos slides */}
      <main className="fixed inset-0 touch-none overflow-hidden bg-milk">
        <div
          className="h-svh transition-transform duration-900 ease-slide will-change-transform"
          style={{ transform: `translate3d(0, -${index * 100}%, 0)` }}
        >
          {SLIDES.map((Slide, i) => (
            <Slide key={i} active={i === index} goTo={goTo} />
          ))}
        </div>
      </main>
    </>
  );
}