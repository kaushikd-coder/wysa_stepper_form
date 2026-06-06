"use client";

import { useEffect, useState } from "react";
import { SubmissionListItem } from "@/types";
import { getSubmissions } from "@/services/submissions";
import { SubmissionCard } from "@/components/submissions/SubmissionCard";
import { getApiErrorMessage } from "@/lib/formUtils";
import { FileText } from "lucide-react";
import { SubmissionListSkeleton } from "@/components/ui/Skeleton";

export function SubmissionList() {
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getSubmissions();
        setSubmissions(data);
      } catch (loadError) {
        setError(getApiErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    void loadSubmissions();
  }, []);

  const handleDeleted = (id: string) => {
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return <SubmissionListSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="rounded-xl border border-dashed border-teal-200 bg-teal-50/40 px-6 py-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-primary">
          <FileText size={22} />
        </div>
        <p className="font-medium text-foreground">No submissions yet</p>
        <p className="mt-1 text-sm text-muted">
          Click &quot;New Wellness Intake&quot; above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          onDeleted={handleDeleted}
        />
      ))}
    </div>
  );
}
