export function MovieCardSkeleton() {
  return <div className="animate-pulse"><div className="aspect-[2/3] bg-muted rounded-lg" /></div>;
}
export function MovieGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 md:px-6 lg:px-8 py-6">
      {Array.from({ length: count }).map((_, i) => (<MovieCardSkeleton key={i} />))}
    </div>
  );
}