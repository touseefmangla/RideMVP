import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import PhoneBanner from "@/components/PhoneBanner";
import Logo from "@/components/Logo";
import RiderDashboard from "./RiderDashboard";
import DriverDashboard from "./DriverDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = user.activeRole?.toLowerCase();

  // One-time "Email verified" notice, set by VerifyEmail before its hard redirect
  const [verifiedNotice, setVerifiedNotice] = useState(
    () => sessionStorage.getItem("justVerified") === "true",
  );
  useEffect(() => {
    if (!verifiedNotice) return;
    sessionStorage.removeItem("justVerified");
    const t = setTimeout(() => setVerifiedNotice(false), 4000);
    return () => clearTimeout(t);
  }, [verifiedNotice]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background pl-14 pr-4">
        <Logo />
        <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
          {role}
        </span>
      </header>

      <PhoneBanner
        show={role === "rider" && !user.phone}
        onClick={() => setSidebarOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {verifiedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
            >
              <CheckCircle2 className="h-4 w-4" /> Email verified. You're all
              set.
            </motion.div>
          )}
        </AnimatePresence>

        {role === "driver" ? <DriverDashboard /> : <RiderDashboard />}
      </main>

      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </div>
  );
}
