import { NextResponse } from "next/server";
import { paymentProvider } from "@/lib/payments/provider";

const statusLabels = {
  pending: "Ожидает оплаты",
  paid: "Оплачен",
  failed: "Ошибка оплаты",
  refunded: "Возврат"
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      amount?: number;
      currency?: "RUB";
      description?: string;
      customerEmail?: string;
    };

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { message: "Сумма заказа должна быть больше нуля." },
        { status: 400 }
      );
    }

    const payment = await paymentProvider.createPayment({
      amount: body.amount,
      currency: "RUB",
      description: body.description ?? "Заказ Velvet Whisper",
      customerEmail: body.customerEmail
    });

    if (payment.status === "failed") {
      return NextResponse.json(
        {
          paymentId: payment.paymentId,
          message: payment.message,
          statusLabel: statusLabels[payment.status]
        },
        { status: 402 }
      );
    }

    return NextResponse.json({
      paymentId: payment.paymentId,
      redirectUrl: payment.redirectUrl,
      message: payment.message,
      statusLabel: statusLabels[payment.status]
    });
  } catch {
    return NextResponse.json(
      { message: "Ошибка оплаты. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
