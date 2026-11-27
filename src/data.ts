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

export interface CorProduto {
  nome: string;
  hex: string;
}

export interface Produto {
  id: string;
  nome: string;
  subtitulo: string;
  preco: string;
  parcelamento: string;
  tag?: string;
  categoria: string;
  imagem: string;
  imagens: string[];
  descricao: string;
  destaques: string[];
  tamanhos: string[];
  cores: CorProduto[];
  composicao: string;
  cuidados: string;
}

// 👇 Coleção
export const PRODUTOS: Produto[] = [
  {
    id: "jaqueta-boxy-nylon",
    nome: "Jaqueta Boxy Nylon",
    subtitulo: "Tech streetwear corta-vento",
    preco: "R$ 589",
    parcelamento: "ou 6x de R$ 98,16 sem juros",
    tag: "Novo",
    categoria: "Outerwear",
    imagem: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80",
    imagens: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80",
    ],
    descricao:
      "Jaqueta com corte boxy estruturado em nylon premium repelente à água. Gola alta com proteção contra vento, zíperes emborrachados YKK e caimento projetado para o inverno urbano.",
    destaques: [
      "Tecido técnico ripstop hidro-repelente",
      "Modelagem ampla com ombros caídos",
      "Zíperes frontais emborrachados YKK",
      "Bolsos utilitários internos e externos",
    ],
    tamanhos: ["P", "M", "G", "GG"],
    cores: [
      { nome: "Preto Noturno", hex: "#19191d" },
      { nome: "Azul Petróleo", hex: "#1f2f45" },
      { nome: "Areia", hex: "#d8d3c5" },
    ],
    composicao: "100% Poliamida com resina impermeável",
    cuidados: "Lavar à mão em água fria. Secar à sombra.",
  },
  {
    id: "moletom-heavy-cinza",
    nome: "Moletom Heavy Cinza",
    subtitulo: "Gramatura 450 GSM com capuz estruturado",
    preco: "R$ 349",
    parcelamento: "ou 4x de R$ 87,25 sem juros",
    tag: "Best-seller",
    categoria: "Moletons",
    imagem: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    imagens: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
    ],
    descricao:
      "Nosso moletom mais denso e pesado. Confeccionado em felpa premium de 450g/m² com toque macio e interior escovado. Capuz duplo estruturado sem cordões e punhos canelados reforçados.",
    destaques: [
      "Gramatura ultra pesada 450g/m²",
      "Capuz duplo anatômico que não deforma",
      "Costura flatlock reforçada em 4 pontos",
      "Algodão orgânico pré-encolhido",
    ],
    tamanhos: ["PP", "P", "M", "G", "GG"],
    cores: [
      { nome: "Cinza Mescla", hex: "#9b9da0" },
      { nome: "Off-White", hex: "#eae7dd" },
      { nome: "Grafite", hex: "#2b2b2e" },
    ],
    composicao: "88% Algodão Premium, 12% Poliéster",
    cuidados: "Lavar na máquina em ciclo delicado. Não alvejar.",
  },
  {
    id: "calca-cargo-wide",
    nome: "Calça Cargo Wide",
    subtitulo: "Sarja pesada com bolsos fole expansíveis",
    preco: "R$ 429",
    parcelamento: "ou 5x de R$ 85,80 sem juros",
    tag: "",
    categoria: "Calças",
    imagem: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    imagens: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    ],
    descricao:
      "Calça wide leg com bolsos cargo utilitários expansíveis. Cintura com ajuste elástico traseiro e passantes, além de regulador na barra para transitar entre silhueta ampla e jogger afunilada.",
    destaques: [
      "Corte wide relaxado com pregas no joelho",
      "6 bolsos funcionais com botão de pressão oculto",
      "Sarja 100% algodão 340g/m² peletizada",
      "Cordão interno de ajuste na barra",
    ],
    tamanhos: ["38", "40", "42", "44", "46"],
    cores: [
      { nome: "Verde Militar", hex: "#3b4737" },
      { nome: "Preto", hex: "#161616" },
      { nome: "Cáqui Suave", hex: "#b4a58b" },
    ],
    composicao: "100% Algodão Sarja Peletizada",
    cuidados: "Lavar pelo avesso até 30°C. Passar ferro brando.",
  },
  {
    id: "camiseta-oversized",
    nome: "Camiseta Oversized",
    subtitulo: "Gola alta de 3cm em malha encorpada 260 GSM",
    preco: "R$ 189",
    parcelamento: "ou 3x de R$ 63,00 sem juros",
    tag: "Novo",
    categoria: "Camisetas",
    imagem: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    imagens: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80",
    ],
    descricao:
      "Camiseta com silhueta boxy contemporânea e ombros rebaixados. Gola canelada de 3cm em ribana 2x1 densa que não relaxa com as lavagens. Malha penteada fio 20.1 de altíssimo conforto.",
    destaques: [
      "Malha encorpada 260g/m² fio 20.1 penteado",
      "Gola mock neck de 3cm que não deforma",
      "Ombros caídos com mangas amplas",
      "Toque aveludado com tingimento reativo",
    ],
    tamanhos: ["P", "M", "G", "GG", "XGG"],
    cores: [
      { nome: "Branco Puro", hex: "#f7f7f7" },
      { nome: "Preto Mineral", hex: "#1b1b1f" },
      { nome: "Azul MILKSEA", hex: "#281c7c" },
    ],
    composicao: "100% Algodão sustentável certificado BCI",
    cuidados: "Lavar à máquina em temperatura fria. Secar em varal.",
  },
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