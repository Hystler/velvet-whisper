import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description:
    "Оформление заказа Velvet Whisper: контакты, доставка и демо-оплата."
};

export default function CheckoutPage() {
  return (
    <div className="page-shell py-12 md:py-20">
      <div className="page-intro mb-10">
        <p className="eyebrow text-taupe">Checkout</p>
        <h1 className="editorial-title mt-4 text-5xl text-brown sm:text-6xl md:text-7xl">
          Оформление заказа
        </h1>
      </div>
      <CheckoutForm />
    </div>
  );
}
