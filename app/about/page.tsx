import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О бренде",
  description:
    "Velvet Whisper создаёт женскую одежду quiet luxury: спокойная элегантность, натуральная палитра и силуэты вне времени."
};

export default function AboutPage() {
  return (
    <div className="page-shell py-12 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-taupe">
            О бренде
          </p>
          <h1 className="editorial-title mt-4 text-6xl text-brown md:text-8xl">
            Velvet Whisper
          </h1>
        </div>
        <div className="space-y-6 text-base leading-8 text-mocha">
          <p>
            Velvet Whisper создаёт одежду для женщин, которые выбирают
            спокойную элегантность, тактильный комфорт и силуэт вне времени.
          </p>
          <p>
            Мы работаем с мягкой премиальной палитрой, чистыми линиями и
            материалами, которые раскрываются в движении. Каждая вещь должна
            легко входить в гардероб и оставаться актуальной дольше одного
            сезона.
          </p>
          <p>
            Для нас quiet luxury — это не отсутствие выразительности, а умение
            говорить тише и точнее: через посадку, фактуру, пропорцию и
            ощущение собранности.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-3">
        {["Фактура", "Линия", "Спокойствие"].map((item) => (
          <div key={item} className="border border-border bg-[#f8f1e8] p-6">
            <p className="font-serif text-3xl text-brown">{item}</p>
            <p className="mt-4 text-sm leading-7 text-mocha">
              Основа визуального языка бренда и каждого предмета коллекции.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
