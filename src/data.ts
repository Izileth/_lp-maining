export const MARCA = "MILKSEA";

// Data do drop (a contagem regressiva usa isso)
export const DROP_DATE = new Date("2026-12-04T22:00:00-03:00");

export type TemaNome = "claro" | "escuro";

// Cores que o GSAP interpola no header, paginação e ticker.
// (formato rgb com vírgulas, necessário para a interpolação)
export const PALETA: Record<TemaNome, { ink: string; paper: string }> = {
  claro: { ink: "rgb(40, 28, 124)", paper: "rgb(246, 247, 253)" },
  escuro: { ink: "rgb(246, 247, 253)", paper: "rgb(40, 28, 124)" },
};

// Ordem = ordem dos slides em App.tsx
export const SECOES: { rotulo: string; tema: TemaNome }[] = [
  { rotulo: "Início", tema: "claro" },
  { rotulo: "Coleção", tema: "claro" },
  { rotulo: "Lookbook", tema: "claro" },
  { rotulo: "Drop", tema: "escuro" },
  { rotulo: "Lojas", tema: "claro" },
];

// 👇 Hero: cada aba tem imagem, selo, texto, CTA e destino (índice do slide)
export const HERO = [
  {
    aba: "Coleção",
    imagem: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80",
    selo: "Coleção Inverno 26 disponível",
    texto:
      "Cortes oversized, tecidos pesados e acabamento sob medida. Peças pensadas para durar mais que a estação.",
    cta: "Ver a coleção",
    destino: 1,
  },
  {
    aba: "Lookbook",
    imagem: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1400&q=80",
    selo: "Lookbook 26 no ar",
    texto:
      "Combinações feitas na rua, com gente de verdade. Veja como a coleção ganha vida fora do estúdio.",
    cta: "Ver o lookbook",
    destino: 2,
  },
  {
    aba: "Drop",
    imagem: "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=1400&q=80",
    selo: "Drop 02 · Sexta, 22h",
    texto:
      "Edição limitada, poucas unidades por modelo. Entre na lista para ter acesso antes de todo mundo.",
    cta: "Entrar no drop",
    destino: 3,
  },
];

export const FRASES = [
  "Coleção Inverno 26",
  "Edição limitada",
  "Frete grátis acima de R$ 399",
  "Drop 02 em breve",
  "Feito na rua",
  "Entrega em todo o Brasil",
];

// 👇 Coleção
export const PRODUTOS = [
  { nome: "Jaqueta Boxy Nylon", preco: "R$ 589", tag: "Novo", imagem: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80" },
  { nome: "Moletom Heavy Cinza", preco: "R$ 349", tag: "Best-seller", imagem: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80" },
  { nome: "Calça Cargo Wide", preco: "R$ 429", tag: "", imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" },
  { nome: "Camiseta Oversized", preco: "R$ 189", tag: "Novo", imagem: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80" },
];

// 👇 Lookbook
export const LOOKS = [
  { imagem: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80", legenda: "Look 01" },
  { imagem: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80", legenda: "Look 02" },
  { imagem: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=80", legenda: "Look 03" },
];

// 👇 Drop
export const DROP_IMAGEM = "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80";

export const LOJAS = [
  { cidade: "São Paulo", endereco: "R. Augusta, 1200 · Consolação", horario: "Seg–Sáb · 11h–21h" },
  { cidade: "Rio de Janeiro", endereco: "R. Dias Ferreira, 45 · Leblon", horario: "Seg–Sáb · 11h–20h" },
  { cidade: "Belo Horizonte", endereco: "Av. Cristóvão Colombo, 300 · Savassi", horario: "Seg–Sáb · 11h–20h" },
  { cidade: "Curitiba", endereco: "R. Mateus Leme, 880 · Centro Cívico", horario: "Ter–Sáb · 12h–20h" },
];