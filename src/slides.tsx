import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import {
    DROP_DATE,
    DROP_IMAGEM,
    HERO,
    LOJAS,
    LOOKS,
    MARCA,
    PRODUTOS,
} from "./data";
import { gsap, useGSAP } from "./motion/gsap";
import { createTabs, type Tabs } from "./motion/tabs";

export type SlideProps = { go: (i: number) => void };

/* ───────── Peças compartilhadas ───────── */

const PAD = "px-5 sm:px-8 lg:px-[104px]";
const TITULO = "text-[clamp(2.25rem,min(8vw,9.5svh),4.5rem)] leading-[0.98] tracking-[-0.03em]";

const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function Grain({ opacity = 0.22 }: { opacity?: number }) {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{ backgroundImage: GRAIN, opacity }}
        />
    );
}

/**
 * Casca de cada slide. O motor (engine.ts) só precisa de:
 * data-slide (a seção), data-inner (conteúdo que faz contra-movimento) e data-wipe.
 */
function Slide({
    label,
    bg,
    wipe = "flat",
    className = "",
    children,
}: {
    label: string;
    bg: string;
    wipe?: "flat" | "round";
    className?: string;
    children: ReactNode;
}) {
    return (
        <section
            data-slide
            data-wipe={wipe}
            aria-label={label}
            className={`absolute inset-0 overflow-hidden ${bg}`}
        >
            <div data-inner className={`h-full w-full ${className}`}>
                {children}
            </div>
        </section>
    );
}

/**
 * Foto com sobra de 16px por lado quando tem parallax (data-depth),
 * para o movimento nunca expor a borda. Não distorce: object-cover.
 */
function Photo({
    src,
    alt,
    depth,
    priority = false,
    hover = false,
    position = "center",
}: {
    src: string;
    alt: string;
    depth?: number;
    priority?: boolean;
    hover?: boolean;
    position?: string;
}) {
    return (
        <div data-depth={depth} className={`absolute ${depth !== undefined ? "-inset-4" : "inset-0"}`}>
            <div
                className={`h-full w-full ${hover ? "transition-transform duration-700 ease-out group-hover:scale-105" : ""}`}
            >
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? "eager" : "lazy"}
                    fetchPriority={priority ? "high" : "auto"}
                    decoding="async"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: position }}
                />
            </div>
        </div>
    );
}

function Emblem() {
    return (
        <div className="relative grid place-items-center text-milk">
            <svg data-emblem viewBox="0 0 120 120" aria-hidden className="h-24 w-24 lg:h-28 lg:w-28">
                <defs>
                    <path id="mk-circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text className="fill-milk font-heavy text-[10px] uppercase">
                    <textPath href="#mk-circ" textLength="270" lengthAdjust="spacing">
                        Edição limitada • {MARCA} •
                    </textPath>
                </text>
            </svg>
            <span className="absolute grid h-9 w-9 place-items-center rounded-full bg-milk font-script text-xl leading-none font-black italic text-sea">
                m
            </span>
        </div>
    );
}

/* ───────── 1. Início ───────── */

