import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Заказ оформлен",
  description:
    "Заказ Velvet Whisper успешно создан. Менеджер свяжется с вами для подтверждения."
};

type SuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { order } = await searchParams;

  return (
    <div className="page-shell py-20 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-taupe">
        Заказ создан
      </p>
      <h1 className="editorial-title mx-auto mt-4 max-w-3xl text-6xl text-brown md:text-8xl">
        Спасибо за заказ
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-mocha">
        Мы получили заказ{order ? ` №${order}` : ""}. Менеджер Velvet Whisper
        свяжется с вами для подтверждения состава, доставки и оплаты.
      </p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/catalog"
          className="inline-flex min-h-12 items-center justify-center bg-brown px-8 text-sm uppercase tracking-[0.18em] text-ivory transition hover:bg-mocha"
        >
          Вернуться в каталог
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center border border-brown px-8 text-sm uppercase tracking-[0.18em] text-brown transition hover:bg-brown hover:text-ivory"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
