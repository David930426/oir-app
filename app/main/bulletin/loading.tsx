import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BulletinFeedLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-10 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 max-w-3xl mx-auto flex flex-col items-center">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      {/* Filter + search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-9 w-full md:w-72 rounded-full" />
      </div>

      {/* Featured */}
      <Card className="overflow-hidden rounded-3xl border">
        <div className="flex flex-col md:flex-row">
          <Skeleton className="md:w-64 aspect-video md:aspect-auto md:h-48 rounded-none" />
          <div className="flex-1 p-6 md:p-8 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border p-5 space-y-3">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    </div>
  );
}
