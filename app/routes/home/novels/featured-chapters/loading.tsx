import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedChaptersLoading() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <div className="h-16 w-full border-b" />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-6 md:py-12">
        {/* Title */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64 bg-secondary" />
          <Skeleton className="h-4 w-96 bg-secondary" />
        </div>

        {/* Groups */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-4">
              {/* Novel header */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-48 bg-secondary" />
                <Skeleton className="h-4 w-20 bg-secondary" />
              </div>

              {/* Chapters */}
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-2/3 bg-secondary" />
                    <Skeleton className="h-4 w-16 bg-secondary" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
