import { Skeleton } from "@/components/ui/skeleton";

export default function PublicBulletinLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 md:py-14">
      <Skeleton className="h-4 w-32" />
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-10 w-4/5" />
      <div className="mt-4 flex gap-5">
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="my-8 h-px w-full" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
