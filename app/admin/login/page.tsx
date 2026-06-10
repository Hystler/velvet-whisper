import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminDisabled } from "@/components/admin-disabled";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminPasswordMissing } from "@/components/admin-password-missing";
import { getAdminAccessState } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Вход в админку",
  description: "Вход в демонстрационную админку Velvet Whisper."
};

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

function getSafeNextPath(nextPath?: string) {
  if (!nextPath?.startsWith("/admin") || nextPath.startsWith("/admin/login")) {
    return "/admin";
  }

  return nextPath;
}

export default async function AdminLoginPage({
  searchParams
}: AdminLoginPageProps) {
  const { next } = await searchParams;
  const state = await getAdminAccessState();
  const nextPath = getSafeNextPath(next);

  if (!state.enabled) {
    return (
      <div className="page-shell py-16 md:py-24">
        <AdminDisabled />
      </div>
    );
  }

  if (!state.passwordConfigured) {
    return (
      <div className="page-shell py-16 md:py-24">
        <AdminPasswordMissing />
      </div>
    );
  }

  if (state.authenticated) {
    redirect(nextPath);
  }

  return (
    <div className="page-shell flex min-h-[calc(100vh-9rem)] items-center py-14 md:py-20">
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden border border-border bg-[#f8f1e8]/80 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-border p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <p className="eyebrow text-taupe">Демо-админка</p>
          <h1 className="editorial-title mt-5 text-5xl text-brown sm:text-6xl">
            Velvet Whisper
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-mocha">
            Закрытый доступ к управлению товарами и заказами MVP. Пароль
            проверяется на сервере и не отправляется обратно на клиент.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex text-xs uppercase tracking-[0.18em] text-taupe underline-offset-4 hover:text-brown hover:underline"
          >
            Вернуться на сайт
          </Link>
        </div>
        <div className="p-8 sm:p-10 lg:p-12">
          <p className="eyebrow text-taupe">Вход</p>
          <h2 className="mt-4 font-serif text-3xl text-brown">
            Введите пароль
          </h2>
          <AdminLoginForm nextPath={nextPath} />
        </div>
      </section>
    </div>
  );
}

