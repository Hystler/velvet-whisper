export default function Loading() {
  return (
    <div className="page-shell py-16">
      <div className="h-4 w-40 animate-pulse bg-border" />
      <div className="mt-6 h-16 w-full max-w-2xl animate-pulse bg-beige/40" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {["a", "b", "c", "d"].map((item) => (
          <div key={item} className="space-y-4">
            <div className="aspect-[4/5] animate-pulse bg-beige/40" />
            <div className="h-4 w-3/4 animate-pulse bg-border" />
            <div className="h-4 w-1/2 animate-pulse bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
