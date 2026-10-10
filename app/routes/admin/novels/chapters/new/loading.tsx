import { Skeleton } from "@/components/ui/skeleton";

export function NewChapterLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Back button */}
      <Skeleton className="mb-4 h-9 w-44" />

      {/* Heading */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Form */}
      <div className="mt-8 rounded-xl border bg-card p-6">
        <div className="space-y-6">
          {/* Chapter number */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-112.5 w-full rounded-md" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
