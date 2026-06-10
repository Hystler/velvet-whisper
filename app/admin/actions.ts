"use server";

import { OrderStatus, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isAdminDemoEnabled } from "@/lib/admin-demo";
import { prisma } from "@/lib/prisma";

export async function toggleProductStatus(formData: FormData) {
  if (!isAdminDemoEnabled() || !(await isAdminAuthenticated())) {
    return;
  }

  const productId = formData.get("productId")?.toString();
  const currentStatus = formData.get("currentStatus")?.toString() === "true";

  if (!productId) {
    return;
  }

  await prisma.product.update({
    where: {
      id: productId
    },
    data: {
      isActive: !currentStatus
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
}

export async function updateOrderStatuses(formData: FormData) {
  if (!isAdminDemoEnabled() || !(await isAdminAuthenticated())) {
    return;
  }

  const orderId = formData.get("orderId")?.toString();
  const paymentStatus = formData.get("paymentStatus")?.toString() as
    | PaymentStatus
    | undefined;
  const orderStatus = formData.get("orderStatus")?.toString() as
    | OrderStatus
    | undefined;

  if (!orderId) {
    return;
  }

  if (
    !paymentStatus ||
    !orderStatus ||
    !Object.values(PaymentStatus).includes(paymentStatus) ||
    !Object.values(OrderStatus).includes(orderStatus)
  ) {
    return;
  }

  await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      paymentStatus,
      orderStatus
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}
