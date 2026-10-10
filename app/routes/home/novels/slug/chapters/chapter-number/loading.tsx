import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ReaderLoading() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 md:px-6 md:py-10">
        <Button variant="ghost" size="sm" className="-ml-2 pointer-events-none">
          <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
          <Skeleton className="h-4 w-32 bg-secondary" />
        </Button>

        <div className="mt-8 space-y-8">
          {/* Chapter header */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4 bg-secondary" />

            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24 bg-secondary" />
              <Skeleton className="h-4 w-16 bg-secondary" />
            </div>
          </div>

          {/* Reader controls */}
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4">
            <Skeleton className="h-9 w-24 bg-secondary" />
            <Skeleton className="h-9 w-40 bg-secondary" />
            <Skeleton className="h-9 w-24 bg-secondary" />
          </div>

          {/* Chapter content */}
          <div className="space-y-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-4 w-full bg-secondary rounded-md"
                style={{
                  width: `${90 + Math.random() * 10}%`,
                }}
              />
            ))}

            <Skeleton className="h-4 w-2/3 bg-secondary" />
            <Skeleton className="h-4 w-5/6 bg-secondary" />
          </div>

          {/* Bottom navigation */}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <Skeleton className="h-10 w-28 bg-secondary" />
            <Skeleton className="h-10 w-28 bg-secondary" />
          </div>
        </div>
      </main>
    </div>
  );
}
