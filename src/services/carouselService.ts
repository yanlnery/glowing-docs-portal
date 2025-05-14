
export interface CarouselImage {
  id: string;
  url: string; // Can be a path or data URL
  alt: string;
  order: number;
  title?: string; // Adding title as per HeroCarousel structure
  subtitle?: string; // Adding subtitle as per HeroCarousel structure
}

const LOCAL_STORAGE_KEY = 'carouselImages';

// Default images from HeroCarousel.tsx
const defaultCarouselImages: CarouselImage[] = [
  {
    id: '1',
    url: "/lovable-uploads/921c3722-02d0-419b-b003-caa6b5de021d.png", // Imagem 1 (teiú)
    title: "Animais silvestres legalizados",
    subtitle: "Venha conhecer as espécies mais fascinantes em um criadouro 100% legalizado pelo IBAMA e INEA-RJ",
    alt: "Teiú em um terrário",
    order: 1
  },
  {
    id: '2',
    url: "/lovable-uploads/cd48f5e3-6ae0-4436-b893-4ebe6a08efa6.png", // Imagem 2 (iguanas verdes)
    title: "Criação com manejo responsável",
    subtitle: "Nossos animais recebem alimentação balanceada, ambiente adequado e acompanhamento técnico",
    alt: "Iguanas verdes",
    order: 2
  },
  {
    id: '3',
    url: "/lovable-uploads/610934d9-5fa0-47d8-9148-cc584b051100.png", // Imagem 3 (cobra padrão)
    title: "Animais legalizados com procedência",
    subtitle: "Criação responsável, com autorização dos órgãos ambientais e acompanhamento veterinário",
    alt: "Cobra padrão",
    order: 3
  },
  {
    id: '4',
    url: "/lovable-uploads/13d1c8e0-23bb-4652-b53a-f364cfcefb70.png", // Imagem 4 (teiú na vegetação)
    title: "Compromisso com o bem-estar animal",
    subtitle: "Trabalhamos para garantir qualidade de vida, segurança e respeito em cada etapa da criação",
    alt: "Teiú na vegetação",
    order: 4
  }
];

export const getCarouselImages = (): CarouselImage[] => {
  const storedImages = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedImages) {
    try {
      const parsedImages = JSON.parse(storedImages) as CarouselImage[];
      return parsedImages.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error("Error parsing carousel images from localStorage:", error);
      // Fallback to default if parsing fails
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultCarouselImages));
      return defaultCarouselImages.sort((a, b) => a.order - b.order);
    }
  }
  // Initialize with default if not found
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultCarouselImages));
  return defaultCarouselImages.sort((a, b) => a.order - b.order);
};

export const saveCarouselImages = (images: CarouselImage[]): void => {
  const sortedImages = images.sort((a, b) => a.order - b.order);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortedImages));
};