export function Inicio({ go }: SlideProps) {
    const scope = useRef<HTMLDivElement>(null);
    const tabs = useRef<Tabs | null>(null);

    useGSAP(
        () => {
            const el = scope.current;
            if (!el) return;
            const t = createTabs(el, {
                reduce: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
                // Avisa o resto do site (emblema, ticker) sem acoplar os módulos
                onChange: () => el.dispatchEvent(new CustomEvent("mk:tab", { bubbles: true })),
            });
            tabs.current = t;
            return () => {
                t.destroy();
                tabs.current = null;
            };
        },
        { scope },
    );

    return (
        <Slide
            label="Início"
            bg="bg-milk text-sea"
            className={`flex flex-col gap-5 pt-[76px] pb-5 lg:flex-row lg:items-stretch lg:gap-12 lg:pt-[92px] ${PAD}`}
        >
            <div ref={scope} className="contents">
                {/* Texto */}
                <div className="flex shrink-0 flex-col justify-center lg:w-[46%]">
                    <div
                        data-in="badge"
                        className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-sea/8 py-1 pr-3 pl-1"
                    >
                        <span className="rounded-full bg-sea px-2.5 py-[3px] text-[11px] font-semibold text-milk">Novo</span>
                        <span className="grid">
                            {HERO.map((h, i) => (
                                <span key={h.aba} data-tab-item={i} className="col-start-1 row-start-1 text-[11px] text-sea/80">
                                    {h.selo}
                                </span>
                            ))}
                        </span>
                    </div>

                    <h1 className={TITULO}>
                        <span data-split="heavy" className="block font-heavy uppercase">
                            Vista a sua
                        </span>
                        <span data-split="serif" className="block font-script font-black italic">
                            Própria Rua
                        </span>
                    </h1>

                    <div data-in="text" className="mt-4 grid max-w-[380px]">
                        {HERO.map((h, i) => (
                            <p
                                key={h.aba}
                                data-tab-item={i}
                                className="col-start-1 row-start-1 text-[13px] leading-relaxed text-sea/70 sm:text-sm"
                            >
                                {h.texto}
                            </p>
                        ))}
                    </div>

                    <div data-in="cta" className="mt-5 grid lg:mt-7">
                        {HERO.map((h, i) => (
                            <div key={h.aba} data-tab-item={i} className="col-start-1 row-start-1 flex items-center gap-3">
                                <button
                                    data-magnetic
                                    onClick={() => go(h.destino)}
                                    className="group mk-solid mk-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold"
                                >
                                    {h.cta}
                                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </button>
                                <span className="hidden text-xs text-sea/50 sm:inline">Role, use ↓ ou deslize</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Painel fotográfico */}
                <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[28px] bg-sea lg:rounded-[40px]">
                    <div data-media className="absolute inset-0">
                        {HERO.map((h, i) => (
                            <div key={h.aba} data-tab-img={i} className="absolute inset-0">
                                <Photo src={h.imagem} alt={`${MARCA} · ${h.aba}`} depth={14} priority={i === 0} />
                            </div>
                        ))}
                    </div>
                    <div aria-hidden className="pointer-events-none absolute inset-0 bg-sea/25 mix-blend-multiply" />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,transparent_40%,rgba(10,5,45,0.45)_100%)]"
                    />
                    <Grain />

                    <div data-in="emblem" className="absolute top-3 right-3 sm:top-5 sm:right-5">
                        <div data-depth={-10}>
                            <Emblem />
                        </div>
                    </div>

                    <div
                        data-in="tabs"
                        role="group"
                        aria-label="Categorias"
                        className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2"
                    >
                        {HERO.map((h, i) => (
                            <button
                                key={h.aba}
                                data-tab-btn
                                aria-pressed={i === 0}
                                onClick={() => tabs.current?.select(i)}
                                className="rounded-full bg-sea/70 px-5 py-2 text-[13px] text-milk/85 transition-colors hover:bg-sea aria-pressed:bg-milk aria-pressed:font-semibold aria-pressed:text-sea aria-pressed:hover:bg-milk"
                            >
                                {h.aba}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Slide>
    );
}

/* ───────── 2. Coleção ───────── */

export function Colecao() {
    return (
        <Slide
            label="Coleção"
            bg="bg-milk text-sea"
            className={`flex flex-col gap-4 pt-[84px] pb-6 lg:gap-6 lg:pt-[104px] ${PAD}`}
        >
            <div className="flex items-end justify-between gap-4">
                <h2 className={TITULO}>
                    <span data-split="heavy" className="block font-heavy uppercase">
                        Coleção
                    </span>
                    <span data-split="serif" className="block font-script font-black italic">
                        Inverno 26
                    </span>
                </h2>
                <p data-in className="hidden pb-2 text-sm text-sea/60 sm:block">
                    {String(PRODUTOS.length).padStart(2, "0")} peças · Frete grátis acima de R$ 399
                </p>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 lg:grid-cols-4 lg:grid-rows-1 lg:gap-5">
                {PRODUTOS.map((p) => (
                    <article key={p.nome} className="group flex min-h-0 flex-col">
                        <div data-media className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-sea/10 lg:rounded-3xl">
                            <Photo src={p.imagem} alt={p.nome} hover />
                            {p.tag && (
                                <span className="absolute top-3 left-3 rounded-full bg-milk px-3 py-1 text-[11px] font-semibold text-sea">
                                    {p.tag}
                                </span>
                            )}
                            <button
                                aria-label={`Adicionar ${p.nome}`}
                                className="mk-solid absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:scale-110"
                            >
                                +
                            </button>
                        </div>
                        <div data-in className="mt-2 flex items-baseline justify-between gap-2">
                            <h3 className="text-[13px] leading-tight font-semibold sm:text-sm">{p.nome}</h3>
                            <span className="font-script text-base font-black italic">{p.preco}</span>
                        </div>
                    </article>
                ))}
            </div>
        </Slide>
    );
}

/* ───────── 3. Lookbook ───────── */

const ALTURAS = ["h-[72%]", "h-[90%]", "h-full"];

export function Lookbook({ go }: SlideProps) {
    return (
        <Slide
            label="Lookbook"
            bg="bg-white text-sea"
            className={`flex flex-col gap-5 pt-[84px] pb-6 lg:flex-row lg:items-stretch lg:gap-12 lg:pt-[104px] ${PAD}`}
        >
            <div className="flex shrink-0 flex-col justify-center lg:w-[36%]">
                <span data-in className="mb-3 text-xs tracking-[0.2em] text-sea/60 uppercase">
                    Lookbook 26
                </span>
                <h2 className={TITULO}>
                    <span data-split="serif" className="block font-script font-black italic">
                        Feito na
                    </span>
                    <span data-split="heavy" className="block font-heavy uppercase">
                        rua.
                    </span>
                </h2>
                <p data-in className="mt-4 max-w-[340px] text-[13px] leading-relaxed text-sea/70 sm:text-sm">
                    Fotografado em esquinas, estações e quadras com quem veste a marca todo dia. Nenhum estúdio, só a cidade.
                </p>
                <div data-in className="mt-5 w-fit">
                    <button
                        data-magnetic
                        onClick={() => go(3)}
                        className="group mk-solid mk-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold"
                    >
                        Ver o próximo drop
                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 items-end gap-3 lg:gap-5">
                {LOOKS.map((l, i) => (
                    <figure key={l.legenda} className={`group w-1/3 ${ALTURAS[i]}`}>
                        <div data-media className="relative h-full w-full overflow-hidden rounded-2xl bg-sea/10 lg:rounded-3xl">
                            <Photo src={l.imagem} alt={l.legenda} depth={10} hover />
                            <figcaption className="absolute bottom-3 left-3 rounded-full bg-milk/90 px-3 py-1 text-[11px] font-semibold">
                                {l.legenda}
                            </figcaption>
                        </div>
                    </figure>
                ))}
            </div>
        </Slide>
    );
}

/* ───────── 4. Drop (slide escuro) ───────── */

function Countdown() {
    const ref = useRef<HTMLDListElement>(null);

    // Atualiza o DOM direto (sem setState a cada segundo) e anima só o dígito que mudou
    useEffect(() => {
        const list = ref.current;
        if (!list) return;
        const cells = Array.from(list.querySelectorAll<HTMLElement>("[data-count]"));
        const last = ["", "", "", ""];
        let first = true;

        const tick = () => {
            const diff = Math.max(0, DROP_DATE.getTime() - Date.now());
            const next = [
                Math.floor(diff / 864e5),
                Math.floor(diff / 36e5) % 24,
                Math.floor(diff / 6e4) % 60,
                Math.floor(diff / 1e3) % 60,
            ].map((n) => String(n).padStart(2, "0"));

            next.forEach((v, i) => {
                if (v === last[i]) return;
                last[i] = v;
                cells[i].textContent = v;
                if (!first) {
                    gsap.fromTo(
                        cells[i],
                        { yPercent: 40, autoAlpha: 0.2 },
                        { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "ms.out", overwrite: true },
                    );
                }
            });
            first = false;
        };

        tick();
        const id = window.setInterval(tick, 1000);
        return () => {
            window.clearInterval(id);
            gsap.killTweensOf(cells);
        };
    }, []);

    return (
        <dl ref={ref} data-in className="mt-6 grid max-w-md grid-cols-4 gap-2 sm:gap-3">
            {["Dias", "Horas", "Min", "Seg"].map((rotulo) => (
                <div key={rotulo} className="rounded-2xl bg-milk/10 px-2 py-3 text-center sm:py-4">
                    <dd className="overflow-hidden font-heavy text-2xl tabular-nums sm:text-4xl">
                        <span data-count className="block">
                            00
                        </span>
                    </dd>
                    <dt className="mt-1 text-[10px] tracking-widest text-milk/60 uppercase">{rotulo}</dt>
                </div>
            ))}
        </dl>
    );
}

export function Drop() {
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        // 👇 Integre aqui com sua API / Mailchimp / etc.
        form.querySelector<HTMLElement>("[data-ok]")?.classList.remove("hidden");
        form.querySelector<HTMLElement>("[data-fields]")?.classList.add("hidden");
    };

    return (
        <Slide
            label="Drop 02"
            bg="bg-sea text-milk"
            wipe="round"
            className={`flex items-center pt-16 ${PAD}`}
        >
            <span
                aria-hidden
                className="pointer-events-none absolute -right-[2vw] -bottom-[6vw] font-heavy text-[48vw] leading-none text-milk/5 select-none lg:text-[30vw]"
            >
                02
            </span>

            <div className="relative z-10 flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                <div className="max-w-[620px]">
                    <span data-in className="mb-3 block text-xs tracking-[0.2em] text-milk/60 uppercase">
                        Edição limitada · Sexta, 22h
                    </span>
                    <h2 className={TITULO}>
                        <span data-split="heavy" className="block font-heavy uppercase">
                            Drop 02
                        </span>
                        <span data-split="serif" className="block font-script font-black italic">
                            chega já já
                        </span>
                    </h2>

                    <Countdown />

                    <form data-in onSubmit={onSubmit} className="mt-6 max-w-md">
                        <div data-fields className="flex flex-col gap-2 sm:flex-row">
                            <label className="sr-only" htmlFor="email-drop">
                                Seu melhor e-mail
                            </label>
                            <input
                                id="email-drop"
                                type="email"
                                required
                                placeholder="Seu melhor e-mail"
                                className="min-w-0 flex-1 rounded-full border border-milk/30 bg-milk/10 px-5 py-3 text-sm text-milk outline-none placeholder:text-milk/50 focus:border-milk"
                            />
                            <button
                                type="submit"
                                className="mk-press rounded-full bg-milk px-6 py-3 text-[13px] font-semibold text-sea"
                            >
                                Entrar na lista
                            </button>
                        </div>
                        <p data-ok role="status" className="hidden rounded-full bg-milk/10 px-6 py-3 text-sm">
                            Você está na lista ✓ Avisamos assim que abrir.
                        </p>
                    </form>
                </div>

                <div
                    data-media
                    className="relative hidden h-[min(64svh,560px)] w-[min(34vw,440px)] shrink-0 overflow-hidden rounded-[40px] bg-milk/10 lg:block"
                >
                    <Photo src={DROP_IMAGEM} alt="Drop 02" depth={12} />
                    <div aria-hidden className="absolute inset-0 bg-sea/25 mix-blend-multiply" />
                    <Grain />
                </div>
            </div>
        </Slide>
    );
}

/* ───────── 5. Lojas ───────── */

export function Lojas() {
    return (
        <Slide
            label="Lojas"
            bg="bg-milk text-sea"
            className={`flex flex-col gap-4 pt-[84px] pb-5 lg:pt-[104px] ${PAD}`}
        >
            <h2 className={TITULO}>
                <span data-split="heavy" className="block font-heavy uppercase">
                    Encontre a
                </span>
                <span data-split="serif" className="block font-script font-black italic">
                    {MARCA.toLowerCase()}
                </span>
            </h2>

            <ul className="flex min-h-0 flex-1 flex-col justify-center">
                {LOJAS.map((l) => (
                    <li
                        key={l.cidade}
                        data-in
                        className="group grid grid-cols-[1fr_auto] items-center gap-x-4 border-t border-sea/15 px-1 py-3 transition-colors last:border-b hover:bg-sea hover:text-milk sm:grid-cols-[1.1fr_1.6fr_1fr_auto] sm:px-4 sm:py-4"
                    >
                        <span className="font-heavy text-lg uppercase sm:text-xl">{l.cidade}</span>
                        <span className="col-span-2 row-start-2 text-[13px] opacity-70 sm:col-span-1 sm:row-start-auto">
                            {l.endereco}
                        </span>
                        <span className="hidden text-[13px] opacity-70 sm:block">{l.horario}</span>
                        <span aria-hidden className="text-xl transition-transform group-hover:translate-x-1">
                            →
                        </span>
                    </li>
                ))}
            </ul>

            <footer data-in className="flex flex-wrap items-center justify-between gap-3 text-xs text-sea/60">
                <span>© 2026 {MARCA}. Todos os direitos reservados.</span>
                <div className="flex gap-4 font-semibold text-sea">
                    <a href="#" className="hover:underline">
                        Instagram
                    </a>
                    <a href="#" className="hover:underline">
                        TikTok
                    </a>
                    <a href="#" className="hover:underline">
                        WhatsApp
                    </a>
                </div>
            </footer>
        </Slide>
    );
} 