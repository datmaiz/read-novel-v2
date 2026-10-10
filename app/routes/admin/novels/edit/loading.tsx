import { Skeleton } from "@/components/ui/skeleton";

export function EditNovelLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Back button */}
      <Skeleton className="mb-4 h-9 w-24" />

      {/* Heading */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Form */}
      <div className="mt-8 rounded-xl border bg-card p-6">
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Cover */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-36 w-full" />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
