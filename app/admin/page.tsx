import type { Metadata } from "next";
import Link from "next/link";
import { AdminDisabled } from "@/components/admin-disabled";
import { AdminNav } from "@/components/admin-nav";
import { AdminPasswordMissing } from "@/components/admin-password-missing";
import { EmptyState, ErrorState } from "@/components/ui-states";
import { formatDate, formatPrice } from "@/lib/format";
import { requireAdminAccess } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/status-labels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Админ-панель",
  description: "Админ-панель Velvet Whisper: товары, заказы и выручка."
};

async function loadAdminStats() {
  try {
    const [productCount, orderCount, revenue, latestOrders] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          where: {
            paymentStatus: "PAID"
          },
          _sum: {
            total: true
          }
        }),
        prisma.order.findMany({
          take: 5,
          orderBy: {
            createdAt: "desc"
          }
        })
      ]);

    return {
      data: {
        productCount,
        orderCount,
        revenue: revenue._sum.total ?? 0,
        latestOrders
      },
      error: false
    };
  } catch {
    return {
      data: null,
      error: true
    };
  }
}

export default async function AdminPage() {
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

  const { data, error } = await loadAdminStats();

  return (
    <div className="page-shell py-12 md:py-20">
      <div className="page-intro">
        <p className="eyebrow text-taupe">Управление</p>
        <h1 className="editorial-title mt-4 text-5xl text-brown sm:text-6xl md:text-7xl">
        Админ-панель
        </h1>
      </div>
      <div className="mt-8">
        <AdminNav />
      </div>

      {error || !data ? (
        <ErrorState
          title="Ошибка загрузки админки"
          description="Проверьте подключение к PostgreSQL и выполните Prisma seed."
        />
      ) : (
        <>
          <section className="grid gap-5 md:grid-cols-3">
            {[
              ["Товары", data.productCount.toString()],
              ["Заказы", data.orderCount.toString()],
              ["Выручка", formatPrice(data.revenue)]
            ].map(([label, value]) => (
              <div key={label} className="editorial-panel p-6">
                <p className="eyebrow text-taupe">
                  {label}
                </p>
                <p className="mt-4 font-serif text-5xl text-brown">{value}</p>
              </div>
            ))}
          </section>

          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="font-serif text-4xl text-brown">
                Последние заказы
              </h2>
              <Link
                href="/admin/orders"
                className="text-link"
              >
                Все заказы
              </Link>
            </div>
            {data.latestOrders.length > 0 ? (
              <div className="overflow-x-auto border border-border">
                <table className="w-full min-w-[760px] border-collapse bg-[#f8f1e8]/80 text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-taupe">
                    <tr>
                      <th className="px-4 py-4 font-normal">Клиент</th>
                      <th className="px-4 py-4 font-normal">Сумма</th>
                      <th className="px-4 py-4 font-normal">Оплата</th>
                      <th className="px-4 py-4 font-normal">Статус</th>
                      <th className="px-4 py-4 font-normal">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.latestOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border">
                        <td className="px-4 py-4 text-brown">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-4 text-mocha">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-4 py-4 text-mocha">
                          {paymentStatusLabels[order.paymentStatus]}
                        </td>
                        <td className="px-4 py-4 text-mocha">
                          {orderStatusLabels[order.orderStatus]}
                        </td>
                        <td className="px-4 py-4 text-mocha">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="Заказов пока нет"
                description="После оформления первого заказа он появится в этой сводке."
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
