import { useAuth } from "@/context/AuthContext";
import ChecklistItem from "@/components/ChecklistItem";
import { greeting } from "@/lib/greeting";

export default function DriverDashboard() {
  const { user } = useAuth();
  const hasVehicle = Boolean(
    user.vehicleModel && user.vehicleNumber && user.vehicleColor,
  );

  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm text-muted-foreground">{greeting()}</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {user.name?.split(" ")[0]}
        </h1>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Availability</p>
        <p className="text-lg font-semibold">Offline</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete setup below to start receiving ride requests.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-medium">Driver setup</h2>
        <ul className="space-y-3">
          <ChecklistItem done label="Email verified" />
          <ChecklistItem
            done={hasVehicle}
            label="Vehicle details"
            hint="Model, number and colour. Required before you can go online"
          />
        </ul>
      </section>
    </div>
  );
}
