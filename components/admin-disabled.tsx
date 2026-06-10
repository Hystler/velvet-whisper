import { EmptyState } from "@/components/ui-states";

export function AdminDisabled() {
  return (
    <EmptyState
      title="Демо-админка отключена"
      description="Для просмотра MVP-админки добавьте ADMIN_DEMO_ENABLED=true в переменные окружения. Для production нужно подключить полноценную авторизацию и роли доступа."
      actionHref="/"
      actionLabel="На главную"
    />
  );
}
