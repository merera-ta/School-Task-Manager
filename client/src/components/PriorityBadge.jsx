import { Flag } from "lucide-react";

const LABELS = { low: "Low", medium: "Medium", high: "High" };

export default function PriorityBadge({ priority }) {
  return (
    <span className={`badge badge-${priority}`}>
      <Flag size={12} aria-hidden="true" />
      {LABELS[priority] || priority}
    </span>
  );
}
