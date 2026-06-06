import { SubmissionStatus } from "@/types";
import { cn } from "@/lib/cn";

interface StatusBadgeProps {
  status: SubmissionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isCompleted = status === "completed";

  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold capitalize tracking-wide",
        isCompleted
          ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
          : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
      )}
    >
      {status}
    </span>
  );
}
