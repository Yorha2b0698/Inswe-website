// Single source of truth lives in productData.ts.
// This file re-exports everything so existing imports keep working unchanged.

export type { ProductData as Product } from "./productData";

export {
  allProducts,
  getFeaturedProducts,
  getCapsProducts,
  getNonCapsProducts,
  getProductById,
  getRelatedProducts,
  getAllProducts,
} from "./productData";
