import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading candidates" }: LoadingStateProps) {
  return (
    <div className="rounded-lg border bg-white p-10">
      <LoadingSpinner label={label} />
    </div>
  );
}
