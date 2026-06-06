"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormFields } from "@/components/form/DynamicField";
import { StepTabs } from "@/components/form/StepTabs";
import {
  completeSubmission,
  getFormConfig,
  getSubmission,
  saveDraft,
} from "@/services/submissions";
import {
  FieldErrors,
  FormConfig,
  FormStep,
  Submission,
  SubmissionAnswers,
} from "@/types";
import {
  formatDisplayDate,
  getApiErrorMessage,
  sortSteps,
  validateStep,
  validateAllSteps,
  isStepTabEnabled,
} from "@/lib/formUtils";
import { answersAreEqual } from "@/lib/unsavedChanges";
import { FormSkeleton, Skeleton } from "@/components/ui/Skeleton";

interface StepperFormProps {
  submissionId: string;
}

type PendingAction =
  | { type: "leave" }
  | { type: "step"; stepIndex: number };

type SavingAction = "save" | "saveAndNext" | "submit";

export function StepperForm({ submissionId }: StepperFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState<SavingAction | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [config, setConfig] = useState<FormConfig | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [steps, setSteps] = useState<FormStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<SubmissionAnswers>({});
  const [savedAnswers, setSavedAnswers] = useState<SubmissionAnswers>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        setError("");

        const submissionData = await getSubmission(submissionId);
        const configData = await getFormConfig(submissionData.formConfigId);
        const sortedSteps = sortSteps(configData.steps);
        const loadedAnswers = submissionData.answers ?? {};

        setSubmission(submissionData);
        setConfig(configData);
        setSteps(sortedSteps);
        setCurrentStepIndex(submissionData.currentStepIndex);
        setMaxStepReached(submissionData.currentStepIndex);
        setCompletedStepIds(submissionData.completedStepIds);
        setAnswers({ ...loadedAnswers });
        setSavedAnswers({ ...loadedAnswers });
      } catch (loadError) {
        setError(getApiErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    void loadForm();
  }, [submissionId]);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isCompleted = submission?.status === "completed";
  const hasUnsavedChanges =
    !isCompleted && !answersAreEqual(answers, savedAnswers);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const markAsSaved = (saved: SubmissionAnswers) => {
    setSavedAnswers({ ...saved });
  };

  const discardUnsavedChanges = () => {
    setAnswers({ ...savedAnswers });
    setFieldErrors({});
    setSuccess("");
    setError("");
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
    setSuccess("");
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) {
      return;
    }

    setCurrentStepIndex(stepIndex);
    setMaxStepReached((prev) => Math.max(prev, stepIndex));
    setFieldErrors({});
    setSuccess("");
  };

  const runPendingAction = () => {
    if (!pendingAction) {
      return;
    }

    // Throw away edits that were never saved
    discardUnsavedChanges();

    if (pendingAction.type === "leave") {
      router.push("/");
    }

    if (pendingAction.type === "step") {
      goToStep(pendingAction.stepIndex);
    }

    setPendingAction(null);
  };

  const confirmIfUnsaved = (action: PendingAction, onSafe: () => void) => {
    if (hasUnsavedChanges) {
      setPendingAction(action);
      return;
    }

    onSafe();
  };

  const handleLeave = () => {
    confirmIfUnsaved({ type: "leave" }, () => router.push("/"));
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex === currentStepIndex) {
      return;
    }

    if (!isStepTabEnabled(stepIndex, maxStepReached, isCompleted)) {
      return;
    }

    setError("");
    confirmIfUnsaved({ type: "step", stepIndex }, () => goToStep(stepIndex));
  };

  const checkStepEnabled = (stepIndex: number) =>
    isStepTabEnabled(stepIndex, maxStepReached, isCompleted);

  const persistDraft = async (
    nextStepIndex: number,
    markStepComplete: boolean
  ) => {
    if (!currentStep) {
      return null;
    }

    const nextCompletedIds = markStepComplete
      ? [...new Set([...completedStepIds, currentStep.id])]
      : completedStepIds;

    const updated = await saveDraft(submissionId, {
      currentStepIndex: nextStepIndex,
      completedStepIds: nextCompletedIds,
      answers,
    });

    setSubmission(updated);
    setCompletedStepIds(updated.completedStepIds);
    setCurrentStepIndex(updated.currentStepIndex);
    setMaxStepReached((prev) =>
      Math.max(prev, updated.currentStepIndex)
    );
    markAsSaved(updated.answers ?? answers);

    return updated;
  };

  const handleSave = async () => {
    if (!currentStep) {
      return;
    }

    const errors = validateStep(currentStep, answers, true);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setSavingAction("save");
      setError("");
      setSuccess("");

      await persistDraft(currentStepIndex, false);
      setFieldErrors({});
      setSuccess("Draft saved.");
    } catch (saveError) {
      setError(getApiErrorMessage(saveError));
    } finally {
      setSavingAction(null);
    }
  };

  const handleSaveAndNext = async () => {
    if (!currentStep) {
      return;
    }

    const errors = validateStep(currentStep, answers, true);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setSavingAction("saveAndNext");
      setError("");
      setSuccess("");

      const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
      await persistDraft(nextIndex, true);
      setFieldErrors({});
      setSuccess("Step saved.");
    } catch (saveError) {
      setError(getApiErrorMessage(saveError));
    } finally {
      setSavingAction(null);
    }
  };

  const handleSubmit = async () => {
    if (!currentStep) {
      return;
    }

    const errors = validateAllSteps(steps, answers);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fill all required fields before submitting.");
      return;
    }

    try {
      setSavingAction("submit");
      setError("");
      setSuccess("");

      await completeSubmission(submissionId, answers);
      markAsSaved(answers);
      router.push("/");
      router.refresh();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setSavingAction(null);
    }
  };

  if (loading) {
    return (
      <>
        <Skeleton className="mb-4 h-4 w-36" />
        <FormSkeleton />
      </>
    );
  }

  if (error && !config) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!config || !currentStep) {
    return null;
  }

  const dialogMessage =
    pendingAction?.type === "step"
      ? "You have unsaved changes on this step. Leave without saving?"
      : "You have unsaved changes. Leave this form without saving?";

  return (
    <>
      <button
        type="button"
        onClick={handleLeave}
        className="mb-4 inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary hover:underline"
      >
        ← Back to submissions
      </button>

      <div className="form-card overflow-hidden rounded-2xl">
        <div className="hero-gradient flex items-start justify-between px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-sm font-semibold text-white">
              {formatDisplayDate(
                submission?.updatedAt ?? new Date().toISOString()
              )}
            </p>
            <p className="mt-1 text-sm text-teal-100">{config.title}</p>
          </div>
          <button
            type="button"
            onClick={handleLeave}
            className="cursor-pointer rounded-lg p-1.5 text-teal-100 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <StepTabs
          steps={steps}
          currentStepIndex={currentStepIndex}
          isStepEnabled={checkStepEnabled}
          onStepClick={handleStepClick}
        />

        <div className="px-4 py-5 sm:px-6 sm:py-6">
          {isCompleted && (
            <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              This submission is completed and cannot be edited.
            </p>
          )}

          {hasUnsavedChanges && !isCompleted && (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              You have unsaved changes.
            </p>
          )}

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </p>
          )}

          <FormFields
            fields={currentStep.fields}
            answers={answers}
            errors={fieldErrors}
            disabled={isCompleted}
            onChange={handleFieldChange}
          />
        </div>

        {!isCompleted && (
          <div className="flex flex-col-reverse gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Button
              variant="outline"
              onClick={() => handleStepClick(currentStepIndex - 1)}
              disabled={currentStepIndex === 0 || savingAction !== null}
              className="w-full sm:w-auto"
            >
              Back
            </Button>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={savingAction !== null}
                className="w-full sm:w-auto"
              >
                {savingAction === "save" ? "Saving..." : "Save"}
              </Button>

              {isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={savingAction !== null}
                  className="w-full sm:w-auto"
                >
                  {savingAction === "submit" ? "Submitting..." : "Submit"}
                </Button>
              ) : (
                <Button
                  onClick={handleSaveAndNext}
                  disabled={savingAction !== null}
                  className="w-full sm:w-auto"
                >
                  {savingAction === "saveAndNext" ? "Saving..." : "Save and Next"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title="Unsaved changes"
        message={dialogMessage}
        confirmLabel="Leave without saving"
        cancelLabel="Stay on page"
        onConfirm={runPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </>
  );
}
