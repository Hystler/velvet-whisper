import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="mb-8 flex flex-wrap gap-3 border-b border-border pb-5">
      {[
        ["/admin", "Обзор"],
        ["/admin/products", "Товары"],
        ["/admin/orders", "Заказы"]
      ].map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className="border border-border px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition hover:border-brown"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
