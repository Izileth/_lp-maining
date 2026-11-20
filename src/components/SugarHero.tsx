// Hero.tsx
import { useState } from "react";

type Periodo = "Manhã" | "Tarde" | "Noite";

// 👇 Troque pelos caminhos das suas imagens (uma por aba lateral)
const IMAGENS: Record<Periodo, string> = {
    Manhã: "/img/manha.jpg",
    Tarde: "/img/tarde.jpg",
    Noite: "/img/noite.jpg",
};

const LINKS = ["Início", "Cardápio", "Lojas"] as const;
const PERIODOS = Object.keys(IMAGENS) as Periodo[];

// Granulado (noise) em SVG inline
const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function Hero() {
    const [ativoNav, setAtivoNav] = useState<string>(LINKS[0]);
    const [periodo, setPeriodo] = useState<Periodo>("Manhã");
    const [menuAberto, setMenuAberto] = useState<boolean>(false);

    return (
        <section className="relative isolate min-h-[640px] h-screen w-full overflow-hidden bg-[#e3231f] font-sans text-white">
            {/* Imagem principal */}
            <img
                key={periodo}
                src={IMAGENS[periodo]}
                alt="Destaque Sabora"
                className="absolute inset-0 -z-30 h-full w-full object-cover object-[65%_center] transition-opacity duration-500 md:object-[75%_center]"
            />

            {/* Tom vermelho sobre a imagem (efeito da referência) */}
            <div className="absolute inset-0 -z-20 bg-[#e3231f]/30 mix-blend-multiply" />

            {/* Vinheta nas bordas */}
            <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_60%_45%,transparent_35%,rgba(60,0,0,0.45)_100%)]" />

            {/* Degradê lateral para legibilidade do texto no mobile/tablet */}
            <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#c91d1a]/70 via-transparent to-transparent md:from-[#c91d1a]/30" />

            {/* Granulado */}
            <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22] mix-blend-overlay"
                style={{ backgroundImage: GRAIN }}
            />

            {/* ───────── Header ───────── */}
            <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-6 sm:px-8 lg:px-[104px] lg:pt-[20px]">
                {/* Logo */}
                <a
                    href="#"
                    aria-label="Sabora"
                    className="grid h-7 w-7 place-items-center rounded-full bg-white sm:h-8 sm:w-8"
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#e3231f]" fill="currentColor">
                        <path d="M18.5 3c-6 .3-11 3.8-11 9.2 0 2.2 1 3.8 2.6 4.6-.2-1.8.4-3.6 1.8-5 1.2-1.2 2.6-1.6 3.9-1.2-1.4.6-2.3 1.7-2.6 3.1-.4 1.8.5 3.5 2.2 4.3C12 20.5 8.5 21 6 19.2c-1.4-1-2.2-2.5-2.2-4.2" />
                    </svg>
                </a>

                {/* Nav central (desktop/tablet) */}
                <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
                    {LINKS.map((l) => (
                        <button
                            key={l}
                            onClick={() => setAtivoNav(l)}
                            className={`rounded-full px-4 py-2 text-[13px] transition ${ativoNav === l
                                    ? "bg-white font-medium text-neutral-900"
                                    : "bg-black/20 text-white/90 backdrop-blur-sm hover:bg-black/30"
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </nav>

                {/* Ações */}
                <div className="flex items-center gap-2">
                    <a
                        href="#"
                        className="hidden rounded-full bg-black/15 px-4 py-2 text-[13px] text-white/90 backdrop-blur-sm transition hover:bg-black/25 sm:inline-block"
                    >
                        Quero receber novidades
                    </a>
                    <a
                        href="#"
                        className="rounded-full bg-white px-5 py-2 text-[13px] font-medium text-neutral-900 transition hover:bg-white/90 sm:px-8 sm:py-2.5"
                    >
                        Pedir agora
                    </a>
                    {/* Botão menu mobile */}
                    <button
                        onClick={() => setMenuAberto((v) => !v)}
                        aria-label="Abrir menu"
                        className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-black/20 backdrop-blur-sm md:hidden"
                    >
                        <span className="relative block h-3 w-4">
                            <span className={`absolute left-0 h-[1.5px] w-4 bg-white transition ${menuAberto ? "top-1.5 rotate-45" : "top-0"}`} />
                            <span className={`absolute left-0 top-1.5 h-[1.5px] w-4 bg-white transition ${menuAberto ? "opacity-0" : ""}`} />
                            <span className={`absolute left-0 h-[1.5px] w-4 bg-white transition ${menuAberto ? "top-1.5 -rotate-45" : "top-3"}`} />
                        </span>
                    </button>
                </div>
            </header>

            {/* Menu mobile */}
            {menuAberto && (
                <div className="absolute inset-x-5 top-20 z-30 flex flex-col gap-1 rounded-3xl bg-black/40 p-3 backdrop-blur-md md:hidden">
                    {LINKS.map((l) => (
                        <button
                            key={l}
                            onClick={() => {
                                setAtivoNav(l);
                                setMenuAberto(false);
                            }}
                            className={`rounded-2xl px-4 py-3 text-left text-sm ${ativoNav === l ? "bg-white text-neutral-900" : "text-white/90"
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                    <a href="#" className="rounded-2xl px-4 py-3 text-sm text-white/90 sm:hidden">
                        Quero receber novidades
                    </a>
                </div>
            )}

            {/* ───────── Conteúdo ───────── */}
            <div className="relative z-10 flex h-full items-center px-5 sm:px-8 lg:px-[104px]">
                <div className="mt-24 max-w-[460px] sm:mt-16 lg:mt-24">
                    {/* Badge */}
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-black/15 py-1 pl-1 pr-3 backdrop-blur-sm">
                        <span className="rounded-full bg-white px-2.5 py-[3px] text-[11px] font-medium text-[#e3231f]">
                            Novo
                        </span>
                        <span className="text-[11px] text-white/80">Menu de verão já disponível</span>
                    </div>

                    <h1 className="text-[40px] font-light leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-[52px]">
                        Descubra o seu
                        <br />
                        Banquete Pessoal
                    </h1>

                    <p className="mt-4 max-w-[300px] text-[13px] leading-[1.45] text-white/60 sm:max-w-[330px] sm:text-sm">
                        Com ingredientes frescos e receitas feitas com carinho, a Sabora ajuda você a
                        aproveitar cada refeição do café da manhã à sobremesa.
                    </p>
                </div>
            </div>

            {/* ───────── Seletor lateral ───────── */}
            <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-row gap-2 md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col lg:right-[62px]">
                {PERIODOS.map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriodo(p)}
                        className={`rounded-full px-5 py-2 text-[13px] transition md:min-w-[50px] ${periodo === p
                                ? "bg-white font-medium text-neutral-900"
                                : "bg-black/20 text-white/70 backdrop-blur-sm hover:bg-black/30"
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </section>
    );
}