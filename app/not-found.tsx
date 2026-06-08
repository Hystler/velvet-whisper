import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell py-20 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-taupe">404</p>
      <h1 className="editorial-title mx-auto mt-4 max-w-2xl text-5xl text-brown md:text-7xl">
        Страница не найдена
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-mocha">
        Возможно, адрес изменился или коллекция была обновлена.
      </p>
      <Link
        href="/catalog"
        className="mt-8 inline-flex min-h-11 items-center justify-center bg-brown px-7 text-sm uppercase tracking-[0.18em] text-ivory transition hover:bg-mocha"
      >
        Перейти в каталог
      </Link>
    </div>
  );
}
