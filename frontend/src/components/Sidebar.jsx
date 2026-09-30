import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PanelLeft, Sun, Moon, Monitor, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthField } from "@/components/AuthField";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import * as api from "@/lib/api";

const PK_PHONE = /^(?:\+92|0)3\d{9}$/;

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

// --- 1. Phone Form (For Both Riders and Drivers) ---
function PhoneForm({ role, onSaved }) {
  const { user, setUser } = useAuth();
  const [phone, setPhone] = useState(user.phone || "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const value = phone.trim();
    if (!PK_PHONE.test(value)) {
      setError("Enter a valid number, e.g. 03XXXXXXXXX");
      return;
    }
    setSaving(true);
    try {
      const data = await api.updatePhone({ phone: value });
      setUser((prev) => ({ ...prev, ...(data?.user ?? {}), phone: value }));
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const isUnchanged = phone.trim() === (user.phone || "");

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 border-b border-border pb-6"
    >
      <AuthField
        label="Phone number"
        htmlFor="phone"
        error={error ? { message: error } : null}
      >
        <Input
          id="phone"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="03XXXXXXXXX"
        />
      </AuthField>
      <p className="text-xs text-muted-foreground pb-2">
        {role === "Driver"
          ? "Riders will use this to contact you."
          : "Shared with your driver only during an active ride."}
      </p>
      <Button
        type="submit"
        size="sm"
        className="w-full"
        disabled={saving || isUnchanged}
      >
        {saving
          ? "Saving..."
          : user.phone && isUnchanged
            ? "Up to date"
            : "Save number"}
      </Button>
    </form>
  );
}

// --- 2. Vehicle Form (For Drivers Only) ---
function VehicleForm({ onSaved }) {
  const { user, setUser } = useAuth();
  const [model, setModel] = useState(user.vehicleModel || "");
  const [number, setNumber] = useState(user.vehicleNumber || "");
  const [color, setColor] = useState(user.vehicleColor || "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!model.trim() || !number.trim() || !color.trim()) {
      setError("Please fill out all vehicle details.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        vehicleModel: model.trim(),
        vehicleNumber: number.trim(),
        vehicleColor: color.trim(),
      };

      const data = await api.updateVehicle(payload);
      setUser((prev) => ({ ...prev, ...payload, ...(data?.user ?? {}) }));
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const isUnchanged =
    model.trim() === (user.vehicleModel || "") &&
    number.trim() === (user.vehicleNumber || "") &&
    color.trim() === (user.vehicleColor || "");

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-2">
      <h3 className="text-sm font-medium text-foreground">Vehicle Details</h3>

      <AuthField label="Model" htmlFor="v-model">
        <Input
          id="v-model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="e.g. Toyota Corolla"
          className="h-9 text-sm"
        />
      </AuthField>

      <AuthField label="License Plate" htmlFor="v-number">
        <Input
          id="v-number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="e.g. ABC-123"
          className="h-9 text-sm uppercase"
        />
      </AuthField>

      <AuthField
        label="Color"
        htmlFor="v-color"
        error={error ? { message: error } : null}
      >
        <Input
          id="v-color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="e.g. White"
          className="h-9 text-sm"
        />
      </AuthField>

      <p className="text-xs text-muted-foreground pb-2 pt-1">
        Required before you can go online and receive requests.
      </p>

      <Button
        type="submit"
        size="sm"
        variant="secondary"
        className="w-full"
        disabled={saving || isUnchanged}
      >
        {saving
          ? "Saving..."
          : user.vehicleModel && isUnchanged
            ? "Vehicle up to date"
            : "Save vehicle details"}
      </Button>
    </form>
  );
}

// --- Main Sidebar Component ---
export default function Sidebar({ open, onOpenChange }) {
  const { user, logout } = useAuth();
  const { mode, setTheme } = useTheme();
  const role = user.activeRole?.toLowerCase();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <>
      <button
        onClick={() => onOpenChange(!open)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        aria-expanded={open}
        aria-controls="app-sidebar"
        className="absolute left-3 top-2.5 z-50 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 z-30 bg-black/50"
          />
        )}
        {open && (
          <motion.aside
            key="drawer"
            id="app-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-card shadow-2xl"
          >
            <div className="flex h-14 shrink-0 items-center border-b border-border pl-14 pr-4">
              <Logo />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {role}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <PhoneForm role={role} onSaved={() => onOpenChange(false)} />
                {role === "driver" && (
                  <VehicleForm onSaved={() => onOpenChange(false)} />
                )}
              </div>
            </div>

            <div className="space-y-3 border-t border-border p-4 shrink-0">
              <div className="flex rounded-lg bg-secondary p-1">
                {THEMES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                      mode === value
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>

              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
