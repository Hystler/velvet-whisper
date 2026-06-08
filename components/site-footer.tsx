import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl text-brown">Velvet Whisper</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-mocha">
            Женская одежда quiet luxury для тех, кто выбирает мягкую силу,
            тактильный комфорт и силуэт вне времени.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-taupe">
            Разделы
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-brown">
            <Link href="/catalog">Каталог</Link>
            <Link href="/about">О бренде</Link>
            <Link href="/delivery">Доставка и возврат</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-taupe">
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
