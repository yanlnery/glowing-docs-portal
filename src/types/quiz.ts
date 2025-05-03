
export type QuizAnswer = {
  label: string;
  value: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  answers: QuizAnswer[];
};

export type AnimalAttribute = 
  | "iniciante" 
  | "intermediario" 
  | "avancado" 
  | "estetica" 
  | "comportamento" 
  | "interacao" 
  | "serpente" 
  | "lagarto" 
  | "quelonio" 
  | "tanto_faz" 
  | "pouco_tempo" 
  | "tempo_medio" 
  | "muito_tempo" 
  | "pequeno" 
  | "medio" 
  | "grande"
  | "espaco_pequeno"
  | "espaco_medio"
  | "espaco_amplo"
  | "noturno"
  | "diurno"
  | "indiferente";

export type Animal = {
  id: number;
  nome_popular: string;
  nome_cientifico: string;
  nivel: string;
  interesse: string[];
  classe: string;
  tempo: string;
  tamanho: string;
  espaco: string;
  habito: string;
  descricao: string;
  imagem: string;
  slug: string;
};

export type QuizResult = {
  animal: Animal;
  score: number;
};
