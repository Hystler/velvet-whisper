import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Корзина",
  description:
    "Корзина Velvet Whisper: проверьте выбранные размеры и количество перед оформлением заказа."
};

export default function CartPage() {
  return (
    <div className="page-shell py-12 md:py-16">
      <div className="mb-10 border-b border-border pb-8">
        <p className="text-xs uppercase tracking-[0.28em] text-taupe">
          Корзина
        </p>
        <h1 className="editorial-title mt-4 text-6xl text-brown md:text-8xl">
          Ваш выбор
        </h1>
      </div>
      <CartView />
    </div>
  );
}
