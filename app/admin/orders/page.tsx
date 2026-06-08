import type { Metadata } from "next";
import { updateOrderStatuses } from "@/app/admin/actions";
import { AdminDisabled } from "@/components/admin-disabled";
import { AdminNav } from "@/components/admin-nav";
import { EmptyState, ErrorState } from "@/components/ui-states";
import { formatDate, formatPrice } from "@/lib/format";
import { isAdminDemoEnabled } from "@/lib/admin-demo";
import { prisma } from "@/lib/prisma";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/status-labels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Заказы — админ-панель",
  description: "Заказы Velvet Whisper: клиенты, суммы, статусы оплаты и доставки."
};

async function loadOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return {
      orders,
      error: false
    };
  } catch {
    return {
      orders: [],
      error: true
    };
  }
}

export default async function AdminOrdersPage() {
  if (!isAdminDemoEnabled()) {
    return (
      <div className="page-shell py-12 md:py-16">
        <AdminDisabled />
      </div>
    );
  }

  const { orders, error } = await loadOrders();

  return (
    <div className="page-shell py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-taupe">
        Админка
      </p>
      <h1 className="editorial-title mt-4 text-6xl text-brown md:text-8xl">
        Заказы
      </h1>
      <div className="mt-8">
        <AdminNav />
      </div>

      {error ? (
        <ErrorState
          title="Ошибка загрузки заказов"
          description="Не удалось получить список заказов из базы данных."
        />
      ) : orders.length > 0 ? (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="border border-border bg-[#f8f1e8] p-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div>
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-taupe">
                        Заказ {order.id}
                      </p>
                      <h2 className="mt-2 font-serif text-3xl text-brown">
                        {order.customerName}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-mocha">
                        {order.email} · {order.phone}
                        <br />
                        {order.city}, {order.address}
                      </p>
                    </div>
                    <div className="text-sm text-mocha sm:text-right">
                      <p>{formatPrice(order.total)}</p>
                      <p className="mt-2">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    {order.items.map((item) => (
                      <p key={item.id} className="text-sm leading-7 text-mocha">
                        {item.product.name} · размер {item.variant.size} ·{" "}
                        {item.quantity} шт. · {formatPrice(item.price)}
                      </p>
                    ))}
                    {order.comment ? (
                      <p className="mt-4 text-sm leading-7 text-taupe">
                        Комментарий: {order.comment}
                      </p>
                    ) : null}
                  </div>
                </div>

                <form action={updateOrderStatuses} className="space-y-4">
                  <input type="hidden" name="orderId" value={order.id} />
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em] text-taupe">
                      Оплата
                    </span>
                    <select
                      name="paymentStatus"
                      defaultValue={order.paymentStatus}
                      className="mt-2 min-h-11 w-full border border-border bg-ivory px-3 text-sm text-brown"
                    >
                      {Object.entries(paymentStatusLabels).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em] text-taupe">
                      Заказ
                    </span>
                    <select
                      name="orderStatus"
                      defaultValue={order.orderStatus}
                      className="mt-2 min-h-11 w-full border border-border bg-ivory px-3 text-sm text-brown"
                    >
                      {Object.entries(orderStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="min-h-11 w-full bg-brown px-4 text-xs uppercase tracking-[0.16em] text-ivory transition hover:bg-mocha"
                  >
                    Сохранить
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Заказов пока нет"
          description="После оформления заказа клиентом он появится здесь."
        />
      )}
    </div>
  );
}
