import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-[#efe4d8]/55">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr] md:py-16">
        <div>
          <p className="font-serif text-4xl text-brown">Velvet Whisper</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-mocha">
            Женская одежда quiet luxury для тех, кто выбирает мягкую силу,
            тактильный комфорт и силуэт вне времени.
          </p>
        </div>
        <div>
          <p className="eyebrow text-taupe">
            Разделы
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-brown">
            <Link href="/catalog">Каталог</Link>
            <Link href="/about">О бренде</Link>
            <Link href="/delivery">Доставка и возврат</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow text-taupe">
            Клиентский сервис
          </p>
          <p className="mt-4 text-sm leading-7 text-mocha">
            support@velvetwhisper.demo
            <br />
            Ежедневно с 10:00 до 20:00
          </p>
        </div>
      </div>
    </footer>
  );
}
