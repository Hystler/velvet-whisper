import Link from "next/link";

type StateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel
}: StateProps) {
  return (
    <div className="border border-border bg-ivory/70 px-6 py-12 text-center">
      <h2 className="font-serif text-3xl text-brown">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-mocha">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex min-h-11 max-w-full items-center justify-center bg-brown px-5 text-center text-sm uppercase leading-5 tracking-[0.14em] text-ivory transition hover:bg-mocha sm:px-6 sm:tracking-[0.18em]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorState({
  title = "Не удалось загрузить данные",
  description = "Обновите страницу или попробуйте вернуться позже.",
  actionHref,
  actionLabel
}: Partial<StateProps>) {
  return (
    <div className="border border-border bg-[#fff8ef] px-6 py-12 text-center">
      <h2 className="font-serif text-3xl text-brown">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-mocha">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex min-h-11 max-w-full items-center justify-center border border-brown px-5 text-center text-sm uppercase leading-5 tracking-[0.14em] text-brown transition hover:bg-brown hover:text-ivory sm:px-6 sm:tracking-[0.18em]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
