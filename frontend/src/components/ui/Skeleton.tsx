import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-teal-100/80 via-teal-50 to-teal-100/80",
        className
      )}
    />
  );
}

export function FormSkeleton() {
  return (
    <div className="form-card overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="hero-gradient px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 bg-white/30" />
            <Skeleton className="h-3 w-28 bg-white/20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg bg-white/20" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-2 py-3">
        <Skeleton className="mx-2 h-4 flex-1" />
        <Skeleton className="mx-2 h-4 flex-1" />
        <Skeleton className="mx-2 h-4 flex-1" />
      </div>

      {/* Fields */}
      <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-3 border-t border-border px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
        <Skeleton className="h-10 w-full rounded-lg sm:w-24" />
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Skeleton className="h-10 w-full rounded-lg sm:w-20" />
          <Skeleton className="h-10 w-full rounded-lg sm:w-36" />
        </div>
      </div>
    </div>
  );
}

export function SubmissionCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-teal-100/80 bg-white">
      <Skeleton className="h-1 w-full rounded-none" />
      <div className="space-y-3 p-4 sm:p-5">
          <div className="flex justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 max-w-[220px]" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function SubmissionListSkeleton() {
  return (
    <div className="space-y-3">
      <SubmissionCardSkeleton />
      <SubmissionCardSkeleton />
      <SubmissionCardSkeleton />
    </div>
  );
}
