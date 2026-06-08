import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreatedSeedProduct = Prisma.ProductGetPayload<{
  include: {
    variants: true;
  };
}>;

const categories = [
  { name: "Жакеты", slug: "jackets" },
  { name: "Рубашки", slug: "shirts" },
  { name: "Брюки", slug: "trousers" },
  { name: "Платья", slug: "dresses" },
  { name: "Пальто", slug: "coats" },
  { name: "Трикотаж", slug: "knitwear" }
];

const products = [
  {
    name: "Жакет Tailored Softness",
    slug: "tailored-softness-jacket",
    categorySlug: "jackets",
    price: 42900,
    oldPrice: null,
    material: "шерсть 72%, вискоза 24%, эластан 4%",
    color: "тёплый taupe",
    care: "Деликатная химчистка. Хранить на широких плечиках.",
    fit: "Полуприлегающий силуэт, мягкое плечо, длина ниже линии бедра.",
    description:
      "Жакет с мягкой архитектурой плеча и спокойной линией талии. Создан для образов, в которых строгость звучит деликатно.",
    imageUrls: [
      "/images/editorial/tailored-softness.svg",
      "/images/editorial/fabric-detail.svg"
    ],
    stock: { XS: 3, S: 7, M: 5, L: 2 }
  },
  {
    name: "Рубашка Fluid Shirt",
    slug: "fluid-shirt",
    categorySlug: "shirts",
    price: 18900,
    oldPrice: null,
    material: "тенсел 64%, вискоза 36%",
    color: "ivory",
    care: "Ручная стирка при 30°C или деликатная химчистка.",
    fit: "Свободная посадка, удлинённая спинка, мягкий воротник.",
    description:
      "Струящаяся рубашка из тонкой ткани с прохладным касанием. Легко собирает дневной и вечерний образ.",
    imageUrls: [
      "/images/editorial/fluid-shirt.svg",
      "/images/editorial/fabric-detail.svg"
    ],
    stock: { XS: 4, S: 8, M: 6, L: 1 }
  },
  {
    name: "Брюки Pleated Ease",
    slug: "pleated-ease-trousers",
    categorySlug: "trousers",
    price: 24900,
    oldPrice: null,
    material: "шерсть 54%, вискоза 42%, эластан 4%",
    color: "sand",
    care: "Деликатная химчистка. Отпаривать с изнаночной стороны.",
    fit: "Высокая посадка, защипы у пояса, свободная прямая линия.",
    description:
      "Брюки с мягкими складками и точной длиной. Дают ощущение движения, не теряя собранности силуэта.",
    imageUrls: [
      "/images/editorial/pleated-ease.svg",
      "/images/editorial/fabric-detail.svg"
    ],
    stock: { XS: 2, S: 6, M: 7, L: 3 }
  },
  {
    name: "Платье Satin Whisper",
    slug: "satin-whisper-dress",
    categorySlug: "dresses",
    price: 35900,
    oldPrice: 39900,
    material: "сатин 82%, ацетат 18%",
    color: "mocha",
    care: "Деликатная химчистка. Не сушить в барабане.",
    fit: "Скользящий силуэт, мягкая линия декольте, длина миди.",
    description:
      "Сатиновое платье с приглушённым блеском. Его выразительность раскрывается в движении и мягком свете.",
    imageUrls: [
      "/images/editorial/satin-whisper.svg",
      "/images/editorial/fabric-detail.svg"
    ],
    stock: { XS: 2, S: 4, M: 3, L: 0 }
  },
  {
    name: "Пальто Wool Calm",
    slug: "wool-calm-coat",
    categorySlug: "coats",
    price: 64900,
    oldPrice: null,
    material: "шерсть 88%, кашемир 12%",
    color: "camel",
    care: "Только профессиональная химчистка.",
    fit: "Прямой силуэт, пояс в комплекте, длина ниже колена.",
    description:
      "Пальто с чистой линией борта и плотной мягкой фактурой. Главная вещь прохладного сезона.",
    imageUrls: [
      "/images/editorial/wool-calm.svg",
      "/images/editorial/fabric-detail.svg"
    ],
    stock: { XS: 1, S: 4, M: 4, L: 1 }
  },
  {
    name: "Свитер Soft Knit",
    slug: "soft-knit-sweater",
    categorySlug: "knitwear",
    price: 21900,
    oldPrice: null,
    material: "меринос 70%, кашемир 30%",
    color: "oatmeal",
    care: "Ручная стирка в прохладной воде. Сушить горизонтально.",
    fit: "Свободная посадка, спущенное плечо, мягкая резинка по низу.",
    description:
      "Тёплый трикотаж без лишней тяжести. Сохраняет форму и даёт ощущение камерной роскоши каждый день.",
    imageUrls: [
      "/images/editorial/soft-knit.svg",
      "/images/editorial/fabric-detail.svg"
    ],
    stock: { XS: 5, S: 9, M: 4, L: 2 }
  },
  {
    name: "Блуза Ivory Cotton",
    slug: "ivory-cotton-blouse",
    categorySlug: "shirts",
    price: 16900,
    oldPrice: null,
    material: "хлопок 96%, эластан 4%",
    color: "ivory",
    care: "Машинная стирка при 30°C в мешке для деликатных вещей.",
    fit: "Аккуратный прямой силуэт, мягкая линия рукава.",
    description:
      "Блуза из плотного хлопка с чистой поверхностью и деликатной пластикой. Основа для спокойного гардероба.",
    imageUrls: [
      "/images/editorial/ivory-cotton.svg",
      "/images/editorial/fabric-detail.svg"
    ],
    stock: { XS: 3, S: 5, M: 0, L: 2 }
  },
  {
    name: "Вечернее платье Evening Slip",
    slug: "evening-slip-dress",
    categorySlug: "dresses",
    price: 48900,
    oldPrice: null,
    material: "шелк 92%, эластан 8%",
    color: "deep brown",
    care: "Только химчистка. Хранить отдельно от украшений.",
    fit: "Пластичный силуэт по фигуре, тонкие бретели, длина макси.",
    description:
      "Вечернее платье с почти невесомой линией. Минимальная форма делает ткань главным акцентом.",
    imageUrls: [
      "/images/editorial/evening-slip.svg",
      "/images/editorial/fabric-detail.svg"
    ],
    stock: { XS: 0, S: 0, M: 0, L: 0 }
  }
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.user.deleteMany();

  const collection = await prisma.collection.create({
    data: {
      name: "Первая коллекция",
      slug: "first-collection",
      description:
        "Капсула мягкой премиальной одежды для повседневной элегантности."
    }
  });

  const categoryRecords = await Promise.all(
    categories.map((category) => prisma.category.create({ data: category }))
  );

  const categoryBySlug = new Map(
    categoryRecords.map((category) => [category.slug, category])
  );

  const createdProducts: CreatedSeedProduct[] = [];

  for (const product of products) {
    const category = categoryBySlug.get(product.categorySlug);

    if (!category) {
      throw new Error(`Категория ${product.categorySlug} не найдена`);
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        material: product.material,
        color: product.color,
        care: product.care,
        fit: product.fit,
        categoryId: category.id,
        collectionId: collection.id,
        images: {
          create: product.imageUrls.map((url, position) => ({
            url,
            alt: `${product.name}, образ ${position + 1}`,
            position
          }))
        },
        variants: {
          create: Object.entries(product.stock).map(([size, stock]) => ({
            size,
            stock,
            color: product.color,
            sku: `VW-${product.slug.toUpperCase().replaceAll("-", "_")}-${size}`
          }))
        }
      },
      include: {
        variants: true
      }
    });

    createdProducts.push(createdProduct);
  }

  await prisma.user.create({
    data: {
      email: "admin@velvetwhisper.demo",
      role: "ADMIN"
    }
  });

  const firstVariant = createdProducts[0].variants.find(
    (variant) => variant.size === "S"
  );
  const secondVariant = createdProducts[3].variants.find(
    (variant) => variant.size === "M"
  );

  if (firstVariant && secondVariant) {
    await prisma.order.create({
      data: {
        customerName: "Анна Соколова",
        email: "anna@example.com",
        phone: "+7 900 000-00-01",
        city: "Москва",
        address: "Патриаршие пруды, 12",
        comment: "Доставка после 18:00",
        total: createdProducts[0].price + createdProducts[3].price,
        paymentStatus: "PAID",
        orderStatus: "PROCESSING",
        items: {
          create: [
            {
              productId: createdProducts[0].id,
              variantId: firstVariant.id,
              quantity: 1,
              price: createdProducts[0].price
            },
            {
              productId: createdProducts[3].id,
              variantId: secondVariant.id,
              quantity: 1,
              price: createdProducts[3].price
            }
          ]
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
