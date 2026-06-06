"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ChevronRight } from "lucide-react";
import { SubmissionListItem } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteSubmission } from "@/services/submissions";
import { formatDisplayDate, getApiErrorMessage } from "@/lib/formUtils";

interface SubmissionCardProps {
  submission: SubmissionListItem;
  onDeleted: (id: string) => void;
}

export function SubmissionCard({ submission, onDeleted }: SubmissionCardProps) {
  const { completedSteps, totalSteps } = submission.progress;
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");
      await deleteSubmission(submission.id);
      onDeleted(submission.id);
      setShowConfirm(false);
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="group overflow-hidden rounded-xl border border-teal-100/80 bg-gradient-to-br from-white to-teal-50/30 transition-all hover:border-primary/30 hover:shadow-md">
        <div className="h-1 bg-gradient-to-r from-primary-dark to-accent" />

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/form/${submission.id}`}
              className="min-w-0 flex-1 cursor-pointer"
            >
              <h2 className="font-semibold text-foreground group-hover:text-primary-dark">
                {submission.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                Updated {formatDisplayDate(submission.updatedAt)}
              </p>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge status={submission.status} />
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="cursor-pointer rounded-lg p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${submission.title}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <Link
            href={`/form/${submission.id}`}
            className="block cursor-pointer"
          >
            <ProgressBar completed={completedSteps} total={totalSteps} />
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark">
              Open form
              <ChevronRight size={16} />
            </span>
          </Link>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete submission"
        message={`Are you sure you want to delete "${submission.title}"? This cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        disableConfirm={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
