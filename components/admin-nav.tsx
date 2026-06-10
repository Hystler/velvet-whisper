import Link from "next/link";
import { logoutAdmin } from "@/app/admin/auth-actions";

export function AdminNav() {
  return (
    <nav className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
      <div className="flex flex-wrap gap-3">
        {[
          ["/admin", "Обзор"],
          ["/admin/products", "Товары"],
          ["/admin/orders", "Заказы"]
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="border border-border bg-ivory/40 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition hover:border-brown hover:bg-ivory"
          >
            {label}
          </Link>
        ))}
      </div>
      <form action={logoutAdmin}>
        <button
          type="submit"
          className="border border-border px-4 py-2 text-xs uppercase tracking-[0.16em] text-taupe transition hover:border-brown hover:text-brown"
        >
          Выйти
        </button>
      </form>
    </nav>
  );
}
