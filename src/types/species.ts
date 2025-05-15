
export interface Species {
  id: string;
  commonName: string;
  name: string; // Scientific Name
  description: string;
  characteristics: string[];
  curiosities: string[];
  image: string;
  order: number;
  type: string;
  slug: string;
}
