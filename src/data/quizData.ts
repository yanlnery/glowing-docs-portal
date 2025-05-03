
import { Animal, QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual seu nível de experiência com répteis?",
    answers: [
      { label: "Iniciante", value: "iniciante" },
      { label: "Intermediário", value: "intermediario" },
      { label: "Avançado", value: "avancado" }
    ]
  },
  {
    id: 2,
    question: "Qual seu principal interesse?",
    answers: [
      { label: "Estética (beleza do animal)", value: "estetica" },
      { label: "Observação de comportamento", value: "comportamento" },
      { label: "Interação/manuseio", value: "interacao" }
    ]
  },
  {
    id: 3,
    question: "Você prefere...",
    answers: [
      { label: "Serpentes", value: "serpente" },
      { label: "Lagartos", value: "lagarto" },
      { label: "Quelônios", value: "quelonio" },
      { label: "Tanto faz", value: "tanto_faz" }
    ]
  },
  {
    id: 4,
    question: "Quanto tempo você pode dedicar ao animal por semana?",
    answers: [
      { label: "Pouco tempo (1 a 2 dias)", value: "pouco_tempo" },
      { label: "Tempo médio (3 a 4 dias)", value: "tempo_medio" },
      { label: "Quase todos os dias", value: "muito_tempo" }
    ]
  },
  {
    id: 5,
    question: "Qual tamanho de animal te atrai mais?",
    answers: [
      { label: "Pequeno", value: "pequeno" },
      { label: "Médio", value: "medio" },
      { label: "Grande", value: "grande" }
    ]
  },
  {
    id: 6,
    question: "Onde o animal viverá?",
    answers: [
      { label: "Espaço pequeno (apartamento)", value: "espaco_pequeno" },
      { label: "Espaço médio (casa com cômodo adaptado)", value: "espaco_medio" },
      { label: "Espaço amplo (quintal ou área externa)", value: "espaco_amplo" }
    ]
  },
  {
    id: 7,
    question: "Você prefere animais com hábitos...",
    answers: [
      { label: "Noturnos", value: "noturno" },
      { label: "Diurnos", value: "diurno" },
      { label: "Indiferente", value: "indiferente" }
    ]
  }
];

