export type PaymentCreateInput = {
  amount: number;
  currency: "RUB";
  description: string;
  customerEmail?: string;
};

export type PaymentCreateResult = {
  paymentId: string;
  status: "pending" | "paid" | "failed" | "refunded";
  redirectUrl?: string | null;
  message: string;
};

export interface PaymentProvider {
  createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult>;
}

class PlaceholderPaymentProvider implements PaymentProvider {
  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    if (input.amount <= 0) {
      return {
        paymentId: "",
        status: "failed",
        redirectUrl: null,
        message: "Сумма заказа должна быть больше нуля."
      };
    }

    if (process.env.PAYMENT_PLACEHOLDER_FORCE_ERROR === "true") {
      return {
        paymentId: `demo_failed_${Date.now()}`,
        status: "failed",
        redirectUrl: null,
        message: "Демо-платёж завершился ошибкой. Попробуйте ещё раз."
      };
    }

    return {
      paymentId: `demo_pending_${Date.now()}`,
      status: "pending",
      redirectUrl: null,
      message:
        "Платёж создан в демо-режиме. Здесь позже появится переход в платёжный виджет."
    };
  }
}

// Позже здесь можно подключить Stripe, ЮKassa или CloudPayments:
// 1. реализовать класс с тем же интерфейсом PaymentProvider;
// 2. создать платёж у провайдера и вернуть redirectUrl/paymentId;
// 3. добавить webhook route для синхронизации paymentStatus в заказах.
export const paymentProvider: PaymentProvider = new PlaceholderPaymentProvider();
