import { randomUUID } from "crypto";
import type {
  PaymentCreateInput,
  PaymentCreateResult,
  PaymentProvider,
  PaymentStatusCode
} from "@/lib/payments/provider";

type YooKassaPaymentStatus =
  | "pending"
  | "waiting_for_capture"
  | "succeeded"
  | "canceled";

type YooKassaPaymentResponse = {
  id?: string;
  status?: YooKassaPaymentStatus;
  confirmation?: {
    confirmation_url?: string;
  };
  description?: string;
  type?: string;
};

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`MISSING_ENV:${name}`);
  }

  return value;
}

export function mapYooKassaStatus(status?: YooKassaPaymentStatus): PaymentStatusCode {
  if (status === "succeeded") {
    return "paid";
  }

  if (status === "canceled") {
    return "failed";
  }

  return "pending";
}

function formatAmount(value: number) {
  return value.toFixed(2);
}

export class YooKassaPaymentProvider implements PaymentProvider {
  provider = "yookassa";

  async createPayment(input: PaymentCreateInput): Promise<PaymentCreateResult> {
    const shopId = requireEnv("YOOKASSA_SHOP_ID");
    const secretKey = requireEnv("YOOKASSA_SECRET_KEY");
    const returnUrl = requireEnv("YOOKASSA_RETURN_URL");
    const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
    const confirmationReturnUrl = `${returnUrl}?orderId=${encodeURIComponent(
      input.orderId
    )}`;

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        "Idempotence-Key": randomUUID()
      },
      body: JSON.stringify({
        amount: {
          value: formatAmount(input.amount),
          currency: "RUB"
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: confirmationReturnUrl
        },
        description: input.description,
        metadata: {
          orderId: input.orderId,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone
        }
      })
    });

    const data = (await response.json()) as YooKassaPaymentResponse;

    if (!response.ok) {
      const message =
        data.description ??
        "ЮKassa вернула ошибку при создании платежа. Проверьте настройки магазина.";
      throw new Error(`YOOKASSA_ERROR:${message}`);
    }

    const paymentId = data.id;
    const confirmationUrl = data.confirmation?.confirmation_url;

    if (!paymentId) {
      throw new Error("YOOKASSA_NO_PAYMENT_ID");
    }

    if (!confirmationUrl) {
      throw new Error("YOOKASSA_NO_CONFIRMATION_URL");
    }

    return {
      provider: this.provider,
      paymentId,
      confirmationUrl,
      status: mapYooKassaStatus(data.status),
      message: "Платёж создан. Перенаправляем на страницу оплаты ЮKassa."
    };
  }
}
