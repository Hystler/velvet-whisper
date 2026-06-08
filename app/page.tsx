import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { EmptyState, ErrorState } from "@/components/ui-states";
import { getActiveProducts } from "@/lib/shop";
import type { ProductWithDetails } from "@/lib/shop";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Velvet Whisper — первая коллекция женской одежды",
  description:
    "Первая коллекция Velvet Whisper: жакеты, рубашки, брюки, платья, пальто и трикотаж в эстетике quiet luxury.",
  openGraph: {
    title: "Velvet Whisper — первая коллекция",
    description:
      "Мягкое высказывание современной элегантности. Женская одежда в натуральной премиальной палитре."
  }
};

const dnaItems = [
  {
    title: "Мягкая роскошь",
    text: "Вещи без громких деталей, но с точной фактурой, посадкой и ощущением качества."
  },
  {
    title: "Силуэты вне времени",
    text: "Чистые линии, которые не спорят с телом и не зависят от сезонного шума."
  },
  {
    title: "Натуральная палитра",
    text: "Ivory, sand, taupe, mocha и глубокий коричневый как основа спокойного гардероба."
  },
  {
    title: "Повседневная утончённость",
    text: "Одежда, которую легко носить утром, днём и вечером без смены настроения."
  }
];

const materials = ["шерсть", "сатин", "трикотаж", "хлопок", "кожа"];

async function loadFeaturedProducts() {
  try {
    const products = await getActiveProducts(4);
    return {
      products,
      error: false
    };
  } catch {
    return {
      products: [] as ProductWithDetails[],
      error: true
    };
  }
}

export default async function HomePage() {
  const { products, error } = await loadFeaturedProducts();

  return (
    <>
      <section className="relative min-h-[560px] overflow-hidden md:min-h-[640px]">
        <Image
          src="/images/editorial/hero.svg"
          alt="Velvet Whisper, editorial образ первой коллекции"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,238,228,0.94),rgba(244,238,228,0.72),rgba(244,238,228,0.14))]" />
        <div className="page-shell relative flex min-h-[560px] items-end pb-12 pt-24 md:min-h-[640px] md:pb-16">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-taupe">
              Первая коллекция
            </p>
            <h1 className="editorial-title mt-5 text-6xl text-brown sm:text-7xl md:text-8xl">
              Velvet Whisper
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-mocha">
              Мягкое высказывание современной элегантности
            </p>
            <Link
              href="/catalog"
              className="mt-9 inline-flex min-h-12 items-center justify-center bg-brown px-8 text-sm uppercase tracking-[0.18em] text-ivory transition hover:bg-mocha"
            >
              Смотреть коллекцию
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 md:py-24">
        <div className="grid gap-10 border-y border-border py-12 md:grid-cols-[0.9fr_1.1fr]">
          <h2 className="editorial-title text-5xl text-brown md:text-6xl">
            Тихий язык элегантности
          </h2>
          <p className="text-lg leading-9 text-mocha">
            Velvet Whisper создаёт одежду для женщин, которые выбирают
            спокойную элегантность, тактильный комфорт и силуэт вне времени.
          </p>
        </div>
      </section>

      <section className="page-shell pb-16 md:pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dnaItems.map((item) => (
            <article
              key={item.title}
              className="border border-border bg-[#f8f1e8] p-6"
            >
              <h3 className="font-serif text-3xl text-brown">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-mocha">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell pb-16 md:pb-24">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-taupe">
              Избранные вещи
            </p>
            <h2 className="editorial-title mt-3 text-5xl text-brown md:text-6xl">
              Первая коллекция
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-sm uppercase tracking-[0.18em] text-brown underline-offset-4 hover:underline"
          >
            Весь каталог
          </Link>
        </div>

        {error ? (
          <ErrorState
            title="Ошибка загрузки товаров"
            description="Каталог временно недоступен. Проверьте подключение к базе данных."
          />
        ) : products.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Коллекция скоро появится"
            description="После запуска seed-данных здесь появятся избранные товары первой коллекции."
            actionHref="/catalog"
            actionLabel="Перейти в каталог"
          />
        )}
      </section>

      <section className="border-y border-border bg-[#efe4d8]">
        <div className="page-shell grid gap-10 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-20">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-taupe">
              Материалы
            </p>
            <h2 className="editorial-title mt-3 text-5xl text-brown md:text-6xl">
              Тактильная основа гардероба
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {materials.map((material) => (
              <div
                key={material}
                className="border border-border bg-ivory/60 px-5 py-4 text-lg text-brown"
              >
                {material}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-16 text-center md:py-24">
        <p className="text-xs uppercase tracking-[0.28em] text-taupe">
          Velvet Whisper
        </p>
        <h2 className="editorial-title mx-auto mt-4 max-w-3xl text-5xl text-brown md:text-7xl">
          Первая коллекция уже доступна
        </h2>
        <Link
          href="/catalog"
          className="mt-9 inline-flex min-h-12 items-center justify-center bg-brown px-8 text-sm uppercase tracking-[0.18em] text-ivory transition hover:bg-mocha"
        >
          Перейти в каталог
        </Link>
      </section>
    </>
  );
}
