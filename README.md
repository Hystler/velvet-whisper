# Velvet Whisper

Premium fashion e-commerce MVP for the women’s clothing brand `Velvet Whisper`.

Интерфейс, демо-контент, checkout и админка сделаны на русском языке. Проект подготовлен для деплоя через GitHub, Vercel и Supabase-compatible PostgreSQL.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL / Supabase-compatible
- Vercel-ready

## Environment Variables

Для локальной разработки создайте `.env` из `.env.example`:

```bash
cp .env.example .env
```

`.env` добавлен в `.gitignore`. Не коммитьте реальные Supabase credentials.

Переменные:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/velvet_whisper?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/velvet_whisper?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
PAYMENT_PLACEHOLDER_FORCE_ERROR="false"
ADMIN_DEMO_ENABLED="true"
```

Для Vercel добавьте Environment Variables в Project Settings:

- `DATABASE_URL` — Supabase Transaction Pooler connection string.
- `DIRECT_URL` — Supabase Direct Connection string.
- `NEXT_PUBLIC_SITE_URL` — production URL сайта, например `https://velvet-whisper.vercel.app`.
- `PAYMENT_PLACEHOLDER_FORCE_ERROR` — `false`.
- `ADMIN_DEMO_ENABLED` — `true`, если нужна демонстрационная админка.

Админка в MVP демонстрационная. Для production нужно добавить auth и роли доступа.

## Local Run

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Откройте `http://localhost:3000`.

Полезные команды:

```bash
npm run lint
npm run typecheck
npm run prisma:validate
npm run prisma:deploy
npm run prisma:studio
npm run build
```

## Supabase Setup

1. Создайте Supabase project.
2. Откройте `Project Settings` → `Database`.
3. Для `DATABASE_URL` возьмите Transaction Pooler connection string.
4. Для `DIRECT_URL` возьмите Direct Connection string.
5. Убедитесь, что пароль в connection string URL-safe. Самый спокойный вариант для MVP — пароль только из латиницы и цифр.
6. Локально положите эти значения в `.env`, если хотите работать с Supabase из dev-окружения.
7. На Vercel добавьте эти же значения в Environment Variables.

Seed запускается вручную. Vercel build не запускает seed автоматически.

## GitHub → Vercel → Supabase Deploy

1. Залейте проект на GitHub. Убедитесь, что `.env` не попал в репозиторий.
2. Импортируйте GitHub repo в Vercel.
3. В Vercel добавьте env:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `PAYMENT_PLACEHOLDER_FORCE_ERROR`
   - `ADMIN_DEMO_ENABLED`
4. Запустите deploy.
5. После первого деплоя обновите `NEXT_PUBLIC_SITE_URL` на production URL и redeploy.
6. Примените миграции к Supabase из локального окружения:

```bash
npm run prisma:deploy
npm run prisma:seed
```

7. Проверьте страницы:
   - `/`
   - `/catalog`
   - `/admin`
   - `/admin/products`
   - `/admin/orders`
   - карточку товара
   - `/cart`
   - `/checkout`

## Vercel Build Notes

- `postinstall` запускает `prisma generate`, чтобы Prisma Client был готов после `npm install`.
- `npm run build` не запускает seed.
- Страницы с Prisma-данными помечены `dynamic = "force-dynamic"`, чтобы Next.js не пытался статически собрать каталог, карточки товаров и админку без runtime-доступа к базе.
- `sitemap.xml` тоже dynamic и использует fallback на статические маршруты, если база временно недоступна.

## Payment

Реальная платёжная система не подключена. MVP использует `PaymentProvider` placeholder в `lib/payments/provider.ts`.

Позже можно подключить Stripe, ЮKassa или CloudPayments:

1. Реализовать новый provider с тем же интерфейсом.
2. Вернуть `paymentId` и `redirectUrl`.
3. Добавить webhook route.
4. Синхронизировать `paymentStatus` у заказа.

## Troubleshooting

### Prisma P1013: invalid domain character in database URL

Частые причины:

- в пароле есть спецсимволы, которые не закодированы для URL;
- в URL остался шаблонный placeholder;
- старая `DATABASE_URL` задана в терминале;
- `.env` не сохранён;
- Vercel Environment Variables не добавлены или добавлены не в тот environment.

Что проверить:

```bash
echo $DATABASE_URL
echo $DIRECT_URL
unset DATABASE_URL
unset DIRECT_URL
```

После этого убедитесь, что `.env` содержит актуальные значения, или задайте env напрямую в Vercel.

Для Supabase MVP проще всего использовать пароль только из латиницы и цифр. Не коммитьте `.env`.

### Seed/dev берёт не тот URL

Если в shell задана старая переменная окружения, она может иметь приоритет над `.env`.

```bash
unset DATABASE_URL
unset DIRECT_URL
npm run prisma:validate
npm run prisma:seed
```

### Админка отключена

Добавьте:

```bash
ADMIN_DEMO_ENABLED="true"
```

Для production это не защита. Это только флаг показа демонстрационной админки.
