
export type ProductImage = {
  id: string;
  url: string;
  alt: string;
};

export type ProductCategory = 'serpente' | 'lagarto' | 'quelonio';

export type ProductSubcategory = 'boideos' | 'colubrideos' | 'pequenos' | 'grandes' | 'aquaticos' | 'terrestres';

export type ProductStatus = 'disponivel' | 'indisponivel' | 'vendido';

export type Product = {
  id: string;
  name: string;
  speciesId: string; // Reference to the species ID
  speciesName: string; // Full species name
  category: ProductCategory;
  subcategory: ProductSubcategory;
  status: ProductStatus;
  price: number;
  paymentLink: string;
  images: ProductImage[];
  description: string;
  featured: boolean;
  isNew: boolean;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
