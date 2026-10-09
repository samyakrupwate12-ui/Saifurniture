export type CategoryType =
  | "Sofas"
  | "Beds"
  | "Dining"
  | "Chairs"
  | "Storage"
  | "TV Units";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryType;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discount: number; // Percentage
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  material: string;
  color: string;
  colors?: ColorOption[];
  dimensions: string;
  description: string;
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  careInstructions?: string;
  warranty?: string;
  deliveryInfo?: string;
  assembly?: string;
}

export interface Category {
  id: string;
  name: CategoryType;
  slug: string;
  image: string;
  itemCount: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type SortOption =
  | "recommended"
  | "newest"
  | "price-low-high"
  | "price-high-low";

export interface FilterState {
  category: string;
  maxPrice: number;
  materials: string[];
  sortBy: SortOption;
  searchQuery: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  productName: string;
  comment: string;
  date: string;
  avatar?: string;
}
