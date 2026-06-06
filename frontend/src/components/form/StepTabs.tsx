import { FormStep } from "@/types";
import { cn } from "@/lib/cn";

interface StepTabsProps {
  steps: FormStep[];
  currentStepIndex: number;
  isStepEnabled: (index: number) => boolean;
  onStepClick: (index: number) => void;
}

export function StepTabs({
  steps,
  currentStepIndex,
  isStepEnabled,
  onStepClick,
}: StepTabsProps) {
  return (
    <div className="flex border-b border-border">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isEnabled = isStepEnabled(index);

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => isEnabled && onStepClick(index)}
            disabled={!isEnabled}
            className={cn(
              "flex-1 border-b-2 px-2 py-2.5 text-center text-xs leading-snug font-medium transition-colors sm:px-3 sm:py-3 sm:text-sm",
              isActive && "cursor-pointer border-primary text-primary",
              !isActive &&
                isEnabled &&
                "cursor-pointer border-transparent text-foreground hover:text-primary",
              !isActive &&
                !isEnabled &&
                "cursor-not-allowed border-transparent text-muted/50"
            )}
          >
            {step.title}
          </button>
        );
      })}
    </div>
  );
}
