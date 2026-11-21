// Hero.tsx
import { useState } from "react";

const MARCA = "MILKSEA";

type Aba = "Coleção" | "Lookbook" | "Drop";

type Conteudo = {
    imagem: string; // 👇 troque pelos caminhos das suas imagens
    selo: string;
    texto: string;
};

const CONTEUDO: Record<Aba, Conteudo> = {
    Coleção: {
        imagem: "/img/colecao.jpg",
        selo: "Coleção Inverno 26 já disponível",
        texto:
            "Cortes oversized, tecidos pesados e acabamento sob medida. Peças pensadas para durar mais que a estação.",
    },
    Lookbook: {
        imagem: "/img/lookbook.jpg",
        selo: "Lookbook 26 no ar",
        texto:
            "Combinações feitas na rua, com gente de verdade. Veja como a coleção ganha vida fora do estúdio.",
    },
    Drop: {
        imagem: "/img/drop.jpg",
        selo: "Drop 02 · Sexta, 22h",
        texto:
            "Edição limitada, poucas unidades por modelo. Entre na lista para ter acesso antes de todo mundo.",
    },
};

const LINKS = ["Início", "Coleção", "Lojas"] as const;
const ABAS = Object.keys(CONTEUDO) as Aba[];

// Granulado (noise) em SVG inline
const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function Hero() {
    const [ativoNav, setAtivoNav] = useState<string>(LINKS[0]);
    const [aba, setAba] = useState<Aba>("Coleção");
    const [menuAberto, setMenuAberto] = useState<boolean>(false);

    const atual = CONTEUDO[aba];

    return (
        <section className="relative isolate h-svh min-h-[640px] w-full overflow-hidden bg-sea font-sans text-milk">
            {/* Imagem principal */}
            <img
                key={aba}
                src={atual.imagem}
                alt={`${MARCA} · ${aba}`}
                className="absolute inset-0 -z-30 h-full w-full object-cover object-[65%_center] transition-opacity duration-500 md:object-[75%_center]"
            />

            {/* Tom índigo sobre a imagem */}
            <div className="absolute inset-0 -z-20 bg-sea/60 mix-blend-multiply" />

            {/* Vinheta nas bordas */}
            <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_60%_45%,transparent_35%,rgba(10,5,45,0.55)_100%)]" />

            {/* Degradê lateral para legibilidade do texto */}
            <div className="absolute inset-0 -z-20 bg-linear-to-r from-sea/85 via-sea/20 to-transparent md:from-sea/60" />

            {/* Granulado */}
            <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22] mix-blend-overlay"
                style={{ backgroundImage: GRAIN }}
            />

            {/* ───────── Header ───────── */}
            <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-6 sm:px-8 lg:px-[104px] lg:pt-[20px]">
                {/* Logo */}
                <a href="#" aria-label={MARCA} className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-milk font-script text-lg font-black italic leading-none text-sea">
                        m
                    </span>
                    <span className="hidden font-heavy text-sm tracking-tight lg:inline">{MARCA}</span>
                </a>

                {/* Nav central (tablet/desktop) */}
                <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
                    {LINKS.map((l) => (
                        <button
                            key={l}
                            onClick={() => setAtivoNav(l)}
                            className={`rounded-full px-4 py-2 text-[13px] transition ${ativoNav === l
                                    ? "bg-milk font-semibold text-sea"
                                    : "bg-sea/40 text-milk/90 backdrop-blur-sm hover:bg-sea/60"
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
                        className="hidden rounded-full bg-sea/40 px-4 py-2 text-[13px] text-milk/90 backdrop-blur-sm transition hover:bg-sea/60 sm:inline-block"
                    >
                        Entrar na lista do drop
                    </a>
                    <a
                        href="#"
                        className="rounded-full bg-milk px-5 py-2 text-[13px] font-semibold text-sea transition hover:bg-milk/90 sm:px-8 sm:py-2.5"
                    >
                        Comprar
                    </a>
                    {/* Botão menu mobile */}
                    <button
                        onClick={() => setMenuAberto((v) => !v)}
                        aria-label="Abrir menu"
                        aria-expanded={menuAberto}
                        className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-sea/40 backdrop-blur-sm md:hidden"
                    >
                        <span className="relative block h-3 w-4">
                            <span className={`absolute left-0 h-[1.5px] w-4 bg-milk transition ${menuAberto ? "top-1.5 rotate-45" : "top-0"}`} />
                            <span className={`absolute left-0 top-1.5 h-[1.5px] w-4 bg-milk transition ${menuAberto ? "opacity-0" : ""}`} />
                            <span className={`absolute left-0 h-[1.5px] w-4 bg-milk transition ${menuAberto ? "top-1.5 -rotate-45" : "top-3"}`} />
                        </span>
                    </button>
                </div>
            </header>

            {/* Menu mobile */}
            {menuAberto && (
                <div className="absolute inset-x-5 top-20 z-30 flex flex-col gap-1 rounded-3xl bg-sea/70 p-3 backdrop-blur-md md:hidden">
                    {LINKS.map((l) => (
                        <button
                            key={l}
                            onClick={() => {
                                setAtivoNav(l);
                                setMenuAberto(false);
                            }}
                            className={`rounded-2xl px-4 py-3 text-left text-sm ${ativoNav === l ? "bg-milk font-semibold text-sea" : "text-milk/90"
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                    <a href="#" className="rounded-2xl px-4 py-3 text-sm text-milk/90 sm:hidden">
                        Entrar na lista do drop
                    </a>
                </div>
            )}

            {/* ───────── Conteúdo ───────── */}
            <div className="relative z-10 flex h-full items-center px-5 sm:px-8 lg:px-[104px]">
                <div className="mt-24 max-w-[640px] sm:mt-16 lg:mt-24">
                    {/* Selo */}
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-sea/40 py-1 pl-1 pr-3 backdrop-blur-sm">
                        <span className="rounded-full bg-milk px-2.5 py-[3px] text-[11px] font-semibold text-sea">
                            Novo
                        </span>
                        <span className="text-[11px] text-milk/80">{atual.selo}</span>
                    </div>

                    {/* Título: sans pesada + serifada itálica */}
                    <h1 className="text-[44px] leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[76px]">
                        <span className="block font-heavy uppercase">Vista a sua</span>
                        <span className="block font-script font-black italic">Própria Rua</span>
                    </h1>

                    <p className="mt-5 max-w-[320px] text-[13px] leading-[1.5] text-milk/70 sm:max-w-[380px] sm:text-sm">
                        {atual.texto}
                    </p>

                    {/* CTA extra */}
                    <a
                        href="#"
                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-milk px-6 py-3 text-[13px] font-semibold text-sea transition hover:gap-3 hover:bg-milk/90"
                    >
                        Ver {aba === "Drop" ? "o drop" : aba === "Lookbook" ? "o lookbook" : "a coleção"}
                        <span aria-hidden>→</span>
                    </a>
                </div>
            </div>

            {/* ───────── Seletor lateral ───────── */}
            <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-row gap-2 md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col lg:right-[62px]">
                {ABAS.map((a) => (
                    <button
                        key={a}
                        onClick={() => setAba(a)}
                        aria-pressed={aba === a}
                        className={`rounded-full px-5 py-2 text-[13px] transition md:min-w-[50px] ${aba === a
                                ? "bg-milk font-semibold text-sea"
                                : "bg-sea/40 text-milk/70 backdrop-blur-sm hover:bg-sea/60"
                            }`}
                    >
                        {a}
                    </button>
                ))}
            </div>
        </section>
    );
}