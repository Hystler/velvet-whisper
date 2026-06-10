import { EmptyState } from "@/components/ui-states";

export function AdminPasswordMissing() {
  return (
    <EmptyState
      title="ADMIN_PASSWORD не настроен"
      description="Добавьте ADMIN_PASSWORD в переменные окружения локально и в Vercel, затем повторите вход в демо-админку."
      actionHref="/"
      actionLabel="На главную"
    />
  );
}

