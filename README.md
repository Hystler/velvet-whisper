# Velvet Whisper

Premium fashion e-commerce MVP для женского бренда одежды `Velvet Whisper`.

Интерфейс, демо-контент, checkout, статусы, ошибки и админка сделаны на русском языке. Проект подготовлен для деплоя через GitHub, Vercel и Supabase-compatible PostgreSQL.

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

`.env` добавлен в `.gitignore`. Не коммитьте реальные Supabase credentials, ключи ЮKassa или любые production-секреты.

Безопасный локальный пример:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/velvet_whisper?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/velvet_whisper?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

PAYMENT_PROVIDER="placeholder"
PAYMENT_PLACEHOLDER_FORCE_ERROR="false"

ADMIN_DEMO_ENABLED="true"
ADMIN_PASSWORD="change-me"

YOOKASSA_SHOP_ID=""
YOOKASSA_SECRET_KEY=""
YOOKASSA_RETURN_URL="http://localhost:3000/success"
YOOKASSA_WEBHOOK_SECRET=""
```

Для Vercel добавьте Environment Variables в Project Settings:

- `DATABASE_URL` - Supabase Transaction Pooler connection string.
- `DIRECT_URL` - Supabase Direct Connection string.
- `NEXT_PUBLIC_SITE_URL` - production URL сайта, например `https://velvet-whisper-alpha.vercel.app`.
- `PAYMENT_PROVIDER` - `yookassa` для реальной оплаты или `placeholder` для demo-режима.
- `PAYMENT_PLACEHOLDER_FORCE_ERROR` - `false`.
- `ADMIN_DEMO_ENABLED` - `true`, если нужна демонстрационная админка.
- `ADMIN_PASSWORD` - пароль для входа в демо-админку.
- `YOOKASSA_SHOP_ID` - Shop ID из кабинета ЮKassa.
- `YOOKASSA_SECRET_KEY` - Secret Key из кабинета ЮKassa.
- `YOOKASSA_RETURN_URL` - URL возврата, например `https://velvet-whisper-alpha.vercel.app/success`.
- `YOOKASSA_WEBHOOK_SECRET` - опциональный shared secret для MVP-проверки webhook URL.

Админка в MVP демонстрационная и закрыта простым паролем из env. Для production нужно добавить полноценную auth-систему, роли доступа и аудит действий.

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
2. Откройте `Project Settings` -> `Database`.
3. Для `DATABASE_URL` возьмите Transaction Pooler connection string.
4. Для `DIRECT_URL` возьмите Direct Connection string.
5. Убедитесь, что пароль в connection string URL-safe. Самый спокойный вариант для MVP - пароль только из латиницы и цифр.
6. Локально положите эти значения в `.env`, если хотите работать с Supabase из dev-окружения.
7. На Vercel добавьте эти же значения в Environment Variables.

Seed запускается вручную. Vercel build не запускает seed автоматически.

## GitHub -> Vercel -> Supabase Deploy

1. Залейте проект на GitHub. Убедитесь, что `.env` не попал в репозиторий.
2. Импортируйте GitHub repo в Vercel.
3. В Vercel добавьте env:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `PAYMENT_PROVIDER`
   - `PAYMENT_PLACEHOLDER_FORCE_ERROR`
   - `ADMIN_DEMO_ENABLED`
   - `ADMIN_PASSWORD`
   - `YOOKASSA_SHOP_ID`
   - `YOOKASSA_SECRET_KEY`
   - `YOOKASSA_RETURN_URL`
   - `YOOKASSA_WEBHOOK_SECRET`
4. Запустите deploy.
5. После первого деплоя обновите `NEXT_PUBLIC_SITE_URL` и `YOOKASSA_RETURN_URL` на production URL, затем сделайте redeploy.
6. Примените миграции к Supabase из локального окружения, где `.env` указывает на Supabase:

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

## Доступ к админке

Админка закрыта MVP-паролем через `ADMIN_PASSWORD`.

Локально:

```bash
ADMIN_DEMO_ENABLED="true"
ADMIN_PASSWORD="change-me"
```

В Vercel добавьте:

- `ADMIN_DEMO_ENABLED=true`
- `ADMIN_PASSWORD` - длинный уникальный пароль, не используйте `change-me` на production URL.

