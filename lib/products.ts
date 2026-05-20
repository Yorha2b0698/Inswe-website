// Re-export types and functions from the centralized product data file
// This maintains backward compatibility while using the single source of truth

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;   // primary image (used by "You may also like")
  images: string[]; // all 4 images for the hover carousel
  inStock: boolean;
  isFeatured?: boolean; // For featured products in CollectionCarousel
  isCaps?: boolean; // For caps-only filtering in CollectionCarousel
};

// Re-export from centralized product data
export { 
  allProducts, 
  getFeaturedProducts, 
  getProductById, 
  getRelatedProducts 
} from './productData';