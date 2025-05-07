export type ProductCategory = 'serpente' | 'lagarto' | 'quelonio';
export type ProductSubcategory =
  | 'colubrideos'
  | 'boideos'
  | 'pequenos'
  | 'grandes'
  | 'terrestres'
  | 'aquaticos';

export interface ProductImage {
  id: string;
  url: string;
  filename: string;
  altText?: string;
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
  description: string;
  price: number;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  featured: boolean;
  isNew: boolean;
  available: boolean;
  images?: ProductImage[];
  details?: ProductDetail[];
  createdAt: string;
  updatedAt: string;
  meta?: Record<string, any>;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
