import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Корзина",
  description:
    "Корзина Velvet Whisper: проверьте выбранные размеры и количество перед оформлением заказа."
};

export default function CartPage() {
  return (
    <div className="page-shell py-12 md:py-20">
      <div className="page-intro mb-10">
        <p className="eyebrow text-taupe">Корзина</p>
        <h1 className="editorial-title mt-4 text-5xl text-brown sm:text-6xl md:text-7xl">
          Ваш выбор
        </h1>
      </div>
      <CartView />
    </div>
  );
}
