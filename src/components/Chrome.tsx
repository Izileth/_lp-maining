import { useEffect, useRef, useState } from "react";
import { FRASES, MARCA } from "../data";
import { gsap, useGSAP } from "../motion/gsap";

/* ───────────────────────── Header ───────────────────────── */

type HeaderProps = { labels: string[]; onNavigate: (i: number) => void };

export function Header({ labels, onNavigate }: HeaderProps) {
    const [open, setOpen] = useState(false);
    const scope = useRef<HTMLDivElement>(null);
    const menu = useRef<gsap.core.Timeline | null>(null);

    // Menu mobile: uma timeline criada uma vez, reproduzida e revertida
    useGSAP(
        () => {
            const tl = gsap.timeline({ paused: true, defaults: { ease: "ms.out" } });
            tl.fromTo(
                "[data-menu]",
                { autoAlpha: 0, clipPath: "inset(0% 0% 100% 0% round 28px)" },
                { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 0.7 },
            ).from("[data-menu-item]", { autoAlpha: 0, y: 14, stagger: 0.05, duration: 0.5 }, 0.2);
            menu.current = tl;
        },
        { scope },
    );

    useEffect(() => {
        const tl = menu.current;
        if (!tl) return;
        if (open) tl.play();
        else if (tl.progress() > 0) tl.reverse();
    }, [open]);

    const ir = (i: number) => {
        setOpen(false);
        onNavigate(i);
    };

    return (
        <div ref={scope} className="contents">
            <header className="mk-ink fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-5 sm:px-8 lg:px-[104px] lg:pt-6">
                {/* Logo */}
                <button
                    data-intro="logo"
                    onClick={() => ir(0)}
                    aria-label={`${MARCA} — ir para o início`}
                    className="flex items-center gap-2"
                >
                    <span className="mk-solid grid h-9 w-9 place-items-center rounded-full font-script text-xl leading-none font-black italic">
                        m
                    </span>
                    <span className="hidden font-heavy text-sm tracking-tight lg:inline">{MARCA}</span>
                </button>

                {/* Navegação central (tablet/desktop) com pílula ativa deslizante */}
                <nav
                    data-nav
                    aria-label="Seções"
                    className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
                >
                    <span
                        data-nav-ind
                        aria-hidden
                        className="mk-solid absolute top-0 left-0 h-full rounded-full"
                    />
                    {labels.map((l, i) => (
                        <button
                            key={l}
                            data-nav-btn
                            data-i={i}
                            onClick={() => ir(i)}
                            className="mk-nav-btn relative z-10 rounded-full px-3 py-2 text-[12px] lg:px-4 lg:text-[13px]"
                        >
                            {l}
                        </button>
                    ))}
                </nav>

                {/* Ações */}
                <div data-intro="actions" className="flex items-center gap-2">
                    <div className="hidden lg:block">
                        <button
                            data-magnetic
                            onClick={() => ir(3)}
                            className="mk-pill mk-press rounded-full px-4 py-2 text-[13px]"
                        >
                            Entrar na lista do drop
                        </button>
                    </div>
                    <div>
                        <button
                            data-magnetic
                            onClick={() => ir(1)}
                            className="mk-solid mk-press rounded-full px-5 py-2 text-[13px] font-semibold sm:px-7 sm:py-2.5"
                        >
                            Comprar
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Abrir menu"
                            aria-expanded={open}
                            className="mk-pill ml-1 grid h-9 w-9 place-items-center rounded-full"
                        >
                            <span className="relative block h-3 w-4">
                                <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                                <span className={`absolute top-1.5 left-0 h-[1.5px] w-4 bg-current transition ${open ? "opacity-0" : ""}`} />
                                <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Menu mobile */}
            <div
                data-menu
                inert={!open}
                className="mk-paper mk-ink invisible fixed inset-x-5 top-[76px] z-50 flex flex-col gap-1 rounded-[28px] p-3 shadow-xl ring-1 ring-current/15 md:hidden"
            >
                {labels.map((l, i) => (
                    <button
                        key={l}
                        data-menu-item
                        data-i={i}
                        onClick={() => ir(i)}
                        className="mk-menu-item rounded-2xl px-4 py-3 text-left text-sm"
                    >
                        {l}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ───────────────────────── Paginação vertical + contador ───────────────────────── */

type PaginationProps = {
    labels: string[];
    onNavigate: (i: number) => void;
    onStep: (dir: 1 | -1) => void;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function Pagination({ labels, onNavigate, onStep }: PaginationProps) {
    const total = labels.length;

    return (
        <div className="pointer-events-none fixed inset-y-0 right-0.5 z-50 flex items-center sm:right-3 lg:right-8">
            <nav
                data-intro="pagination"
                aria-label="Navegação entre slides"
                className="mk-ink pointer-events-auto flex flex-col items-center gap-3"
            >
                {/* Setas (desktop) */}
                <button
                    onClick={() => onStep(-1)}
                    aria-label="Slide anterior"
                    className="mk-pill mk-press hidden h-8 w-8 place-items-center rounded-full lg:grid"
                >
                    ↑
                </button>

                {/* Contador rolante: uma "fita" de números que sobe/desce */}
                <div
                    aria-hidden
                    className="hidden flex-col items-center gap-1 font-heavy text-[11px] tabular-nums lg:flex"
                >
                    <div className="h-[1.25em] overflow-hidden leading-[1.25em]">
                        <div data-counter-strip>
                            {labels.map((_, i) => (
                                <span key={i} className="block h-[1.25em] leading-[1.25em]">
                                    {pad(i + 1)}
                                </span>
                            ))}
                        </div>
                    </div>
                    <span className="opacity-40">/ {pad(total)}</span>
                </div>

                {/* Trilho com progresso */}
                <div className="relative h-36 w-4 lg:h-44">
                    <div className="absolute inset-0 flex justify-center">
                        <span className="h-full w-px bg-current opacity-20" />
                    </div>
                    <div className="absolute inset-0 flex justify-center">
                        <span data-pg-fill className="h-full w-px origin-top bg-current" />
                    </div>
                    {labels.map((l, i) => (
                        <button
                            key={l}
                            data-pg-dot
                            data-i={i}
                            onClick={() => onNavigate(i)}
                            aria-label={`Ir para ${l}`}
                            className="absolute left-0 -mt-2 flex h-4 w-4 items-center justify-center"
                            style={{ top: `${(i / (total - 1)) * 100}%` }}
                        >
                            <span className="block h-1.5 w-1.5 rounded-full bg-current" />
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onStep(1)}
                    aria-label="Próximo slide"
                    className="mk-pill mk-press hidden h-8 w-8 place-items-center rounded-full lg:grid"
                >
                    ↓
                </button>
            </nav>
        </div>
    );
}

/* ───────────────────────── Ticker ───────────────────────── */

function Group({ hidden }: { hidden?: boolean }) {
    return (
        <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
            {[...FRASES, ...FRASES].map((f, i) => (
                <span key={i} className="mx-6 flex items-center text-xs tracking-widest whitespace-nowrap uppercase">
                    <span className="font-heavy">{f}</span>
                    <span className="ml-12 font-script italic">✦</span>
                </span>
            ))}
        </div>
    );
}

export function Ticker() {
    return (
        <div
            data-intro="ticker"
            data-ticker
            aria-label="Destaques da marca"
            className="mk-solid fixed inset-x-0 bottom-0 z-40 h-10 overflow-hidden"
        >
            {/* Dois grupos idênticos: o loop anda -50% e recomeça sem salto */}
            <div data-ticker-track className="flex h-full w-max items-center">
                <Group />
                <Group hidden />
            </div>
        </div>
    );
} 