import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Доставка и возврат",
  description:
    "Информация о доставке, примерке и возврате заказов Velvet Whisper по России."
};

const blocks = [
  {
    title: "Доставка",
    text: "Доставка по Москве доступна курьером. По России заказ отправляется транспортной службой после подтверждения менеджером."
  },
  {
    title: "Примерка",
    text: "Для Москвы можно добавить комментарий к заказу и согласовать удобный интервал примерки с клиентским сервисом."
  },
  {
    title: "Возврат",
    text: "Возврат возможен в течение 14 дней при сохранении товарного вида, ярлыков и оригинальной упаковки."
  },
  {
    title: "Оплата",
    text: "В MVP используется демо-платёж. Реальная оплата будет подключена через Stripe, ЮKassa или CloudPayments."
  }
];

export default function DeliveryPage() {
  return (
    <div className="page-shell py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-taupe">
        Сервис
      </p>
      <h1 className="editorial-title mt-4 max-w-3xl text-6xl text-brown md:text-8xl">
        Доставка и возврат
      </h1>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {blocks.map((block) => (
          <article key={block.title} className="border border-border p-6">
            <h2 className="font-serif text-3xl text-brown">{block.title}</h2>
            <p className="mt-4 text-sm leading-7 text-mocha">{block.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
