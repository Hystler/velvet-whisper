export type PaymentStatusCode = "pending" | "paid" | "failed" | "refunded";

export type PaymentCreateInput = {
  amount: number;
  currency: "RUB";
  orderId: string;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
};

export type PaymentCreateResult = {
  provider: string;
  paymentId: string;
  status: PaymentStatusCode;
  confirmationUrl?: string | null;
  message: string;
};

export interface PaymentProvider {
  provider: string;
  createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult>;
}

class PlaceholderPaymentProvider implements PaymentProvider {
  provider = "placeholder";

  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    if (input.amount <= 0) {
      return {
        provider: this.provider,
        paymentId: "",
        status: "failed",
        confirmationUrl: null,
        message: "Сумма заказа должна быть больше нуля."
      };
    }

    if (process.env.PAYMENT_PLACEHOLDER_FORCE_ERROR === "true") {
      return {
        provider: this.provider,
        paymentId: `demo_failed_${Date.now()}`,
        status: "failed",
        confirmationUrl: null,
        message: "Демо-платёж завершился ошибкой. Попробуйте ещё раз."
      };
    }

    return {
      provider: this.provider,
      paymentId: `demo_pending_${Date.now()}`,
      status: "pending",
      confirmationUrl: `/success?orderId=${encodeURIComponent(input.orderId)}`,
      message:
        "Платёж создан в демо-режиме. Реальное списание средств не выполняется."
    };
  }
}

export async function getPaymentProvider(): Promise<PaymentProvider> {
  const providerName = process.env.PAYMENT_PROVIDER ?? "placeholder";

  if (providerName === "yookassa") {
    const { YooKassaPaymentProvider } = await import("@/lib/payments/yookassa");
    return new YooKassaPaymentProvider();
  }

  if (providerName === "placeholder") {
    return new PlaceholderPaymentProvider();
  }

  throw new Error("UNSUPPORTED_PAYMENT_PROVIDER");
}
