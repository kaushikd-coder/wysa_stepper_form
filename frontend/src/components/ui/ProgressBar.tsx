interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-muted">Progress</span>
        <span className="font-semibold text-primary">
          {completed}/{total} steps
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-teal-50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-dark to-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
