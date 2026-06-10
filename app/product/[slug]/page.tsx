import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { ErrorState } from "@/components/ui-states";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/lib/shop";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        title: "Товар не найден"
      };
    }

    const image = product.images[0]?.url;

    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: `${product.name} — Velvet Whisper`,
        description: product.description,
        images: image ? [{ url: image, alt: product.name }] : undefined,
        type: "website"
      }
    };
  } catch {
    return {
      title: "Товар Velvet Whisper"
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => undefined);

  if (product === undefined) {
    return (
      <div className="page-shell py-16 md:py-24">
        <ErrorState
          title="Ошибка загрузки товара"
          description="Не удалось получить карточку товара. Проверьте подключение к базе данных и попробуйте ещё раз."
          actionHref="/catalog"
          actionLabel="Вернуться в каталог"
        />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const primaryImage = product.images[0]?.url ?? "";
  const totalStock = product.variants.reduce(
    (sum, variant) => sum + variant.stock,
    0
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) =>
      image.url.startsWith("http") ? image.url : `${siteUrl}${image.url}`
    ),
    brand: {
      "@type": "Brand",
      name: "Velvet Whisper"
    },
    sku: product.variants[0]?.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: product.price,
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock"
    }
  };

  return (
    <div className="page-shell py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/catalog"
        className="text-link"
      >
        Назад в каталог
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {product.images.length > 0 ? (
            product.images.map((image, index) => (
              <div
                key={image.id}
                className={
                  index === 0
                    ? "relative aspect-[4/5] overflow-hidden bg-beige/35 sm:col-span-2"
                    : "relative aspect-[4/5] overflow-hidden bg-beige/35"
                }
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  unoptimized={image.url.endsWith(".svg")}
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 55vw, 100vw"
                      : "(min-width: 1024px) 25vw, 50vw"
                  }
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center bg-beige/40 text-sm text-taupe sm:col-span-2">
              Изображение скоро появится
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-taupe">
            {product.category.name}
          </p>
          <h1 className="editorial-title mt-4 text-5xl text-brown sm:text-6xl lg:text-7xl">
            {product.name}
          </h1>
          <div className="mt-7 flex items-end gap-4">
            <p className="text-xl text-brown">{formatPrice(product.price)}</p>
            {product.oldPrice ? (
              <p className="text-sm text-taupe line-through">
                {formatPrice(product.oldPrice)}
              </p>
            ) : null}
          </div>
          <div className="mt-6 grid gap-3 border-y border-border py-5 text-sm text-mocha">
            <p className="flex justify-between gap-4">
              <span className="text-taupe">Цвет</span>
              <span className="text-right text-brown">{product.color}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-taupe">Наличие</span>
              <span className="text-right text-brown">
                {totalStock > 0 ? "В наличии" : "Товар закончился"}
              </span>
            </p>
          </div>

          <div className="py-8">
            <AddToCartPanel
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: primaryImage,
                variants: product.variants.map((variant) => ({
                  id: variant.id,
                  size: variant.size,
                  color: variant.color,
                  stock: variant.stock,
                  sku: variant.sku
                }))
              }}
            />
          </div>

          <div className="divide-y divide-border border-y border-border">
            {[
              ["Описание", product.description],
              ["Состав", product.material],
              ["Посадка", product.fit],
              ["Уход", product.care],
              [
                "Доставка и возврат",
                "Курьерская доставка по Москве и отправка по России. Возврат возможен в течение 14 дней при сохранении товарного вида."
              ]
            ].map(([title, text]) => (
              <section key={title} className="py-5">
                <h2 className="eyebrow text-taupe">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-mocha">{text}</p>
              </section>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
