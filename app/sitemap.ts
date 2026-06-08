import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/catalog",
    "/cart",
    "/checkout",
    "/about",
    "/delivery",
    "/success",
    "/admin",
    "/admin/products",
    "/admin/orders"
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));

  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        select: {
          slug: true
        }
      }),
      prisma.product.findMany({
        where: {
          isActive: true
        },
        select: {
          slug: true,
          createdAt: true
        }
      })
    ]);

    return [
      ...staticRoutes,
      ...categories.map((category) => ({
        url: `${siteUrl}/catalog/${category.slug}`,
        lastModified: new Date()
      })),
      ...products.map((product) => ({
        url: `${siteUrl}/product/${product.slug}`,
        lastModified: product.createdAt
      }))
    ];
  } catch {
    return staticRoutes;
  }
}
