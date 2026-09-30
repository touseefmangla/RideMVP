import { CheckCircle2, Circle } from "lucide-react";

export default function ChecklistItem({ done, label, hint }) {
  return (
    <li className="flex items-start gap-3">
      {done ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
      ) : (
        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/60" />
      )}
      <div>
        <p
          className={`text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}
        >
          {label}
        </p>
        {hint && !done && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    </li>
  );
}
