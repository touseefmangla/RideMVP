import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-950 sm:py-8">
            <div className="relative flex h-dvh w-full flex-col bg-background sm:h-211 sm:w-97.5 sm:overflow-hidden sm:rounded-[3rem] sm:border-8 sm:border-zinc-900 sm:shadow-2xl">
              {/* Notch: top layer, nothing may cover it */}
              <div className="absolute left-1/2 top-0 z-60 hidden h-7 w-40 -translate-x-1/2 items-center justify-center gap-3 rounded-b-3xl bg-zinc-900 sm:flex">
                <div className="h-1.5 w-12 rounded-full bg-zinc-950 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
                <div className="relative h-3 w-3 rounded-full bg-zinc-950 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                  <div className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-blue-900/40" />
                </div>
              </div>

              {/* Content clears the notch once, here, for every screen */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth sm:pt-7">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
