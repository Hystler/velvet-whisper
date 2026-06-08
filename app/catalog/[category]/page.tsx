import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { EmptyState, ErrorState } from "@/components/ui-states";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory
} from "@/lib/shop";
import type { ProductWithDetails } from "@/lib/shop";
import type { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  try {
    const categoryRecord = await getCategoryBySlug(category);

    if (!categoryRecord) {
      return {
        title: "Категория не найдена"
      };
    }

    return {
      title: `${categoryRecord.name} — каталог`,
      description: `${categoryRecord.name} Velvet Whisper: премиальная женская одежда в эстетике quiet luxury.`,
      openGraph: {
        title: `${categoryRecord.name} Velvet Whisper`,
        description: "Категория первой коллекции Velvet Whisper."
      }
    };
  } catch {
    return {
      title: "Категория Velvet Whisper"
    };
  }
}

async function loadCategoryPage(categorySlug: string) {
  try {
    const [category, products, categories] = await Promise.all([
      getCategoryBySlug(categorySlug),
      getProductsByCategory(categorySlug),
      getCategories()
    ]);

    return {
      category,
      products,
      categories,
      error: false
    };
  } catch {
    return {
      category: null,
      products: [] as ProductWithDetails[],
      categories: [] as Category[],
      error: true
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { category, products, categories, error } =
    await loadCategoryPage(categorySlug);

  if (!error && !category) {
    notFound();
  }

  return (
    <div className="page-shell overflow-hidden pb-12 pt-14 md:pb-16 md:pt-[4.5rem]">
      <div className="border-b border-border pb-8">
        <Link
          href="/catalog"
          className="text-xs uppercase tracking-[0.22em] text-taupe underline-offset-4 hover:underline"
        >
          Весь каталог
        </Link>
        <h1 className="editorial-title mt-4 max-w-full pb-2 text-5xl leading-[1.05] text-brown sm:text-6xl lg:text-7xl">
          {category?.name ?? "Категория"}
        </h1>
      </div>

      {categories.length > 0 ? (
        <nav className="flex gap-3 overflow-x-auto border-b border-border py-5">
          <Link
            href="/catalog"
            className="whitespace-nowrap border border-border px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition hover:border-brown"
          >
            Все
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/catalog/${item.slug}`}
              className={
                item.slug === categorySlug
                  ? "whitespace-nowrap bg-brown px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory"
                  : "whitespace-nowrap border border-border px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition hover:border-brown"
              }
            >
              {item.name}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="mt-10">
        {error ? (
          <ErrorState
            title="Ошибка загрузки категории"
            description="Не удалось получить товары этой категории. Проверьте подключение к базе данных."
          />
        ) : products.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="В этой категории пока пусто"
            description="Мы обновляем состав первой коллекции. Загляните в полный каталог."
            actionHref="/catalog"
            actionLabel="Весь каталог"
          />
        )}
      </div>
    </div>
  );
}
