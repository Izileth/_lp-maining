export const MARCA = "MILKSEA";

// Data do drop (a contagem regressiva usa isso)
export const DROP_DATE = new Date("2026-12-04T22:00:00-03:00");

export type Tema = "claro" | "escuro";

// Ordem = ordem dos slides. "tema" controla a cor do header/pontos.
export const SECOES: { rotulo: string; tema: Tema }[] = [
  { rotulo: "Início", tema: "claro" },
  { rotulo: "Coleção", tema: "claro" },
  { rotulo: "Lookbook", tema: "claro" },
  { rotulo: "Drop", tema: "escuro" },
  { rotulo: "Lojas", tema: "claro" },
];

export type Aba = "Coleção" | "Lookbook" | "Drop";

// 👇 Hero: uma imagem por aba
export const HERO: Record<
  Aba,
  { imagem: string; selo: string; texto: string; cta: string; destino: number }
> = {
  Coleção: {
    imagem: "/img/hero-colecao.jpg",
    selo: "Coleção Inverno 26 disponível",
    texto:
      "Cortes oversized, tecidos pesados e acabamento sob medida. Peças pensadas para durar mais que a estação.",
    cta: "Ver a coleção",
    destino: 1,
  },
  Lookbook: {
    imagem: "/img/hero-lookbook.jpg",
    selo: "Lookbook 26 no ar",
    texto:
      "Combinações feitas na rua, com gente de verdade. Veja como a coleção ganha vida fora do estúdio.",
    cta: "Ver o lookbook",
    destino: 2,
  },
  Drop: {
    imagem: "/img/hero-drop.jpg",
    selo: "Drop 02 · Sexta, 22h",
    texto:
      "Edição limitada, poucas unidades por modelo. Entre na lista para ter acesso antes de todo mundo.",
    cta: "Entrar no drop",
    destino: 3,
  },
};

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
  {
    nome: "Jaqueta Boxy Nylon",
    preco: "R$ 589",
    tag: "Novo",
    imagem: "/img/produto-1.jpg",
  },
  {
    nome: "Moletom Heavy Cinza",
    preco: "R$ 349",
    tag: "Best-seller",
    imagem: "/img/produto-2.jpg",
  },
  {
    nome: "Calça Cargo Wide",
    preco: "R$ 429",
    tag: "",
    imagem: "/img/produto-3.jpg",
  },
  {
    nome: "Camiseta Oversized",
    preco: "R$ 189",
    tag: "Novo",
    imagem: "/img/produto-4.jpg",
  },
];

// 👇 Lookbook
export const LOOKS = [
  { imagem: "/img/look-1.jpg", legenda: "Look 01" },
  { imagem: "/img/look-2.jpg", legenda: "Look 02" },
  { imagem: "/img/look-3.jpg", legenda: "Look 03" },
];

// 👇 Drop
export const DROP_IMAGEM = "/img/drop.jpg";

export const LOJAS = [
  {
    cidade: "São Paulo",
    endereco: "R. Augusta, 1200 · Consolação",
    horario: "Seg–Sáb · 11h–21h",
  },
  {
    cidade: "Rio de Janeiro",
    endereco: "R. Dias Ferreira, 45 · Leblon",
    horario: "Seg–Sáb · 11h–20h",
  },
  {
    cidade: "Belo Horizonte",
    endereco: "Av. Cristóvão Colombo, 300 · Savassi",
    horario: "Seg–Sáb · 11h–20h",
  },
  {
    cidade: "Curitiba",
    endereco: "R. Mateus Leme, 880 · Centro Cívico",
    horario: "Ter–Sáb · 12h–20h",
  },
];
