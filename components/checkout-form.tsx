"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { EmptyState } from "@/components/ui-states";
import { formatPrice } from "@/lib/format";
import type { CheckoutItemPayload } from "@/lib/cart-types";

type CheckoutFields = {
  customerName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  comment: string;
};

const initialFields: CheckoutFields = {
  customerName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  comment: ""
};

type PaymentState = {
  paymentId: string;
  message: string;
  statusLabel: string;
} | null;

function buildCheckoutItems(items: ReturnType<typeof useCart>["items"]) {
  return items.map<CheckoutItemPayload>((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity
  }));
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [fields, setFields] = useState<CheckoutFields>(initialFields);
  const [payment, setPayment] = useState<PaymentState>(null);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const checkoutItems = useMemo(() => buildCheckoutItems(items), [items]);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Нельзя оформить пустую корзину"
        description="Добавьте товар в корзину, чтобы перейти к оформлению заказа."
        actionHref="/catalog"
        actionLabel="Вернуться в каталог"
      />
    );
  }

  function updateField(name: keyof CheckoutFields, value: string) {
    setFields((current) => ({
      ...current,
      [name]: value
    }));
  }

  function validateForm() {
    if (items.length === 0) {
      return "Корзина пуста.";
    }

    if (!fields.customerName.trim()) {
      return "Введите имя получателя.";
    }

    if (!fields.email.trim() || !fields.email.includes("@")) {
      return "Введите корректный email.";
    }

    if (!fields.phone.trim()) {
      return "Введите телефон для связи.";
    }

    if (!fields.city.trim()) {
      return "Введите город доставки.";
    }

    if (!fields.address.trim()) {
      return "Введите адрес доставки.";
    }

    return "";
  }

  async function handleCreatePayment() {
    setError("");
    setPayment(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: subtotal,
          currency: "RUB",
          description: `Заказ Velvet Whisper на сумму ${formatPrice(subtotal)}`,
          customerEmail: fields.email
        })
      });
      const data = (await response.json()) as {
        paymentId?: string;
        message?: string;
        statusLabel?: string;
      };

      if (!response.ok) {
        setError(data.message ?? "Ошибка оплаты. Попробуйте ещё раз.");
        return;
      }

      setPayment({
        paymentId: data.paymentId ?? "",
        message:
          data.message ??
          "Платёж создан в демо-режиме. Реальное списание не выполняется.",
        statusLabel: data.statusLabel ?? "Ожидает оплаты"
      });
    } catch {
      setError("Ошибка оплаты. Проверьте соединение и попробуйте снова.");
    } finally {
      setPaymentLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setOrderLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...fields,
          paymentId: payment?.paymentId,
          items: checkoutItems
        })
      });
      const data = (await response.json()) as {
        orderId?: string;
        message?: string;
      };

      if (!response.ok) {
        setError(data.message ?? "Ошибка создания заказа. Попробуйте ещё раз.");
        return;
      }

      clearCart();
      router.push(`/success?order=${data.orderId ?? ""}`);
    } catch {
      setError("Ошибка создания заказа. Проверьте соединение и попробуйте снова.");
    } finally {
      setOrderLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-10 lg:grid-cols-[1fr_360px]"
    >
      <div className="space-y-5">
        {[
          ["customerName", "Имя"],
          ["email", "Email"],
          ["phone", "Телефон"],
          ["city", "Город"],
          ["address", "Адрес доставки"]
        ].map(([name, label]) => (
          <label key={name} className="block">
            <span className="text-sm uppercase tracking-[0.18em] text-taupe">
              {label}
            </span>
            <input
              value={fields[name as keyof CheckoutFields]}
              onChange={(event) =>
                updateField(
                  name as keyof CheckoutFields,
                  event.currentTarget.value
                )
              }
              className="mt-3 min-h-12 w-full border border-border bg-[#f8f1e8] px-4 text-brown placeholder:text-taupe"
              placeholder={label}
              autoComplete={name === "email" ? "email" : "on"}
            />
          </label>
        ))}

        <label className="block">
          <span className="text-sm uppercase tracking-[0.18em] text-taupe">
            Комментарий к заказу
          </span>
          <textarea
            value={fields.comment}
            onChange={(event) => updateField("comment", event.currentTarget.value)}
            className="mt-3 min-h-32 w-full resize-y border border-border bg-[#f8f1e8] px-4 py-3 text-brown placeholder:text-taupe"
            placeholder="Например, удобное время доставки"
          />
        </label>

        {error ? (
          <p className="border border-[#b58a6c] bg-[#fff8ef] px-4 py-3 text-sm text-brown">
            {error}
          </p>
        ) : null}
        {payment ? (
          <p className="border border-sage/40 bg-[#edf0e7] px-4 py-3 text-sm leading-6 text-sage">
            {payment.statusLabel}: {payment.message}
          </p>
        ) : null}
      </div>

      <aside className="border border-border bg-[#f8f1e8] p-6 lg:sticky lg:top-28 lg:self-start">
        <p className="text-xs uppercase tracking-[0.22em] text-taupe">
          Заказ
        </p>
        <div className="mt-5 space-y-4 border-b border-border pb-5">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex justify-between gap-4 text-sm text-mocha"
            >
              <span>
                {item.name} · {item.size} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between text-base text-brown">
          <span>Итого</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button
          type="button"
          disabled={paymentLoading || orderLoading}
          onClick={handleCreatePayment}
          className="mt-6 min-h-12 w-full border border-brown px-6 text-sm uppercase tracking-[0.18em] text-brown transition hover:bg-brown hover:text-ivory disabled:cursor-not-allowed disabled:border-taupe disabled:text-taupe"
        >
          {paymentLoading ? "Создаём платёж..." : "Перейти к оплате"}
        </button>
        <button
          type="submit"
          disabled={orderLoading || paymentLoading}
          className="mt-3 min-h-12 w-full bg-brown px-6 text-sm uppercase tracking-[0.18em] text-ivory transition hover:bg-mocha disabled:cursor-not-allowed disabled:bg-taupe/50"
        >
          {orderLoading ? "Оформляем заказ..." : "Оформить заказ"}
        </button>
        <p className="mt-5 text-xs leading-6 text-taupe">
          Онлайн-оплата работает в демо-режиме. Реальное списание средств не
          выполняется.
        </p>
      </aside>
    </form>
  );
}
