export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  size: string;
  color: string;
  sku: string;
  stock: number;
  quantity: number;
};

export type CheckoutItemPayload = {
  productId: string;
  variantId: string;
  quantity: number;
};
