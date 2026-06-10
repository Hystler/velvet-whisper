import { NextResponse } from "next/server";
import type { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider, type PaymentStatusCode } from "@/lib/payments/provider";

export const runtime = "nodejs";

function toPaymentStatus(status: PaymentStatusCode): PaymentStatus {
  if (status === "paid") {
    return "PAID";
  }

  if (status === "failed") {
    return "FAILED";
  }

  if (status === "refunded") {
    return "REFUNDED";
  }

  return "PENDING";
}

function getPaymentErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message.startsWith("MISSING_ENV:")) {
    const envName = message.split(":")[1];
    return `Не настроена переменная окружения ${envName}. Проверьте настройки оплаты.`;
  }

  if (message === "UNSUPPORTED_PAYMENT_PROVIDER") {
    return "Выбран неподдерживаемый платёжный провайдер.";
  }

  if (message.startsWith("YOOKASSA_ERROR:")) {
    return message.replace("YOOKASSA_ERROR:", "");
  }

  if (message === "YOOKASSA_NO_PAYMENT_ID") {
    return "ЮKassa не вернула идентификатор платежа.";
  }

  if (message === "YOOKASSA_NO_CONFIRMATION_URL") {
    return "ЮKassa не вернула ссылку на оплату.";
  }

  return "Ошибка создания платежа. Попробуйте ещё раз.";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderId?: string;
    };

    if (!body.orderId) {
      return NextResponse.json(
        { message: "Не передан номер заказа для оплаты." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: body.orderId
      }
    });

    if (!order) {
      return NextResponse.json(
        { message: "Заказ не найден." },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { message: "Этот заказ уже оплачен." },
        { status: 409 }
      );
    }

    const provider = await getPaymentProvider();

    if (
      order.paymentStatus === "PENDING" &&
      order.paymentProvider === provider.provider &&
      order.paymentUrl
    ) {
      return NextResponse.json({
        redirectUrl: order.paymentUrl,
        paymentId: order.paymentId,
        message: "Платёж уже создан. Перенаправляем на страницу оплаты."
      });
    }

    const payment = await provider.createPayment({
      amount: order.total,
      currency: "RUB",
      orderId: order.id,
      description: `Заказ Velvet Whisper №${order.id}`,
      customerEmail: order.email,
      customerPhone: order.phone
    });

    if (!payment.confirmationUrl) {
      return NextResponse.json(
        {
          message:
            payment.message ??
            "Платёж создан без ссылки на оплату. Попробуйте ещё раз."
        },
        { status: 502 }
      );
    }

    await prisma.order.update({
      where: {
        id: order.id
      },
      data: {
        paymentProvider: payment.provider,
        paymentId: payment.paymentId,
        paymentUrl: payment.confirmationUrl,
        paymentStatus: toPaymentStatus(payment.status)
      }
    });

    return NextResponse.json({
      redirectUrl: payment.confirmationUrl,
      paymentId: payment.paymentId,
      message: payment.message
    });
  } catch (error) {
    return NextResponse.json(
      { message: getPaymentErrorMessage(error) },
      { status: 500 }
    );
  }
}