Если `ADMIN_DEMO_ENABLED !== "true"`, админка покажет экран `Демо-админка отключена`.

Если `ADMIN_PASSWORD` не задан, админка покажет `ADMIN_PASSWORD не настроен`.

После успешного входа сервер ставит httpOnly cookie на 24 часа. Кнопка `Выйти` очищает cookie и закрывает доступ к `/admin`, `/admin/products`, `/admin/orders` и вложенным `/admin/*`.

Это MVP-защита для портфолио и demo-деплоя. Для production нужна полноценная auth-система, например Supabase Auth или отдельный backend auth с ролями, rate limiting, журналом действий и восстановлением доступа.

## Оплата через ЮKassa

Checkout использует общую payment abstraction. Сейчас доступны два режима:

- `PAYMENT_PROVIDER=placeholder` - demo-redirect на `/success`.
- `PAYMENT_PROVIDER=yookassa` - реальная оплата через redirect payment page ЮKassa.

Flow оплаты:

1. Пользователь оформляет заказ на `/checkout`.
2. Backend создаёт `Order` со статусами `paymentStatus = PENDING` и `orderStatus = NEW`.
3. Backend создаёт платёж в ЮKassa.
4. ЮKassa возвращает `confirmation_url`.
5. Frontend редиректит пользователя на страницу оплаты ЮKassa.
6. После оплаты пользователь возвращается на `/success?orderId=...`.
7. Webhook ЮKassa обновляет заказ в базе.

Важно: `/success` не считает оплату успешной только по return URL. Источник правды - webhook.

### Настройка ЮKassa

1. Зарегистрируйтесь или войдите в ЮKassa.
2. Получите `Shop ID` и `Secret Key`.
3. Добавьте env локально и в Vercel:

```bash
PAYMENT_PROVIDER="yookassa"
YOOKASSA_SHOP_ID="ваш shop id"
YOOKASSA_SECRET_KEY="ваш secret key"
YOOKASSA_RETURN_URL="https://velvet-whisper-alpha.vercel.app/success"
YOOKASSA_WEBHOOK_SECRET="случайная строка для MVP-проверки webhook"
```

4. В ЮKassa настройте webhook URL:

```text
https://velvet-whisper-alpha.vercel.app/api/webhooks/yookassa
```

Если задан `YOOKASSA_WEBHOOK_SECRET`, используйте URL с query-secret:

```text
https://velvet-whisper-alpha.vercel.app/api/webhooks/yookassa?secret=то-же-значение-что-в-env
```

5. Включите события:
   - `payment.succeeded`
   - `payment.canceled`
6. После добавления env сделайте Vercel Redeploy.

### Тестирование оплаты

1. Включите тестовый магазин или тестовый режим в ЮKassa.
2. Укажите тестовые `YOOKASSA_SHOP_ID` и `YOOKASSA_SECRET_KEY` в `.env`.
3. Запустите локально:

```bash
npm run dev
```

4. Оформите заказ на `/checkout`.
5. После редиректа оплатите заказ тестовыми данными из кабинета или документации ЮKassa.
6. Вернитесь на `/success?orderId=...`.
7. Проверьте `paymentStatus` и `orderStatus` в `/admin/orders`.

Страница `/success` может сначала показать `Оплата обрабатывается`, пока webhook ещё не пришёл. Это нормальное состояние.

### Ограничения webhook-проверки

В текущем MVP нет криптографической проверки подписи webhook от ЮKassa. Маршрут поддерживает простую shared-secret проверку через query parameter, header `x-yookassa-webhook-secret` или Bearer token, если задан `YOOKASSA_WEBHOOK_SECRET`.

Для production рекомендуется добавить более строгую проверку источника webhook, журналирование событий, retry-аудит и сверку платежа через API ЮKassa перед финальным изменением статуса.

## Troubleshooting

### Prisma P1013: invalid domain character in database URL

Частые причины:

- в пароле есть спецсимволы, которые не закодированы для URL;
- в URL остались шаблонные значения вместо реальных данных Supabase;
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
ADMIN_PASSWORD="надёжный пароль"
```

Если `ADMIN_PASSWORD` не задан, вход будет заблокирован понятным сообщением. Для production текущий парольный доступ не заменяет полноценную авторизацию.
