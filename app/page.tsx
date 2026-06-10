import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { EmptyState, ErrorState } from "@/components/ui-states";
import { formatPrice } from "@/lib/format";
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
  const previewProducts = products.slice(0, 3);

  return (
    <>
      <section className="page-shell grid min-h-[calc(100vh-76px)] gap-10 py-10 md:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative z-10 min-w-0 max-w-3xl">
          <p className="eyebrow text-taupe">Первая коллекция</p>
          <h1 className="editorial-title mt-5 max-w-full text-5xl text-brown sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            Velvet Whisper
          </h1>
          <p className="mt-6 max-w-xl break-words text-lg leading-8 text-mocha sm:text-xl sm:leading-9">
            Мягкое высказывание современной элегантности
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/catalog" className="primary-button">
              Смотреть коллекцию
            </Link>
            <Link href="/about" className="secondary-button">
              О бренде
            </Link>
          </div>
          <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-6 text-xs uppercase tracking-[0.14em] text-taupe">
            <span>Ivory</span>
            <span>Sand</span>
            <span>Mocha</span>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-beige/30 md:min-h-[600px]">
          <Image
            src="/images/editorial/hero.svg"
            alt="Velvet Whisper, editorial образ первой коллекции"
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 border-t border-ivory/60 bg-ivory/70 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-mocha">
              Lookbook 01 / quiet luxury
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 md:py-24">
        <div className="grid gap-10 border-y border-border py-14 md:grid-cols-[0.85fr_1.15fr] md:py-16">
          <h2 className="editorial-title text-5xl text-brown md:text-7xl">
            Тихий язык элегантности
          </h2>
          <p className="font-serif text-3xl leading-[1.25] text-mocha md:text-5xl">
            Velvet Whisper создаёт одежду для женщин, которые выбирают
            спокойную элегантность, тактильный комфорт и силуэт вне времени.
          </p>
        </div>
      </section>

      <section className="page-shell pb-16 md:pb-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-taupe">Collection preview</p>
            <h2 className="editorial-title mt-3 text-5xl text-brown md:text-7xl">
              Образы первой коллекции
            </h2>
          </div>
          <Link href="/catalog" className="text-link">
            Весь каталог
          </Link>
        </div>

        {error ? (
          <ErrorState
            title="Ошибка загрузки товаров"
            description="Каталог временно недоступен. Проверьте подключение к базе данных."
          />
        ) : previewProducts.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {previewProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className={
                  index === 0
                    ? "group block lg:row-span-2"
                    : "group block"
                }
              >
                <article className="relative overflow-hidden bg-beige/30">
                  <div
                    className={
                      index === 0
                        ? "relative aspect-[4/5] lg:aspect-[3/4]"
                        : "relative aspect-[16/11]"
                    }
                  >
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        fill
                        unoptimized={product.images[0].url.endsWith(".svg")}
                        sizes={
                          index === 0
                            ? "(min-width: 1024px) 56vw, 100vw"
                            : "(min-width: 1024px) 38vw, 100vw"
                        }
                        className="object-cover transition duration-700 group-hover:scale-[1.025]"
                      />
                    ) : null}
                  </div>
                  <div className="border-t border-border bg-[#f8f1e8]/80 px-5 py-5">
                    <p className="eyebrow text-taupe">
                      {product.category.name}
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <h3 className="font-serif text-3xl text-brown">
                        {product.name}
                      </h3>
                      <p className="text-sm text-mocha">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Коллекция скоро появится"
            description="После запуска seed-данных здесь появятся образы первой коллекции."
            actionHref="/catalog"
            actionLabel="Перейти в каталог"
          />
        )}
      </section>

      <section className="page-shell pb-16 md:pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dnaItems.map((item) => (
            <article
              key={item.title}
              className="border-t border-border pt-6"
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
            <p className="eyebrow text-taupe">Избранные вещи</p>
            <h2 className="editorial-title mt-3 text-5xl text-brown md:text-6xl">
              Velvet Whisper
            </h2>
          </div>
          <Link href="/catalog" className="text-link">
            Смотреть все
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

      <section className="border-y border-border bg-[#efe4d8]/70">
        <div className="page-shell grid gap-10 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
          <div>
            <p className="eyebrow text-taupe">Материалы</p>
            <h2 className="editorial-title mt-3 text-5xl text-brown md:text-6xl">
              Тактильная основа гардероба
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {materials.map((material) => (
              <div
                key={material}
                className="border-b border-border px-1 py-4 font-serif text-3xl text-brown"
              >
                {material}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-16 text-center md:py-24">
        <p className="eyebrow text-taupe">Velvet Whisper</p>
        <h2 className="editorial-title mx-auto mt-4 max-w-3xl text-5xl text-brown md:text-7xl">
          Первая коллекция уже доступна
        </h2>
        <Link href="/catalog" className="primary-button mt-9">
          Перейти в каталог
        </Link>
      </section>
    </>
  );
}
