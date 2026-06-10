import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { EmptyState, ErrorState } from "@/components/ui-states";
import { getActiveProducts, getCategories } from "@/lib/shop";
import type { ProductWithDetails } from "@/lib/shop";
import type { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог женской одежды",
  description:
    "Каталог Velvet Whisper: жакеты, рубашки, брюки, платья, пальто и трикотаж в эстетике quiet luxury.",
  openGraph: {
    title: "Каталог Velvet Whisper",
    description: "Премиальная женская одежда первой коллекции."
  }
};

async function loadCatalog() {
  try {
    const [products, categories] = await Promise.all([
      getActiveProducts(),
      getCategories()
    ]);

    return {
      products,
      categories,
      error: false
    };
  } catch {
    return {
      products: [] as ProductWithDetails[],
      categories: [] as Category[],
      error: true
    };
  }
}

export default async function CatalogPage() {
  const { products, categories, error } = await loadCatalog();

  return (
    <div className="page-shell overflow-hidden pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="page-intro">
        <p className="eyebrow text-taupe">Каталог</p>
        <h1 className="editorial-title mt-4 max-w-full pb-2 text-5xl text-brown sm:text-6xl lg:text-7xl">
          Первая коллекция
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-mocha">
          Выберите вещь по силуэту, материалу и настроению. Каждая позиция
          создана как часть спокойной, цельной капсулы.
        </p>
      </div>

      {categories.length > 0 ? (
        <nav className="flex gap-6 overflow-x-auto border-b border-border py-6">
          <Link
            href="/catalog"
            className="whitespace-nowrap border-b border-brown pb-2 text-xs uppercase tracking-[0.18em] text-brown"
          >
            Все
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="whitespace-nowrap pb-2 text-xs uppercase tracking-[0.18em] text-taupe transition hover:text-brown"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="mt-10">
        {error ? (
          <ErrorState
            title="Ошибка загрузки каталога"
            description="Не удалось получить товары. Проверьте подключение к базе данных и выполните seed."
          />
        ) : products.length > 0 ? (
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Каталог пуст"
            description="Запустите seed-данные, чтобы наполнить каталог первой коллекцией."
            actionHref="/"
            actionLabel="На главную"
          />
        )}
      </div>
    </div>
  );
}
