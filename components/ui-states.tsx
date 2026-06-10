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
    <div className="editorial-panel px-6 py-14 text-center">
      <h2 className="font-serif text-3xl text-brown">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-mocha">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="primary-button mt-6"
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
    <div className="border border-[#d7bea7] bg-[#fff8ef]/80 px-6 py-14 text-center">
      <h2 className="font-serif text-3xl text-brown">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-mocha">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="secondary-button mt-6"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
