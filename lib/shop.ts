import "server-only";
import type {
  Category,
  Collection,
  Product,
  ProductImage,
  ProductVariant
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ProductWithDetails = Product & {
  category: Category;
  collection: Collection | null;
  images: ProductImage[];
  variants: ProductVariant[];
};

const productInclude = {
  category: true,
  collection: true,
  images: {
    orderBy: {
      position: "asc" as const
    }
  },
  variants: {
    orderBy: {
      size: "asc" as const
    }
  }
};

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });
}

export async function getActiveProducts(take?: number) {
  return prisma.product.findMany({
    where: {
      isActive: true
    },
    include: productInclude,
    orderBy: {
      createdAt: "desc"
    },
    take
  });
}

export async function getProductsByCategory(categorySlug: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        slug: categorySlug
      }
    },
    include: productInclude,
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: {
      slug
    }
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      isActive: true
    },
    include: productInclude
  });
}
