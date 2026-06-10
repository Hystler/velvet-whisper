import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { paymentStatusLabels } from "@/lib/status-labels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Статус заказа",
  description:
    "Статус заказа Velvet Whisper после перехода со страницы оплаты."
};

type SuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
    order?: string;
  }>;
};

function getStatusCopy(paymentStatus?: string) {
  if (paymentStatus === "PAID") {
    return {
      eyebrow: "Оплата подтверждена",
      title: "Оплата прошла успешно",
      description:
        "Мы получили подтверждение оплаты. Заказ передан в обработку."
    };
  }

  if (paymentStatus === "FAILED") {
    return {
      eyebrow: "Оплата не прошла",
      title: "Оплата не прошла",
      description:
        "Платёж был отменён или завершился ошибкой. Вы можете вернуться в каталог или связаться с клиентским сервисом."
    };
  }

  return {
    eyebrow: "Оплата обрабатывается",
    title: "Оплата обрабатывается",
    description:
      "Мы создали заказ и ждём подтверждение от платёжного провайдера. Статус обновится после webhook-уведомления."
  };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId, order } = await searchParams;
  const id = orderId ?? order;
  const orderRecord = id
    ? await prisma.order
        .findUnique({
          where: {
            id
          }
        })
        .catch(() => null)
    : null;
  const copy = getStatusCopy(orderRecord?.paymentStatus);

  return (
    <div className="page-shell py-16 text-center md:py-24">
      <section className="mx-auto max-w-4xl border-y border-border py-12 md:py-16">
        <p className="eyebrow text-taupe">{copy.eyebrow}</p>
        <h1 className="editorial-title mx-auto mt-4 max-w-3xl text-5xl text-brown sm:text-6xl md:text-7xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-mocha">
          {copy.description}
        </p>
        {id ? (
          <div className="mx-auto mt-8 max-w-xl border border-border bg-[#f8f1e8]/80 px-5 py-4 text-sm leading-7 text-mocha">
            <p>Заказ: {id}</p>
            <p>
              Статус оплаты:{" "}
              {orderRecord
                ? paymentStatusLabels[orderRecord.paymentStatus]
                : "заказ пока не найден"}
            </p>
          </div>
        ) : null}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/catalog" className="primary-button">
            Вернуться в каталог
          </Link>
          <Link href="/" className="secondary-button">
            На главную
          </Link>
        </div>
      </section>
    </div>
  );
}
