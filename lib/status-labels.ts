import type { OrderStatus, PaymentStatus } from "@prisma/client";

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Ожидает оплаты",
  PAID: "Оплачен",
  FAILED: "Ошибка оплаты",
  REFUNDED: "Возврат"
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  NEW: "Новый",
  PROCESSING: "В обработке",
  SHIPPED: "Передан в доставку",
  COMPLETED: "Завершён",
  CANCELLED: "Отменён"
};
