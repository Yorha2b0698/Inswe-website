export type ProductData = {
  id: number;
  name: string;
  price: number;
  image: string;   // primary image (used by "You may also like")
  images: string[]; // all 4 images for the hover carousel
  inStock: boolean;
  isFeatured?: boolean; // For featured products in CollectionCarousel
  isCaps?: boolean; // For caps-only filtering in CollectionCarousel
};

// Centralized product catalog - single source of truth for all product data
export const allProducts: ProductData[] = [
  // Bag products
  {
    id: 1,
    name: "Cesarine leather bag",
    price: 79.99,
    image: "/assets/images/Bag-black1.jpeg",
    images: [
      "/assets/images/Bag-black1.jpeg",
      "/assets/images/Bag-black2.jpeg",
      "/assets/images/Bag-black3.jpeg",
      "/assets/images/Bag-black4.png",
    ],
    inStock: true,
    isFeatured: true,
    isCaps: false,
  },
  {
    id: 2,
    name: "Cesarine leather bag",
    price: 79.99,
    image: "/assets/images/Bag-black-small.jpg",
    images: [
      "/assets/images/Bag-black-small1.jpg",
      "/assets/images/Bag-black-small2.jpg",
      "/assets/images/Bag-black-small3.jpg",
      "/assets/images/Bag-black-small4.JPG",
    ],
    inStock: true,
    isFeatured: true,
    isCaps: false,
  },
  {
    id: 3,
    name: "Cesarine Grande yellow bag",
    price: 79.99,
    image: "/assets/images/Bag-yellow1.png",
    images: [
      "/assets/images/Bag-yellow1.png",
      "/assets/images/Bag-yellow2.png",
      "/assets/images/Bag-yellow3.png",
    ],
    inStock: true,
    isFeatured: true,
    isCaps: false,
  },
  {
    id: 4,
    name: "Cesarine Grande yellow bag",
    price: 79.99,
    image: "/assets/images/Bag-yellow-small.png",
    images: [
      "/assets/images/Bag-yellow-small.png",
      "/assets/images/Bag-yellow-small1.png",
      "/assets/images/Bag-yellow-small2.png",
      "/assets/images/Bag-yellow-small3.png",
    ],
    inStock: true,
    isFeatured: true,
    isCaps: false,
  },
  // Cap products
  {
    id: 5,
    name: "Pink zipper cap",
    price: 84.99,
    image: "/assets/images/JNSWE_caps_17_pink.jpg",
    images: [
      "/assets/images/JNSWE_caps_17_pink.jpg",
      "/assets/images/JNSWE_caps_17_pink1.jpg",
      "/assets/images/JNSWE_caps_17_pink2.jpg",
      "/assets/images/JNSWE_caps_17_pink3.jpg",
    ],
    inStock: true,
    isCaps: true,
  },
  {
    id: 6,
    name: "Black rope trucker cap",
    price: 84.99,
    image: "/assets/images/JNSWE_caps_18_black.jpg",
    images: [
      "/assets/images/JNSWE_caps_18_black.jpg",
      "/assets/images/JNSWE_caps_18_black1.jpg",
      "/assets/images/JNSWE_caps_18_black2.jpg",
      "/assets/images/JNSWE_caps_18_black3.jpg",
    ],
    inStock: true,
    isCaps: true,
  },
  {
    id: 7,
    name: "Blue rope trucker cap",
    price: 84.99,
    image: "/assets/images/JNSWE_caps_19_blue.jpg",
    images: [
      "/assets/images/JNSWE_caps_19_blue.jpg",
      "/assets/images/JNSWE_caps_19_blue1.jpg",
      "/assets/images/JNSWE_caps_19_blue2.jpg",
      "/assets/images/JNSWE_caps_19_blue3.jpg",
    ],
    inStock: true,
    isCaps: true,
  },
  {
    id: 8,
    name: "Brown zipper cap",
    price: 79.99,
    image: "/assets/images/JNSWE_caps_20_brown.jpg",
    images: [
      "/assets/images/JNSWE_caps_20_brown.jpg",
      "/assets/images/JNSWE_caps_20_brown1.jpg",
      "/assets/images/JNSWE_caps_20_brown2.jpg",
      "/assets/images/JNSWE_caps_20_brown3.jpg",
    ],
    inStock: true,
    isCaps: true,
  },
  {
    id: 9,
    name: "Black zipper cap",
    price: 84.99,
    image: "/assets/images/JNSWE_caps_21_backzip.jpg",
    images: [
      "/assets/images/JNSWE_caps_21_backzip.jpg",
      "/assets/images/JNSWE_caps_21_backzip1.jpg",
      "/assets/images/JNSWE_caps_21_backzip2.jpg",
      "/assets/images/JNSWE_caps_21_backzip3.jpg",
    ],
    inStock: true,
    isCaps: true,
  },
  {
    id: 10,
    name: "White Rope cap",
    price: 79.99,
    image: "/assets/images/JNSWE_caps_22_white.jpg",
    images: [
      "/assets/images/JNSWE_caps_22_white.jpg",
      "/assets/images/JNSWE_caps_22_white1.jpg",
      "/assets/images/JNSWE_caps_22_white2.jpg",
      "/assets/images/JNSWE_caps_22_white3.jpg",
    ],
    inStock: true,
    isCaps: true,
  },
];

// Helper functions for filtering products
export const getFeaturedProducts = () => allProducts.filter(product => product.isFeatured);
export const getCapsProducts = () => allProducts.filter(product => product.isCaps);
export const getNonCapsProducts = () => allProducts.filter(product => !product.isCaps);

// Get product by ID
export const getProductById = (id: number) => allProducts.find(product => product.id === id);

// Get related products (excluding the current product)
export const getRelatedProducts = (currentProductId: number, limit: number = 4) => {
  return allProducts
    .filter(product => product.id !== currentProductId)
    .slice(0, limit);
};

// Get all products (for backward compatibility)
export const getAllProducts = () => allProducts;