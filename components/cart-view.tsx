"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { EmptyState } from "@/components/ui-states";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Корзина пуста"
        description="Добавьте вещь из первой коллекции, чтобы перейти к оформлению заказа."
        actionHref="/catalog"
        actionLabel="Смотреть каталог"
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        {items.map((item) => (
          <article
            key={item.variantId}
            className="grid gap-5 border-b border-border pb-5 sm:grid-cols-[132px_1fr]"
          >
            <Link
              href={`/product/${item.slug}`}
              className="relative block aspect-[4/5] overflow-hidden bg-beige/35"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="132px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-taupe">
                  Нет фото
                </div>
              )}
            </Link>

            <div className="flex flex-col justify-between gap-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-serif text-3xl leading-tight text-brown"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-2 text-sm text-taupe">
                    Размер {item.size} · {item.color}
                  </p>
                  <p className="mt-2 text-sm text-mocha">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="self-start text-xs uppercase tracking-[0.18em] text-taupe underline-offset-4 hover:text-brown hover:underline"
                >
                  Удалить
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex min-h-11 border border-border">
                  <button
                    type="button"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity - 1)
                    }
                    className="w-11 text-lg text-brown transition hover:bg-beige/50 disabled:cursor-not-allowed disabled:text-taupe"
                    aria-label="Уменьшить количество"
                  >
                    -
                  </button>
                  <span className="flex w-12 items-center justify-center border-x border-border text-sm text-brown">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={item.quantity >= item.stock}
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity + 1)
                    }
                    className="w-11 text-lg text-brown transition hover:bg-beige/50 disabled:cursor-not-allowed disabled:text-taupe"
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-brown">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="border border-border bg-[#f8f1e8] p-6 lg:sticky lg:top-28 lg:self-start">
        <p className="text-xs uppercase tracking-[0.22em] text-taupe">
          Итого
        </p>
        <div className="mt-5 flex items-center justify-between border-b border-border pb-5 text-sm text-mocha">
          <span>Сумма заказа</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-5 text-sm leading-7 text-mocha">
          Доставка рассчитывается менеджером после подтверждения заказа.
        </p>
        <Link
          href="/checkout"
          className="primary-button mt-6 w-full"
        >
          Перейти к оформлению
        </Link>
        <button
          type="button"
          onClick={clearCart}
          className="secondary-button mt-4 w-full border-border"
        >
          Очистить корзину
        </button>
      </aside>
    </div>
  );
}
