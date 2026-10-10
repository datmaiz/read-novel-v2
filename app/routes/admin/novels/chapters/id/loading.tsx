import { Skeleton } from "@/components/ui/skeleton";

export function EditChapterLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Back */}
      <Skeleton className="mb-4 h-9 w-40" />

      {/* Header */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-56 bg-secondary" />
        <Skeleton className="h-5 w-64 bg-secondary" />
      </div>

      {/* Form */}
      <div className="mt-8 rounded-xl border bg-card p-6">
        <div className="space-y-6">
          {/* Chapter number */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-secondary" />
            <Skeleton className="h-10 w-full bg-secondary" />
          </div>

          {/* Chapter title */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-secondary" />
            <Skeleton className="h-10 w-full bg-secondary" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-secondary" />
            <Skeleton className="h-105 w-full rounded-lg bg-secondary" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Skeleton className="h-10 w-24 bg-secondary" />
            <Skeleton className="h-10 w-32 bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
