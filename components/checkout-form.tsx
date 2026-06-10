"use client";

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

function buildCheckoutItems(items: ReturnType<typeof useCart>["items"]) {
  return items.map<CheckoutItemPayload>((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity
  }));
}

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [fields, setFields] = useState<CheckoutFields>(initialFields);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const checkoutItems = useMemo(() => buildCheckoutItems(items), [items]);
  const isSubmitting = orderLoading || paymentLoading;

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isSubmitting) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setOrderLoading(true);

    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...fields,
          items: checkoutItems
        })
      });
      const orderData = (await orderResponse.json()) as {
        orderId?: string;
        message?: string;
      };

      if (!orderResponse.ok || !orderData.orderId) {
        setError(
          orderData.message ?? "Ошибка создания заказа. Попробуйте ещё раз."
        );
        return;
      }

      setOrderLoading(false);
      setPaymentLoading(true);

      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: orderData.orderId
        })
      });
      const paymentData = (await paymentResponse.json()) as {
        redirectUrl?: string;
        message?: string;
      };

      if (!paymentResponse.ok || !paymentData.redirectUrl) {
        setError(paymentData.message ?? "Ошибка оплаты. Попробуйте ещё раз.");
        return;
      }

      clearCart();
      window.location.href = paymentData.redirectUrl;
    } catch {
      setError(
        "Ошибка оформления заказа или оплаты. Проверьте соединение и попробуйте снова."
      );
    } finally {
      setOrderLoading(false);
      setPaymentLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-10 lg:grid-cols-[1fr_380px]"
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
            <span className="eyebrow text-taupe">
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
              className="input-surface mt-3"
              placeholder={label}
              autoComplete={name === "email" ? "email" : "on"}
            />
          </label>
        ))}

        <label className="block">
          <span className="eyebrow text-taupe">
            Комментарий к заказу
          </span>
          <textarea
            value={fields.comment}
            onChange={(event) =>
              updateField("comment", event.currentTarget.value)
            }
            className="input-surface mt-3 min-h-32 resize-y py-3"
            placeholder="Например, удобное время доставки"
          />
        </label>

        {error ? (
          <p className="border border-[#b58a6c] bg-[#fff8ef] px-4 py-3 text-sm text-brown">
            {error}
          </p>
        ) : null}
      </div>

      <aside className="editorial-panel p-6 lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow text-taupe">Заказ</p>
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
          type="submit"
          disabled={isSubmitting}
          className="primary-button mt-6 w-full disabled:cursor-not-allowed disabled:bg-taupe/50"
        >
          {paymentLoading
            ? "Переходим к оплате..."
            : orderLoading
              ? "Оформляем заказ..."
              : "Перейти к оплате"}
        </button>
        <p className="mt-5 text-xs leading-6 text-taupe">
          После подтверждения заказа вы перейдёте на защищённую страницу оплаты.
          Статус оплаты обновится после уведомления от платёжного провайдера.
        </p>
      </aside>
    </form>
  );
}
