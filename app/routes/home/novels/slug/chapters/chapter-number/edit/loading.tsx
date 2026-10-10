import { Skeleton } from "@/components/ui/skeleton";

export function EditChapterLoading() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-6 md:py-10">
        <Skeleton className="mb-6 h-9 w-40 bg-secondary" />

        <div className="mb-8 space-y-3">
          <Skeleton className="h-10 w-64 bg-secondary" />
          <Skeleton className="h-5 w-48 bg-secondary" />
        </div>

        <div className="space-y-6 rounded-lg border p-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-secondary" />
            <Skeleton className="h-10 w-full bg-secondary" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-secondary" />
            <Skeleton className="h-105 w-full bg-secondary" />
          </div>

          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-24 bg-secondary" />
            <Skeleton className="h-10 w-28 bg-secondary" />
          </div>
        </div>
      </main>
    </div>
  );
}