export const animalsData: Animal[] = [
  {
    id: 1,
    nome_popular: "Jiboia arco-íris do Cerrado",
    nome_cientifico: "Epicrates assisi",
    nivel: "iniciante",
    interesse: ["estetica", "comportamento"],
    classe: "serpente",
    tempo: "pouco_tempo",
    tamanho: "medio",
    espaco: "espaco_medio",
    habito: "noturno",
    descricao: "Serpente dócil e de fácil manejo, ideal para iniciantes. Possui coloração belíssima e comportamento tranquilo.",
    imagem: "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
    slug: "epicrates-assisi"
  },
  {
    id: 2,
    nome_popular: "Jiboia",
    nome_cientifico: "Boa constrictor",
    nivel: "intermediario",
    interesse: ["estetica", "comportamento"],
    classe: "serpente",
    tempo: "tempo_medio",
    tamanho: "grande",
    espaco: "espaco_medio",
    habito: "noturno",
    descricao: "Serpente robusta e de porte grande, com coloração variada e temperamento geralmente dócil quando acostumada ao manejo.",
    imagem: "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png",
    slug: "boa-constrictor"
  },
  {
    id: 3,
    nome_popular: "Iguana-verde",
    nome_cientifico: "Iguana iguana",
    nivel: "intermediario",
    interesse: ["estetica", "comportamento", "interacao"],
    classe: "lagarto",
    tempo: "muito_tempo",
    tamanho: "grande",
    espaco: "espaco_amplo",
    habito: "diurno",
    descricao: "Lagarto herbívoro de grande porte, exige espaço amplo e cuidados específicos com temperatura e iluminação.",
    imagem: "/lovable-uploads/c138dc46-3fd6-4dda-aa7b-c02dead150e7.png",
    slug: "iguana-iguana"
  },
  {
    id: 4,
    nome_popular: "Teiú-amarelo",
    nome_cientifico: "Tupinambis teguixin",
    nivel: "intermediario",
    interesse: ["comportamento", "interacao"],
    classe: "lagarto",
    tempo: "muito_tempo",
    tamanho: "grande",
    espaco: "espaco_amplo",
    habito: "diurno",
    descricao: "Lagarto ativo e inteligente, requer espaço e pode desenvolver vínculo com o criador. Alimentação variada e onívora.",
    imagem: "/lovable-uploads/921c3722-02d0-419b-b003-caa6b5de021d.png",
    slug: "tupinambis-teguixin"
  },
  {
    id: 5,
    nome_popular: "Corn Snake",
    nome_cientifico: "Pantherophis guttatus",
    nivel: "iniciante",
    interesse: ["estetica", "interacao"],
    classe: "serpente",
    tempo: "pouco_tempo",
    tamanho: "pequeno",
    espaco: "espaco_pequeno",
    habito: "crepuscular",
    descricao: "Serpente colorida e dócil, excelente para iniciantes. Fácil de manejar e com muitas variações de cores disponíveis.",
    imagem: "/lovable-uploads/51de7896-4d25-4af0-af9d-31c8028fcc3b.png",
    slug: "pantherophis-guttatus"
  },
  {
    id: 6,
    nome_popular: "Jabuti-piranga",
    nome_cientifico: "Chelonoidis carbonarius",
    nivel: "iniciante",
    interesse: ["comportamento", "interacao"],
    classe: "quelonio",
    tempo: "tempo_medio",
    tamanho: "medio",
    espaco: "espaco_medio",
    habito: "diurno",
    descricao: "Quelônio terrestre de tamanho médio, com carapaça escura e manchas vermelhas ou alaranjadas. Longevidade elevada e temperamento dócil.",
    imagem: "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png",
    slug: "chelonoidis-carbonarius"
  },
  {
    id: 7,
    nome_popular: "Leopard Gecko",
    nome_cientifico: "Eublepharis macularius",
    nivel: "iniciante",
    interesse: ["estetica", "interacao"],
    classe: "lagarto",
    tempo: "pouco_tempo",
    tamanho: "pequeno",
    espaco: "espaco_pequeno",
    habito: "noturno",
    descricao: "Lagarto pequeno e dócil, perfeito para iniciantes. Fácil de cuidar e com muitas variações de cores disponíveis.",
    imagem: "/lovable-uploads/11848f61-6118-4555-92b5-61760f34cf00.png",
    slug: "eublepharis-macularius"
  },
  {
    id: 8,
    nome_popular: "Cobra-d'água",
    nome_cientifico: "Erythrolamprus miliaris",
    nivel: "intermediario",
    interesse: ["comportamento"],
    classe: "serpente",
    tempo: "tempo_medio",
    tamanho: "medio",
    espaco: "espaco_medio",
    habito: "diurno",
    descricao: "Serpente semi-aquática, ágil e de coloração variável. Requer terrário com área aquática e terrestre.",
    imagem: "/lovable-uploads/610934d9-5fa0-47d8-9148-cc584b051100.png",
    slug: "erythrolamprus-miliaris"
  },
  {
    id: 9,
    nome_popular: "Tartaruga-de-orelha-vermelha",
    nome_cientifico: "Trachemys scripta elegans",
    nivel: "iniciante",
    interesse: ["comportamento"],
    classe: "quelonio",
    tempo: "tempo_medio",
    tamanho: "medio",
    espaco: "espaco_medio",
    habito: "diurno",
    descricao: "Tartaruga aquática com manchas vermelhas características na lateral da cabeça. Necessita de aquário adequado com área seca.",
    imagem: "/lovable-uploads/d7cd39f5-e491-4eb3-a10d-6cf8ad24669a.png",
    slug: "trachemys-scripta-elegans"
  }
];
