import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CheckoutItemPayload } from "@/lib/cart-types";

type OrderRequestBody = {
  customerName?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  comment?: string;
  items?: CheckoutItemPayload[];
};

function validateOrderBody(body: OrderRequestBody) {
  if (!body.items || body.items.length === 0) {
    return "Корзина пуста.";
  }

  if (!body.customerName?.trim()) {
    return "Введите имя получателя.";
  }

  if (!body.email?.trim() || !body.email.includes("@")) {
    return "Введите корректный email.";
  }

  if (!body.phone?.trim()) {
    return "Введите телефон для связи.";
  }

  if (!body.city?.trim()) {
    return "Введите город доставки.";
  }

  if (!body.address?.trim()) {
    return "Введите адрес доставки.";
  }

  const hasInvalidQuantity = body.items.some((item) => item.quantity < 1);

  if (hasInvalidQuantity) {
    return "Количество товара должно быть больше нуля.";
  }

  return "";
}

export async function POST(request: Request) {
  let body: OrderRequestBody;

  try {
    body = (await request.json()) as OrderRequestBody;
  } catch {
    return NextResponse.json(
      { message: "Не удалось прочитать данные заказа." },
      { status: 400 }
    );
  }

  const validationError = validateOrderBody(body);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  const items = body.items ?? [];
  const variantIds = items.map((item) => item.variantId);

  try {
    const variants = await prisma.productVariant.findMany({
      where: {
        id: {
          in: variantIds
        }
      },
      include: {
        product: true
      }
    });

    const variantById = new Map(
      variants.map((variant) => [variant.id, variant])
    );

    const lines = items.map((item) => {
      const variant = variantById.get(item.variantId);

      if (!variant || !variant.product.isActive) {
        throw new Error("UNAVAILABLE");
      }

      if (variant.stock < item.quantity) {
        throw new Error(`STOCK:${variant.product.name}:${variant.size}`);
      }

      return {
        productId: variant.productId,
        variantId: variant.id,
        productName: variant.product.name,
        size: variant.size,
        quantity: item.quantity,
        price: variant.product.price
      };
    });

    const total = lines.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      for (const line of lines) {
        const updatedVariant = await tx.productVariant.updateMany({
          where: {
            id: line.variantId,
            stock: {
              gte: line.quantity
            }
          },
          data: {
            stock: {
              decrement: line.quantity
            }
          }
        });

        if (updatedVariant.count !== 1) {
          throw new Error(`STOCK:${line.productName}:${line.size}`);
        }
      }

      return tx.order.create({
        data: {
          customerName: body.customerName?.trim() ?? "",
          email: body.email?.trim() ?? "",
          phone: body.phone?.trim() ?? "",
          city: body.city?.trim() ?? "",
          address: body.address?.trim() ?? "",
          comment: body.comment?.trim() || null,
          total,
          paymentStatus: "PENDING",
          orderStatus: "NEW",
          items: {
            create: lines.map((line) => ({
              productId: line.productId,
              variantId: line.variantId,
              quantity: line.quantity,
              price: line.price
            }))
          }
        }
      });
    });

    return NextResponse.json(
      {
        orderId: order.id,
        total,
        message: "Заказ создан."
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "UNAVAILABLE") {
      return NextResponse.json(
        { message: "Один из товаров недоступен для заказа." },
        { status: 409 }
      );
    }

    if (message.startsWith("STOCK:")) {
      const [, productName, size] = message.split(":");

      return NextResponse.json(
        {
          message: `Товар закончился: ${productName}, размер ${size}. Обновите корзину.`
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Ошибка создания заказа. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
