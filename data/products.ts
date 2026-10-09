import { Category, CustomerReview, Product } from "@/types/product";
import type { DBProduct } from "@/types/supabase";

export function toDBProduct(p: Product): DBProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    selling_price: p.price,
    original_price: p.originalPrice,
    category_id: p.categorySlug,
    material: p.material,
    dimensions: p.dimensions,
    colour: p.color,
    stock_status: p.stock > 0 ? "in_stock" : "out_of_stock",
    is_featured: !!p.isFeatured,
    is_published: true,
    is_archived: false,
    category: {
      id: p.categorySlug,
      name: p.category,
      slug: p.categorySlug,
      description: null,
      is_active: true,
    },
    product_images: (p.images || [p.image]).map((imgUrl, i) => ({
      id: `${p.id}-img-${i}`,
      product_id: p.id,
      image_url: imgUrl,
      alt_text: p.name,
      display_order: i,
    })),
  };
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Sofas",
    slug: "sofas",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    itemCount: 24,
    description: "Comfort meets understated elegance with high-resilience foam and premium linen fabrics.",
  },
  {
    id: "cat-2",
    name: "Beds",
    slug: "beds",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    itemCount: 18,
    description: "Solid wood beds designed for peaceful sleep and timeless bedroom aesthetics.",
  },
  {
    id: "cat-3",
    name: "Dining",
    slug: "dining",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
    itemCount: 22,
    description: "Gather family and friends around handcrafted solid teak & sheesham dining sets.",
  },
  {
    id: "cat-4",
    name: "Chairs",
    slug: "chairs",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    itemCount: 16,
    description: "Ergonomic accent armchairs and dining chairs tailored for comfort and warm style.",
  },
  {
    id: "cat-5",
    name: "Storage",
    slug: "storage",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    itemCount: 20,
    description: "Organize beautifully with handcrafted wooden sideboards, cabinets, and dressers.",
  },
  {
    id: "cat-6",
    name: "TV Units",
    slug: "tv-units",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    itemCount: 14,
    description: "Minimalist entertainment consoles designed with wire management and clean wood grain finishes.",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "modern-fabric-sofa",
    name: "Modern Fabric Sofa",
    category: "Sofas",
    categorySlug: "sofas",
    price: 24999,
    originalPrice: 32999,
    discount: 24,
    rating: 4.8,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    ],
    material: "High-density Foam + Premium Beige Linen Fabric",
    color: "Beige",
    dimensions: "L 78 x W 34 x H 32 inches",
    description:
      "Crafted for ultimate relaxation, our Modern Fabric Sofa features high-density cushioning wrapped in breathable, stain-resistant linen upholstery.",
    stock: 8,
    isFeatured: true,
    isBestSeller: true,
  },
];

export const WHY_US_BENEFITS = [
  {
    icon: "Hammer",
    title: "Quality Craftsmanship",
    description: "Built using premium kiln-dried hardwoods and durable fabrics designed for decades of daily use.",
  },
  {
    icon: "Sliders",
    title: "Custom Furniture",
    description: "Tailor dimensions, fabric textures, wood polish, and colors to match your home's unique layout.",
  },
  {
    icon: "Truck",
    title: "Reliable Delivery",
    description: "Safe, insured, direct showroom doorstep delivery with protective multi-layer foam packaging.",
  },
  {
    icon: "Headphones",
    title: "Dedicated Support",
    description: "Our showroom & furniture care experts are available 7 days a week to assist with your queries.",
  },
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [];
