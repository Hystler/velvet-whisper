"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О бренде" },
  { href: "/delivery", label: "Доставка" },
  { href: "/admin", label: "Админка" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ivory/95 backdrop-blur">
      <div className="page-shell flex min-h-[72px] items-center justify-between gap-3 sm:min-h-20 sm:gap-5">
        <Link
          href="/"
          className="min-w-0 shrink font-serif text-xl text-brown sm:text-2xl"
          aria-label="Velvet Whisper, на главную"
        >
          Velvet Whisper
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Главное меню">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm uppercase tracking-[0.18em] transition hover:text-mocha",
                pathname.startsWith(link.href) ? "text-brown" : "text-taupe"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/cart"
            className="inline-flex min-h-10 items-center justify-center border border-brown px-3 text-xs uppercase tracking-[0.12em] text-brown transition hover:bg-brown hover:text-ivory sm:px-4 sm:tracking-[0.18em]"
          >
            Корзина {totalItems > 0 ? `(${totalItems})` : ""}
          </Link>
          <button
            type="button"
            className="inline-flex min-h-10 items-center border border-border px-3 text-xs uppercase tracking-[0.12em] text-brown sm:px-4 sm:tracking-[0.18em] lg:hidden"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
          >
            {isOpen ? "Закрыть" : "Меню"}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav
          className="border-t border-border bg-ivory px-3 py-4 lg:hidden"
          aria-label="Мобильное меню"
        >
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-border py-3 text-sm uppercase tracking-[0.18em] text-brown"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
