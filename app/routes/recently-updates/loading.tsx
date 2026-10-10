import { Skeleton } from "@/components/ui/skeleton";

export function UpdatesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <Skeleton className="h-10 w-72 bg-secondary" />
        <Skeleton className="mt-2 h-4 w-40 bg-secondary" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-16 bg-secondary" />

              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-3/4 bg-secondary" />

                <Skeleton className="h-4 w-24 bg-secondary" />

                <Skeleton className="h-4 w-full bg-secondary" />

                <Skeleton className="h-4 w-2/3 bg-secondary" />

                <Skeleton className="h-3 w-28 bg-secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-2">
        <Skeleton className="h-10 w-24 bg-secondary" />
        <Skeleton className="h-10 w-16 bg-secondary" />
        <Skeleton className="h-10 w-24 bg-secondary" />
      </div>
    </div>
  );
}
