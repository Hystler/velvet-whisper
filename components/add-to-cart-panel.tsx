"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

type VariantOption = {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
};

type AddToCartProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  variants: VariantOption[];
};

const sizeOrder = ["XS", "S", "M", "L"];

export function AddToCartPanel({ product }: { product: AddToCartProduct }) {
  const { addItem } = useCart();
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((variant) => variant.color))),
    [product.variants]
  );
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const variantsByColor = useMemo(
    () =>
      product.variants
        .filter((variant) => variant.color === selectedColor)
        .sort(
          (first, second) =>
            sizeOrder.indexOf(first.size) - sizeOrder.indexOf(second.size)
        ),
    [product.variants, selectedColor]
  );

  const selectedVariant = variantsByColor.find(
    (variant) => variant.size === selectedSize
  );
  const totalStock = product.variants.reduce(
    (sum, variant) => sum + variant.stock,
    0
  );
  const isSoldOut = totalStock <= 0;

  function handleAddToCart() {
    setMessage("");
    setError("");

    if (isSoldOut) {
      setError("Товар закончился.");
      return;
    }

    if (!selectedSize) {
      setError("Выберите размер перед добавлением в корзину.");
      return;
    }

    if (!selectedVariant || selectedVariant.stock <= 0) {
      setError("Этот размер закончился.");
      return;
    }

    const result = addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
      stock: selectedVariant.stock,
      quantity: 1
    });

    if (result.ok) {
      setMessage(result.message);
      return;
    }

    setError(result.message);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-taupe">Цвет</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                setSelectedColor(color);
                setSelectedSize(null);
                setError("");
                setMessage("");
              }}
              className={
                selectedColor === color
                  ? "min-h-11 border border-brown bg-brown px-4 text-sm text-ivory"
                  : "min-h-11 border border-border px-4 text-sm text-brown transition hover:border-brown"
              }
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.18em] text-taupe">
            Размер
          </p>
          <p className="text-xs text-taupe">XS-L</p>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {variantsByColor.map((variant) => {
            const disabled = variant.stock <= 0;

            return (
              <button
                key={variant.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setSelectedSize(variant.size);
                  setError("");
                  setMessage("");
                }}
                className={
                  selectedSize === variant.size
                    ? "min-h-12 border border-brown bg-brown text-sm text-ivory"
                    : "min-h-12 border border-border text-sm text-brown transition hover:border-brown disabled:cursor-not-allowed disabled:bg-border/40 disabled:text-taupe"
                }
              >
                {variant.size}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={isSoldOut}
        onClick={handleAddToCart}
        className="min-h-14 w-full bg-brown px-6 text-sm uppercase tracking-[0.18em] text-ivory transition hover:bg-mocha disabled:cursor-not-allowed disabled:bg-taupe/50"
      >
        {isSoldOut ? "Нет в наличии" : "Добавить в корзину"}
      </button>

      {error ? (
        <p className="border border-[#b58a6c] bg-[#fff8ef] px-4 py-3 text-sm text-brown">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="border border-sage/40 bg-[#edf0e7] px-4 py-3 text-sm text-sage">
          {message} Сумма позиции: {formatPrice(product.price)}
        </p>
      ) : null}

      <p className="text-xs leading-6 text-taupe">
        Наличие обновляется при оформлении заказа. Если размер закончится до
        подтверждения, checkout покажет ошибку.
      </p>
    </div>
  );
}
