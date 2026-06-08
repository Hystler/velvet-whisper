"use client";

import { ErrorState } from "@/components/ui-states";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-shell py-16">
      <ErrorState
        title="Ошибка загрузки"
        description="На странице произошла ошибка. Попробуйте перезагрузить данные."
      />
      <div className="mt-6 text-center">
        <button
          onClick={reset}
          className="min-h-11 border border-brown px-6 text-sm uppercase tracking-[0.18em] text-brown transition hover:bg-brown hover:text-ivory"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
