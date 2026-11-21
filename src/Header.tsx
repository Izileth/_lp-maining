import { useState } from "react";
import { MARCA, SECOES, type Tema } from "./data";

type Props = { index: number; goTo: (i: number) => void; tema: Tema };

export default function Header({ index, goTo, tema }: Props) {
    const [aberto, setAberto] = useState(false);
    const escuro = tema === "escuro";

    const ink = escuro ? "text-milk" : "text-sea";
    const inativo = escuro
        ? "bg-milk/10 text-milk/90 hover:bg-milk/20"
        : "bg-sea/8 text-sea/80 hover:bg-sea/15";
    const ativo = escuro ? "bg-milk text-sea" : "bg-sea text-milk";
    const solido = escuro ? "bg-milk text-sea" : "bg-sea text-milk";

    const ir = (i: number) => {
        goTo(i);
        setAberto(false);
    };

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-5 transition-colors duration-700 sm:px-8 lg:px-[104px] lg:pt-6 ${ink}`}
            >
                {/* Logo */}
                <button onClick={() => ir(0)} aria-label={MARCA} className="flex items-center gap-2">
                    <span
                        className={`grid h-9 w-9 place-items-center rounded-full font-script text-xl font-black italic leading-none transition-colors duration-700 ${solido}`}
                    >
                        m
                    </span>
                    <span className="hidden font-heavy text-sm tracking-tight lg:inline">{MARCA}</span>
                </button>

                {/* Nav central */}
                <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
                    {SECOES.map((s, i) => (
                        <button
                            key={s.rotulo}
                            onClick={() => ir(i)}
                            aria-current={index === i}
                            className={`rounded-full px-3 py-2 text-[12px] transition-colors duration-500 lg:px-4 lg:text-[13px] ${index === i ? `${ativo} font-semibold` : inativo
                                }`}
                        >
                            {s.rotulo}
                        </button>
                    ))}
                </nav>

                {/* Ações */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => ir(3)}
                        className={`hidden rounded-full px-4 py-2 text-[13px] transition-colors duration-500 lg:inline-block ${inativo}`}
                    >
                        Entrar na lista do drop
                    </button>
                    <button
                        onClick={() => ir(1)}
                        className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-colors duration-500 sm:px-7 sm:py-2.5 ${solido}`}
                    >
                        Comprar
                    </button>

                    <button
                        onClick={() => setAberto((v) => !v)}
                        aria-label="Abrir menu"
                        aria-expanded={aberto}
                        className={`ml-1 grid h-9 w-9 place-items-center rounded-full transition-colors duration-500 md:hidden ${inativo}`}
                    >
                        <span className="relative block h-3 w-4">
                            <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition ${aberto ? "top-1.5 rotate-45" : "top-0"}`} />
                            <span className={`absolute left-0 top-1.5 h-[1.5px] w-4 bg-current transition ${aberto ? "opacity-0" : ""}`} />
                            <span className={`absolute left-0 h-[1.5px] w-4 bg-current transition ${aberto ? "top-1.5 -rotate-45" : "top-3"}`} />
                        </span>
                    </button>
                </div>
            </header>

            {/* Menu mobile */}
            {aberto && (
                <div
                    className={`fixed inset-x-5 top-[76px] z-50 flex flex-col gap-1 rounded-3xl p-3 shadow-xl backdrop-blur-xl md:hidden ${escuro ? "bg-sea/80 text-milk" : "bg-white/85 text-sea"
                        }`}
                >
                    {SECOES.map((s, i) => (
                        <button
                            key={s.rotulo}
                            onClick={() => ir(i)}
                            className={`rounded-2xl px-4 py-3 text-left text-sm ${index === i ? `${ativo} font-semibold` : ""
                                }`}
                        >
                            {s.rotulo}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}