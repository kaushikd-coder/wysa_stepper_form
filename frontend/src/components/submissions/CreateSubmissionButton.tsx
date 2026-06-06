"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createSubmission, getFormConfigs } from "@/services/submissions";
import { getApiErrorMessage } from "@/lib/formUtils";

export function CreateSubmissionButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError("");

      const configs = await getFormConfigs();

      if (!configs.length) {
        setError("No form configs available.");
        return;
      }

      const wellnessConfig =
        configs.find((config) => config.slug === "wellness-intake") ??
        configs[0];

      const submission = await createSubmission(wellnessConfig.id);
      router.push(`/form/${submission.id}`);
    } catch (createError) {
      setError(getApiErrorMessage(createError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-auto sm:shrink-0">
      <Button
        onClick={handleCreate}
        disabled={loading}
        className="w-full whitespace-nowrap shadow-lg shadow-teal-900/30 sm:w-auto"
      >
        {loading ? "Creating..." : "New Wellness Intake"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
