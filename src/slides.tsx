import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type FormEvent,
    type ReactNode,
} from "react";
import {
    DROP_DATE,
    DROP_IMAGEM,
    FRASES,
    HERO,
    LOJAS,
    LOOKS,
    MARCA,
    PRODUTOS,
    type Aba,
} from "./data";

export type SlideProps = { active: boolean; goTo: (i: number) => void };

/* ───────── Utilitários ───────── */

// Atraso (ms) para a animação de entrada de cada elemento
const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function Grain({ opacity = 0.22 }: { opacity?: number }) {
    return (
        <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{ backgroundImage: GRAIN, opacity }}
        />
    );
}

function Slide({
    active,
    className = "",
    children,
}: {
    active: boolean;
    className?: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLElement>(null);

    // Slides fora da tela não recebem foco do teclado
    useEffect(() => {
        if (ref.current) ref.current.inert = !active;
    }, [active]);

    return (
        <section
            ref={ref}
            data-active={active}
            className={`relative h-svh w-full overflow-hidden ${className}`}
        >
            {children}
        </section>
    );
}

const PAD = "px-5 sm:px-8 lg:px-[104px]";
const TITULO = "text-[clamp(2.25rem,min(9vw,10svh),5.5rem)] leading-[0.98] tracking-[-0.03em]";

function Marquee() {
    const itens = [...FRASES, ...FRASES];
    return (
        <div
            aria-hidden
            className="relative z-10 flex h-10 shrink-0 items-center overflow-hidden bg-sea text-milk"
        >
            <div className="flex w-max animate-marquee whitespace-nowrap">
                {[0, 1].map((k) => (
                    <div key={k} className="flex shrink-0 items-center">
                        {itens.map((f, i) => (
                            <span key={`${k}-${i}`} className="mx-6 text-xs uppercase tracking-widest">
                                <span className="font-heavy">{f}</span>
                                <span className="ml-6 font-script italic">✦</span>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ───────── 1. Início ───────── */

const ABAS = Object.keys(HERO) as Aba[];

export function Inicio({ active, goTo }: SlideProps) {
    const [aba, setAba] = useState<Aba>("Coleção");
    const atual = HERO[aba];

    return (
        <Slide active={active} className="flex flex-col bg-milk text-sea">
            <div
                className={`flex min-h-0 flex-1 flex-col gap-5 pb-5 pt-[76px] lg:flex-row lg:items-stretch lg:gap-12 lg:pt-[92px] ${PAD}`}
            >
                {/* Texto */}
                <div className="flex shrink-0 flex-col justify-center lg:w-[46%]">
                    <div className="reveal mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-sea/8 py-1 pl-1 pr-3" style={d(0)}>
                        <span className="rounded-full bg-sea px-2.5 py-[3px] text-[11px] font-semibold text-milk">
                            Novo
                        </span>
                        <span className="text-[11px] text-sea/80">{atual.selo}</span>
                    </div>

                    <h1 className={`reveal ${TITULO}`} style={d(100)}>
                        <span className="block font-heavy uppercase">Vista a sua</span>
                        <span className="block font-script font-black italic">Própria Rua</span>
                    </h1>

                    <p className="reveal mt-4 max-w-[380px] text-[13px] leading-relaxed text-sea/70 sm:text-sm" style={d(200)}>
                        {atual.texto}
                    </p>

                    <div className="reveal mt-5 flex flex-wrap items-center gap-3 lg:mt-7" style={d(300)}>
                        <button
                            onClick={() => goTo(atual.destino)}
                            className="inline-flex items-center gap-2 rounded-full bg-sea px-6 py-3 text-[13px] font-semibold text-milk transition-all hover:gap-3"
                        >
                            {atual.cta} <span aria-hidden>→</span>
                        </button>
                        <span className="hidden text-xs text-sea/50 sm:inline">Role, use ↓ ou deslize</span>
                    </div>
                </div>

                {/* Cartão de imagem */}
                <div className="reveal relative min-h-0 w-full flex-1 overflow-hidden rounded-[28px] bg-sea lg:rounded-[40px]" style={d(150)}>
                    <div className="kenburns absolute inset-0">
                        {ABAS.map((a) => (
                            <img
                                key={a}
                                src={HERO[a].imagem}
                                alt={`${MARCA} · ${a}`}
                                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${a === aba ? "opacity-100" : "opacity-0"
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-sea/25 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,transparent_40%,rgba(10,5,45,0.45)_100%)]" />
                    <Grain />

                    {/* Selo giratório */}
                    <div className="absolute right-3 top-3 grid place-items-center text-milk sm:right-5 sm:top-5">
                        <svg viewBox="0 0 120 120" className="h-24 w-24 animate-[spin_14s_linear_infinite] lg:h-28 lg:w-28">
                            <defs>
                                <path id="circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                            </defs>
                            <text className="fill-milk font-heavy text-[10px] uppercase">
                                <textPath href="#circ" textLength="270" lengthAdjust="spacing">
                                    Edição limitada • {MARCA} •
                                </textPath>
                            </text>
                        </svg>
                        <span className="absolute grid h-9 w-9 place-items-center rounded-full bg-milk font-script text-xl font-black italic leading-none text-sea">
                            m
                        </span>
                    </div>

                    {/* Seletor */}
                    <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                        {ABAS.map((a) => (
                            <button
                                key={a}
                                onClick={() => setAba(a)}
                                aria-pressed={aba === a}
                                className={`rounded-full px-5 py-2 text-[13px] backdrop-blur-sm transition ${aba === a
                                        ? "bg-milk font-semibold text-sea"
                                        : "bg-sea/45 text-milk/80 hover:bg-sea/65"
                                    }`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Marquee />
        </Slide>
    );
}

/* ───────── 2. Coleção ───────── */

export function Colecao({ active }: SlideProps) {
    return (
        <Slide active={active} className={`flex flex-col gap-4 bg-milk pb-6 pt-[84px] text-sea lg:gap-6 lg:pt-[104px] ${PAD}`}>
            <div className="reveal flex items-end justify-between gap-4" style={d(0)}>
                <h2 className={TITULO}>
                    <span className="block font-heavy uppercase">Coleção</span>
                    <span className="block font-script font-black italic">Inverno 26</span>
                </h2>
                <p className="hidden pb-2 text-sm text-sea/60 sm:block">
                    {String(PRODUTOS.length).padStart(2, "0")} peças · Frete grátis acima de R$ 399
                </p>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 lg:grid-cols-4 lg:grid-rows-1 lg:gap-5">
                {PRODUTOS.map((p, i) => (
                    <article key={p.nome} className="reveal group flex min-h-0 flex-col" style={d(120 + i * 90)}>
                        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-sea/10 lg:rounded-3xl">
                            <img
                                src={p.imagem}
                                alt={p.nome}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {p.tag && (
                                <span className="absolute left-3 top-3 rounded-full bg-milk px-3 py-1 text-[11px] font-semibold text-sea">
                                    {p.tag}
                                </span>
                            )}
                            <button className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-sea text-milk transition group-hover:scale-110" aria-label={`Adicionar ${p.nome}`}>
                                +
                            </button>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between gap-2">
                            <h3 className="text-[13px] font-semibold leading-tight sm:text-sm">{p.nome}</h3>
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

export function Lookbook({ active, goTo }: SlideProps) {
    return (
        <Slide active={active} className={`flex flex-col gap-5 bg-white pb-6 pt-[84px] text-sea lg:flex-row lg:items-stretch lg:gap-12 lg:pt-[104px] ${PAD}`}>
            <div className="flex shrink-0 flex-col justify-center lg:w-[36%]">
                <span className="reveal mb-3 text-xs uppercase tracking-[0.2em] text-sea/60" style={d(0)}>
                    Lookbook 26
                </span>
                <h2 className={`reveal ${TITULO}`} style={d(100)}>
                    <span className="block font-script font-black italic">Feito na</span>
                    <span className="block font-heavy uppercase">rua.</span>
                </h2>
                <p className="reveal mt-4 max-w-[340px] text-[13px] leading-relaxed text-sea/70 sm:text-sm" style={d(200)}>
                    Fotografado em esquinas, estações e quadras com quem veste a marca todo dia. Nenhum estúdio, só a cidade.
                </p>
                <button
                    onClick={() => goTo(3)}
                    className="reveal mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-sea px-6 py-3 text-[13px] font-semibold text-milk transition-all hover:gap-3"
                    style={d(300)}
                >
                    Ver o próximo drop <span aria-hidden>→</span>
                </button>
            </div>

            <div className="flex min-h-0 flex-1 items-end gap-3 lg:gap-5">
                {LOOKS.map((l, i) => (
                    <figure key={l.legenda} className={`reveal group relative w-1/3 overflow-hidden rounded-2xl bg-sea/10 lg:rounded-3xl ${ALTURAS[i]}`} style={d(150 + i * 120)}>
                        <img
                            src={l.imagem}
                            alt={l.legenda}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <figcaption className="absolute bottom-3 left-3 rounded-full bg-milk/90 px-3 py-1 text-[11px] font-semibold">
                            {l.legenda}
                        </figcaption>
                    </figure>
                ))}
            </div>
        </Slide>
    );
}

/* ───────── 4. Drop (slide escuro) ───────── */

function useCountdown(alvo: Date) {
    const [agora, setAgora] = useState(() => Date.now());
    useEffect(() => {
        const t = window.setInterval(() => setAgora(Date.now()), 1000);
        return () => window.clearInterval(t);
    }, []);
    const diff = Math.max(0, alvo.getTime() - agora);
    return {
        Dias: Math.floor(diff / 864e5),
        Horas: Math.floor(diff / 36e5) % 24,
        Min: Math.floor(diff / 6e4) % 60,
        Seg: Math.floor(diff / 1e3) % 60,
    };
}

export function Drop({ active }: SlideProps) {
    const tempo = useCountdown(DROP_DATE);
    const [email, setEmail] = useState("");
    const [enviado, setEnviado] = useState(false);

    const enviar = (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        // 👇 Integre aqui com sua API / Mailchimp / etc.
        setEnviado(true);
    };

    return (
        <Slide active={active} className={`flex items-center bg-sea pt-16 text-milk ${PAD}`}>
            {/* Número gigante decorativo */}
            <span aria-hidden className="pointer-events-none absolute -bottom-[6vw] -right-[2vw] select-none font-heavy text-[48vw] leading-none text-milk/5 lg:text-[30vw]">
                02
            </span>

            <div className="relative z-10 flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                <div className="max-w-[620px]">
                    <span className="reveal mb-3 block text-xs uppercase tracking-[0.2em] text-milk/60" style={d(0)}>
                        Edição limitada · Sexta, 22h
                    </span>
                    <h2 className={`reveal ${TITULO}`} style={d(100)}>
                        <span className="block font-heavy uppercase">Drop 02</span>
                        <span className="block font-script font-black italic">chega já já</span>
                    </h2>

                    {/* Contagem */}
                    <div className="reveal mt-6 grid max-w-md grid-cols-4 gap-2 sm:gap-3" style={d(220)}>
                        {Object.entries(tempo).map(([rotulo, valor]) => (
                            <div key={rotulo} className="rounded-2xl bg-milk/10 px-2 py-3 text-center backdrop-blur-sm sm:py-4">
                                <div className="font-heavy text-2xl tabular-nums sm:text-4xl">
                                    {String(valor).padStart(2, "0")}
                                </div>
                                <div className="mt-1 text-[10px] uppercase tracking-widest text-milk/60">{rotulo}</div>
                            </div>
                        ))}
                    </div>

                    {/* Lista de espera */}
                    <form onSubmit={enviar} className="reveal mt-6 flex max-w-md flex-col gap-2 sm:flex-row" style={d(320)}>
                        {enviado ? (
                            <p className="rounded-full bg-milk/10 px-6 py-3 text-sm">
                                Você está na lista ✓ Avisamos assim que abrir.
                            </p>
                        ) : (
                            <>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Seu melhor e-mail"
                                    className="min-w-0 flex-1 rounded-full border border-milk/30 bg-milk/10 px-5 py-3 text-sm text-milk outline-none placeholder:text-milk/50 focus:border-milk"
                                />
                                <button type="submit" className="rounded-full bg-milk px-6 py-3 text-[13px] font-semibold text-sea transition hover:bg-white">
                                    Entrar na lista
                                </button>
                            </>
                        )}
                    </form>
                </div>

                {/* Imagem (só desktop) */}
                <div className="reveal relative hidden h-[min(64svh,560px)] w-[min(34vw,440px)] shrink-0 overflow-hidden rounded-[40px] bg-milk/10 lg:block" style={d(200)}>
                    <img src={DROP_IMAGEM} alt="Drop 02" className="kenburns h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-sea/25 mix-blend-multiply" />
                    <Grain />
                </div>
            </div>
        </Slide>
    );
}

/* ───────── 5. Lojas ───────── */

export function Lojas({ active }: SlideProps) {
    return (
        <Slide active={active} className={`flex flex-col gap-4 bg-milk pb-5 pt-[84px] text-sea lg:pt-[104px] ${PAD}`}>
            <h2 className={`reveal ${TITULO}`} style={d(0)}>
                <span className="block font-heavy uppercase">Encontre a</span>
                <span className="block font-script font-black italic">{MARCA.toLowerCase()}</span>
            </h2>

            <ul className="flex min-h-0 flex-1 flex-col justify-center">
                {LOJAS.map((l, i) => (
                    <li
                        key={l.cidade}
                        style={d(120 + i * 80)}
                        className="reveal group grid grid-cols-[1fr_auto] items-center gap-x-4 border-t border-sea/15 px-1 py-3 transition-colors last:border-b hover:bg-sea hover:text-milk sm:grid-cols-[1.1fr_1.6fr_1fr_auto] sm:px-4 sm:py-4"
                    >
                        <span className="font-heavy text-lg uppercase sm:text-xl">{l.cidade}</span>
                        <span className="col-span-2 row-start-2 text-[13px] opacity-70 sm:col-span-1 sm:row-start-auto">{l.endereco}</span>
                        <span className="hidden text-[13px] opacity-70 sm:block">{l.horario}</span>
                        <span aria-hidden className="text-xl transition-transform group-hover:translate-x-1">→</span>
                    </li>
                ))}
            </ul>

            <footer className="reveal flex flex-wrap items-center justify-between gap-3 text-xs text-sea/60" style={d(480)}>
                <span>© 2026 {MARCA}. Todos os direitos reservados.</span>
                <div className="flex gap-4 font-semibold text-sea">
                    <a href="#" className="hover:underline">Instagram</a>
                    <a href="#" className="hover:underline">TikTok</a>
                    <a href="#" className="hover:underline">WhatsApp</a>
                </div>
            </footer>
        </Slide>
    );
}