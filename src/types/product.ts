
export type ProductCategory = 'serpente' | 'lagarto' | 'quelonio';
export type ProductSubcategory =
  | 'colubrideos'
  | 'boideos'
  | 'pequenos'
  | 'grandes'
  | 'terrestres'
  | 'aquaticos';

export type ProductStatus = 'disponivel' | 'indisponivel' | 'vendido';

export interface ProductImage {
  id: string;
  url: string;
  filename: string;
  altText?: string;
  alt?: string; // For backward compatibility
}

export interface ProductDetail {
  id: string;
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  speciesName: string;
  speciesId?: string;
  description: string;
  price: number;
  originalPrice?: number;
  pixPrice?: number;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  featured: boolean;
  isNew: boolean;
  available: boolean;
  status?: ProductStatus;
  visible?: boolean;
  order?: number;
  paymentLink?: string;
  images?: ProductImage[];
  details?: ProductDetail[];
  createdAt: string;
  updatedAt: string;
  meta?: Record<string, any>;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
