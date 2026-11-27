import { useEffect, useRef, useState } from "react";
import type { Produto } from "../data";
import { MARCA } from "../data";
import { gsap, useGSAP } from "../motion/gsap";

export interface DetalhesProdutoProps {
  produto: Produto | null;
  onClose: () => void;
  onAddToCart?: (
    produto: Produto,
    options: { tamanho: string; cor: string; quantidade: number }
  ) => void;
}

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function DetalhesProduto({ produto, onClose, onAddToCart }: DetalhesProdutoProps) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedTamanho, setSelectedTamanho] = useState<string>("");
  const [selectedCor, setSelectedCor] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"detalhes" | "composicao" | "envio">("detalhes");
  const [added, setAdded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const contentStaggerRef = useRef<HTMLDivElement>(null);
  const closeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Define seleções iniciais quando o produto muda
  useEffect(() => {
    if (produto) {
      setSelectedImgIndex(0);
      setSelectedTamanho(produto.tamanhos[0] || "");
      setSelectedCor(produto.cores[0]?.nome || "");
      setActiveTab("detalhes");
      setAdded(false);
      setIsClosing(false);
    }
  }, [produto]);

  // Animação de entrada e saída com useGSAP
  useGSAP(
    () => {
      if (!produto || !containerRef.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const backdrop = backdropRef.current;
      const dialog = dialogRef.current;
      const contentEl = contentStaggerRef.current;

      if (!backdrop || !dialog) return;

      if (reduce) {
        gsap.set(backdrop, { autoAlpha: 1 });
        gsap.set(dialog, { autoAlpha: 1, scale: 1, y: 0 });
        return;
      }

      // Timeline de abertura
      const tl = gsap.timeline({ defaults: { ease: "ms.out" } });

      tl.fromTo(
        backdrop,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.45, ease: "power2.out" }
      )
        .fromTo(
          dialog,
          {
            autoAlpha: 0,
            scale: 0.94,
            y: 32,
            filter: "blur(6px)",
          },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.65,
            ease: "ms.out",
          },
          0.05
        );

      if (contentEl) {
        const items = contentEl.querySelectorAll("[data-anim-item]");
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: "power3.out",
          },
          0.2
        );
      }
    },
    { scope: containerRef, dependencies: [produto?.id] }
  );

  // Animação ao trocar de imagem na galeria
  useEffect(() => {
    if (!mainImgRef.current) return;
    const img = mainImgRef.current;

    gsap.fromTo(
      img,
      { autoAlpha: 0.35, scale: 1.05 },
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" }
    );
  }, [selectedImgIndex]);

  // Função para fechar suavemente com animação de saída
  const handleRequestClose = () => {
    if (isClosing) return;
    setIsClosing(true);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !dialogRef.current || !backdropRef.current) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.in" },
      onComplete: () => {
        onClose();
      },
    });

    closeTimelineRef.current = tl;

    tl.to(dialogRef.current, {
      autoAlpha: 0,
      scale: 0.96,
      y: 20,
      duration: 0.28,
    }).to(
      backdropRef.current,
      {
        autoAlpha: 0,
        duration: 0.25,
      },
      "-=0.15"
    );
  };

  // Suporte a tecla Esc e bloqueio de scroll
  useEffect(() => {
    if (!produto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleRequestClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [produto, isClosing]);

  if (!produto) return null;

  const imagens = produto.imagens && produto.imagens.length > 0 ? produto.imagens : [produto.imagem];
  const currentImage = imagens[selectedImgIndex] || produto.imagem;

  const handleAddToCart = () => {
    if (added) return;
    setAdded(true);

    if (onAddToCart) {
      onAddToCart(produto, {
        tamanho: selectedTamanho,
        cor: selectedCor,
        quantidade: 1,
      });
    }

    // Feedback sonoro/tátil sutil via GSAP no botão
    const btn = containerRef.current?.querySelector("[data-add-btn]");
    if (btn) {
      gsap.fromTo(
        btn,
        { scale: 0.95 },
        { scale: 1, duration: 0.45, ease: "back.out(2)" }
      );
    }

    setTimeout(() => {
      setAdded(false);
    }, 2400);
  };

  return (
    <div
      ref={containerRef}
      data-modal-ignore
      className="fixed inset-0 z-[65] flex items-center justify-center p-3 sm:p-5 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detalhe-produto-titulo"
    >
      {/* Backdrop escuro com blur e grão */}
      <div
        ref={backdropRef}
        onClick={handleRequestClose}
        className="absolute inset-0 bg-sea/75 backdrop-blur-md transition-opacity"
        aria-hidden="true"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      </div>

      {/* Caixa do modal */}
      <div
        ref={dialogRef}
        data-modal-ignore
        className="relative z-10 flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-milk text-sea shadow-2xl ring-1 ring-sea/10 lg:max-h-[86svh] lg:flex-row lg:rounded-[36px]"
      >
        {/* Botão Fechar topo direito */}
        <button
          onClick={handleRequestClose}
          aria-label="Fechar detalhes do produto"
          className="mk-pill mk-press absolute top-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-milk/80 text-sea backdrop-blur-sm transition-all hover:bg-sea hover:text-milk"
        >
          <span className="text-xl leading-none">✕</span>
        </button>

        {/* Coluna 1: Galeria de Fotos */}
        <div className="relative flex min-h-[300px] flex-col bg-sea/5 lg:min-h-0 lg:w-[48%]">
          {/* Foto Principal */}
          <div className="relative min-h-[260px] flex-1 overflow-hidden sm:min-h-[340px] lg:min-h-0">
            <img
              ref={mainImgRef}
              src={currentImage}
              alt={`${produto.nome} - vista ${selectedImgIndex + 1}`}
              className="h-full w-full object-cover object-center"
              decoding="async"
            />

            {/* Tag flutuante */}
            {produto.tag && (
              <span className="absolute top-4 left-4 rounded-full bg-milk/95 px-3.5 py-1 text-[11px] font-bold tracking-wider text-sea uppercase shadow-sm">
                {produto.tag}
              </span>
            )}

            {/* Categoria */}
            <span className="absolute bottom-4 left-4 rounded-full bg-sea/80 px-3 py-1 text-[11px] font-medium text-milk backdrop-blur-sm">
              {produto.categoria}
            </span>

            {/* Textura sutil */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay"
              style={{ backgroundImage: GRAIN }}
            />
          </div>

          {/* Miniaturas da galeria */}
          {imagens.length > 1 && (
            <div className="flex items-center gap-2.5 border-t border-sea/10 bg-milk/60 p-3 backdrop-blur-xs">
              {imagens.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  aria-label={`Ver foto ${idx + 1}`}
                  aria-current={selectedImgIndex === idx}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImgIndex === idx
                      ? "border-sea scale-102 shadow-sm"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
              <span className="ml-auto text-[11px] font-semibold tracking-wider text-sea/50 uppercase">
                {selectedImgIndex + 1} / {imagens.length}
              </span>
            </div>
          )}
        </div>

        {/* Coluna 2: Informações e Ações */}
        <div
          ref={contentStaggerRef}
          data-modal-ignore
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-6 sm:p-8 lg:p-10"
        >
          {/* Marca e Subtítulo */}
          <div data-anim-item className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold tracking-[0.2em] text-sea/50 uppercase">
              {MARCA} · Drop Oficial
            </span>
            <span className="rounded-full bg-sea/8 px-2.5 py-0.5 text-[11px] font-semibold text-sea">
              Estoque Limitado
            </span>
          </div>

          {/* Nome do Produto */}
          <h2
            id="detalhe-produto-titulo"
            data-anim-item
            className="mt-2 font-heavy text-2xl tracking-tight uppercase sm:text-3xl lg:text-4xl"
          >
            {produto.nome}
          </h2>

          {/* Subtítulo editorial */}
          <p data-anim-item className="mt-1 text-xs text-sea/70 sm:text-sm">
            {produto.subtitulo}
          </p>

          {/* Preço e Parcelamento */}
          <div data-anim-item className="mt-4 flex flex-wrap items-baseline gap-3 border-b border-sea/10 pb-4">
            <span className="font-script text-3xl font-black italic text-sea sm:text-4xl">
              {produto.preco}
            </span>
            <span className="text-xs text-sea/60">
              {produto.parcelamento}
            </span>
          </div>

          {/* Seleção de Cor */}
          {produto.cores && produto.cores.length > 0 && (
            <div data-anim-item className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-sea/80">
                  Cor: <span className="font-heavy text-sea">{selectedCor}</span>
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                {produto.cores.map((cor) => {
                  const isSelected = selectedCor === cor.nome;
                  return (
                    <button
                      key={cor.nome}
                      onClick={() => setSelectedCor(cor.nome)}
                      title={cor.nome}
                      aria-label={`Selecionar cor ${cor.nome}`}
                      aria-pressed={isSelected}
                      className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        isSelected ? "ring-2 ring-sea ring-offset-2 ring-offset-milk scale-105" : "hover:scale-105"
                      }`}
                    >
                      <span
                        className="h-7 w-7 rounded-full shadow-inner border border-sea/20"
                        style={{ backgroundColor: cor.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seleção de Tamanho */}
          {produto.tamanhos && produto.tamanhos.length > 0 && (
            <div data-anim-item className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-sea/80">
                  Tamanho Selecionado: <span className="font-heavy text-sea">{selectedTamanho}</span>
                </span>
                <span className="text-[11px] text-sea/50 underline cursor-help">
                  Guia de medidas
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {produto.tamanhos.map((tam) => {
                  const isSelected = selectedTamanho === tam;
                  return (
                    <button
                      key={tam}
                      onClick={() => setSelectedTamanho(tam)}
                      aria-label={`Tamanho ${tam}`}
                      aria-pressed={isSelected}
                      className={`h-11 min-w-[44px] rounded-xl px-4 text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-sea text-milk shadow-md scale-102"
                          : "bg-sea/8 text-sea hover:bg-sea/15"
                      }`}
                    >
                      {tam}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ações de Compra */}
          <div data-anim-item className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              data-add-btn
              onClick={handleAddToCart}
              className={`mk-press flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold transition-all ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-sea text-milk hover:opacity-95 shadow-lg shadow-sea/15"
              }`}
            >
              {added ? (
                <>
                  <span className="text-base">✓</span>
                  Adicionado à Sacola!
                </>
              ) : (
                <>
                  <span>Adicionar à Sacola</span>
                  <span aria-hidden>—</span>
                  <span className="font-script font-bold italic">{produto.preco}</span>
                </>
              )}
            </button>
          </div>

          {/* Abas de Detalhes Técnicos */}
          <div data-anim-item className="mt-8 border-t border-sea/10 pt-5">
            <div className="flex gap-4 border-b border-sea/10 pb-2 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab("detalhes")}
                className={`pb-1 transition-colors ${
                  activeTab === "detalhes"
                    ? "border-b-2 border-sea text-sea font-heavy"
                    : "text-sea/50 hover:text-sea"
                }`}
              >
                Destaques
              </button>
              <button
                onClick={() => setActiveTab("composicao")}
                className={`pb-1 transition-colors ${
                  activeTab === "composicao"
                    ? "border-b-2 border-sea text-sea font-heavy"
                    : "text-sea/50 hover:text-sea"
                }`}
              >
                Composição
              </button>
              <button
                onClick={() => setActiveTab("envio")}
                className={`pb-1 transition-colors ${
                  activeTab === "envio"
                    ? "border-b-2 border-sea text-sea font-heavy"
                    : "text-sea/50 hover:text-sea"
                }`}
              >
                Frete & Troca
              </button>
            </div>

            <div className="pt-3 text-xs leading-relaxed text-sea/80">
              {activeTab === "detalhes" && (
                <div className="space-y-3">
                  <p>{produto.descricao}</p>
                  <ul className="mt-2 space-y-1.5">
                    {produto.destaques.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="font-script text-base text-sea italic font-black">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "composicao" && (
                <div className="space-y-2">
                  <p>
                    <strong className="text-sea">Material:</strong> {produto.composicao}
                  </p>
                  <p>
                    <strong className="text-sea">Cuidados:</strong> {produto.cuidados}
                  </p>
                  <p className="text-[11px] text-sea/60">
                    Produzido eticamente no Brasil com matérias-primas nobres.
                  </p>
                </div>
              )}

              {activeTab === "envio" && (
                <div className="space-y-2">
                  <p>
                    <strong className="text-sea">Frete Grátis:</strong> Disponível para compras acima de R$ 399 para todo o Brasil.
                  </p>
                  <p>
                    <strong className="text-sea">Envio Expresso:</strong> Postagem em até 24h úteis após a confirmação.
                  </p>
                  <p>
                    <strong className="text-sea">Primeira Troca Grátis:</strong> Até 30 dias após o recebimento para trocar sem custo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
