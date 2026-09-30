import { Navigation, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ChecklistItem from "@/components/ChecklistItem";
import { greeting } from "@/lib/greeting";

export default function RiderDashboard() {
  const { user } = useAuth();
  const hasPhone = Boolean(user.phone);

  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm text-muted-foreground">{greeting()}</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {user.name?.split(" ")[0]}
        </h1>
      </div>

      <button
        disabled={!hasPhone}
        className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 enabled:hover:border-primary/50 enabled:active:scale-[0.99]"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <Navigation className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium">Where to?</span>
          <span className="block text-sm text-muted-foreground">
            {hasPhone
              ? "Set pickup and drop-off to see your fare"
              : "Add your phone number to start booking"}
          </span>
        </span>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-medium">Account setup</h2>
        <ul className="space-y-3">
          <ChecklistItem done label="Email verified" />
          <ChecklistItem
            done={hasPhone}
            label="Phone number"
            hint="Needed so your driver can reach you during a ride"
          />
        </ul>
      </section>
    </div>
  );
}
