import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 bg-secondary" />
        <Skeleton className="mt-2 h-4 w-48 bg-secondary" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex gap-4">
              <Skeleton className="h-32 w-24 bg-secondary" />

              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4 bg-secondary" />
                <Skeleton className="h-4 w-32 bg-secondary" />
                <Skeleton className="h-4 w-1/2 bg-secondary" />
                <Skeleton className="h-3 w-40 bg-secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
