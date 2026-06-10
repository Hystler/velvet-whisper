import { NextResponse } from "next/server";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type YooKassaWebhookPayload = {
  event?: string;
  object?: {
    id?: string;
    status?: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
    metadata?: {
      orderId?: string;
    };
  };
};

function logWebhook(message: string, details?: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.info(`[ЮKassa webhook] ${message}`, details ?? "");
  }
}

function isWebhookAuthorized(request: Request) {
  const secret = process.env.YOOKASSA_WEBHOOK_SECRET;

  if (!secret) {
    return true;
  }

  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  const headerSecret = request.headers.get("x-yookassa-webhook-secret");
  const authorization = request.headers.get("authorization");
  const bearerSecret = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  return [querySecret, headerSecret, bearerSecret].some((value) => value === secret);
}

function resolveStatuses(payload: YooKassaWebhookPayload): {
  paymentStatus: PaymentStatus;
  orderStatus?: OrderStatus;
} {
  if (payload.event === "payment.succeeded" || payload.object?.status === "succeeded") {
    return {
      paymentStatus: "PAID",
      orderStatus: "PROCESSING"
    };
  }

  if (payload.event === "payment.canceled" || payload.object?.status === "canceled") {
    return {
      paymentStatus: "FAILED"
    };
  }

  return {
    paymentStatus: "PENDING"
  };
}

export async function POST(request: Request) {
  if (!isWebhookAuthorized(request)) {
    logWebhook("Webhook отклонён: неверный секрет.");
    return NextResponse.json({ ok: false, message: "Webhook не авторизован." }, { status: 401 });
  }

  let payload: YooKassaWebhookPayload;

  try {
    payload = (await request.json()) as YooKassaWebhookPayload;
  } catch {
    logWebhook("Не удалось прочитать JSON.");
    return NextResponse.json({ ok: true });
  }

  const orderId = payload.object?.metadata?.orderId;
  const paymentId = payload.object?.id;

  if (!orderId || !paymentId) {
    logWebhook("Webhook без orderId или paymentId.", payload);
    return NextResponse.json({ ok: true });
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId
    }
  });

  if (!order) {
    logWebhook("Заказ из webhook не найден.", { orderId, paymentId });
    return NextResponse.json({ ok: true });
  }

  if (order.paymentId && order.paymentId !== paymentId) {
    logWebhook("Webhook относится к неактуальному платежу.", {
      orderId,
      webhookPaymentId: paymentId,
      currentPaymentId: order.paymentId
    });
    return NextResponse.json({ ok: true });
  }

  const statuses = resolveStatuses(payload);

  await prisma.order.update({
    where: {
      id: order.id
    },
    data: {
      paymentProvider: order.paymentProvider ?? "yookassa",
      paymentId,
      paymentStatus: statuses.paymentStatus,
      orderStatus: statuses.orderStatus ?? order.orderStatus
    }
  });

  return NextResponse.json({ ok: true });
}
