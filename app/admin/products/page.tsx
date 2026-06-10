import type { Metadata } from "next";
import { toggleProductStatus } from "@/app/admin/actions";
import { AdminDisabled } from "@/components/admin-disabled";
import { AdminNav } from "@/components/admin-nav";
import { AdminPasswordMissing } from "@/components/admin-password-missing";
import { EmptyState, ErrorState } from "@/components/ui-states";
import { formatPrice } from "@/lib/format";
import { requireAdminAccess } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Товары — админ-панель",
  description: "Управление товарами Velvet Whisper: цены, категории и остатки."
};

async function loadProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return {
      products,
      error: false
    };
  } catch {
    return {
      products: [],
      error: true
    };
  }
}

export default async function AdminProductsPage() {
  const access = await requireAdminAccess();

  if (access === "disabled") {
    return (
      <div className="page-shell py-12 md:py-16">
        <AdminDisabled />
      </div>
    );
  }

  if (access === "password-missing") {
    return (
      <div className="page-shell py-12 md:py-16">
        <AdminPasswordMissing />
      </div>
    );
  }

  const { products, error } = await loadProducts();

  return (
    <div className="page-shell py-12 md:py-20">
      <div className="page-intro">
        <p className="eyebrow text-taupe">Админка</p>
        <h1 className="editorial-title mt-4 text-5xl text-brown sm:text-6xl md:text-7xl">
          Товары
        </h1>
      </div>
      <div className="mt-8">
        <AdminNav />
      </div>

      {error ? (
        <ErrorState
          title="Ошибка загрузки товаров"
          description="Не удалось получить список товаров из базы данных."
        />
      ) : products.length > 0 ? (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[900px] border-collapse bg-[#f8f1e8]/80 text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-taupe">
              <tr>
                <th className="px-4 py-4 font-normal">Товар</th>
                <th className="px-4 py-4 font-normal">Статус</th>
                <th className="px-4 py-4 font-normal">Цена</th>
                <th className="px-4 py-4 font-normal">Категория</th>
                <th className="px-4 py-4 font-normal">Остатки</th>
                <th className="px-4 py-4 font-normal">Действие</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stock = product.variants.reduce(
                  (sum, variant) => sum + variant.stock,
                  0
                );

                return (
                  <tr key={product.id} className="border-b border-border">
                    <td className="px-4 py-4 text-brown">{product.name}</td>
                    <td className="px-4 py-4 text-mocha">
                      {product.isActive ? "Активен" : "Скрыт"}
                    </td>
                    <td className="px-4 py-4 text-mocha">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-4 text-mocha">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-4 text-mocha">{stock}</td>
                    <td className="px-4 py-4">
                      <form action={toggleProductStatus}>
                        <input
                          type="hidden"
                          name="productId"
                          value={product.id}
                        />
                        <input
                          type="hidden"
                          name="currentStatus"
                          value={product.isActive.toString()}
                        />
                        <button
                          type="submit"
                          className="min-h-10 border border-border bg-ivory/40 px-4 text-xs uppercase tracking-[0.16em] text-brown transition hover:border-brown hover:bg-ivory"
                        >
                          {product.isActive ? "Скрыть" : "Активировать"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Товаров пока нет"
          description="Запустите seed-данные, чтобы заполнить каталог демо-товарами."
        />
      )}
    </div>
  );
}
