import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductWithDetails } from "@/lib/shop";

export function ProductCard({ product }: { product: ProductWithDetails }) {
  const primaryImage = product.images[0];

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-beige/40">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              unoptimized={primaryImage.url.endsWith(".svg")}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-taupe">
              Изображение скоро появится
            </div>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-taupe">
              {product.category.name}
            </p>
            <h3 className="mt-2 font-serif text-2xl leading-tight text-brown">
              {product.name}
            </h3>
          </div>
          <div className="text-right text-sm text-brown">
            <p>{formatPrice(product.price)}</p>
            {product.oldPrice ? (
              <p className="mt-1 text-xs text-taupe line-through">
                {formatPrice(product.oldPrice)}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3 text-xs uppercase tracking-[0.16em] text-taupe">
          <span>{product.color}</span>
          <span>{product.material.split(",")[0]}</span>
        </div>
      </Link>
    </article>
  );
}
