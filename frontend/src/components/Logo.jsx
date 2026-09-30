import { Bike } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Bike className="h-4 w-4" />
      </span>
      <span className="text-base font-semibold tracking-tight">RideMVP</span>
    </div>
  );
}
