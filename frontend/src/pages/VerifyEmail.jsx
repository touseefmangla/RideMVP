import { useState, useEffect, useRef } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import * as api from "@/lib/api";

const RESEND_COOLDOWN = 30;

export default function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email;
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  if (sessionStorage.getItem("justVerified") === "true") {
    return <Navigate to="/login" replace />;
  }

  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const submittedRef = useRef(false);

  const [resendCooldown, setResendCooldown] = useState(() => {
    if (!email) return 0;
    const lastSent = sessionStorage.getItem(`otp_sent_${email}`);
    if (!lastSent) return RESEND_COOLDOWN;

    const elapsedSeconds = Math.floor(
      (Date.now() - parseInt(lastSent, 10)) / 1000,
    );
    return elapsedSeconds >= RESEND_COOLDOWN
      ? 0
      : RESEND_COOLDOWN - elapsedSeconds;
  });

  useEffect(() => {
    if (email && !sessionStorage.getItem(`otp_sent_${email}`)) {
      sessionStorage.setItem(`otp_sent_${email}`, Date.now().toString());
    }
  }, [email]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (otp.length === 6 && !submittedRef.current) {
      submittedRef.current = true;
      handleVerify(otp);
    }
  }, [otp]);

  if (!email) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 py-12">
        <h1 className="mb-2 text-2xl font-medium">No email to verify</h1>
        <Link to="/signup" className="mt-4 text-sm underline">
          Back to sign up
        </Link>
      </div>
    );
  }

  async function handleVerify(code) {
    setError(null);
    setVerifying(true);
    try {
      await api.verifyEmail({ email, otp: code });

      // Clear the cooldown timer state
      sessionStorage.removeItem(`otp_sent_${email}`);

      // Set the session storage flag for just verified
      sessionStorage.setItem("justVerified", "true");

      // Hard redirect forces AuthContext to remount and fetch the new user cookie
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Invalid or expired code.");
      setOtp("");
      submittedRef.current = false;
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await api.resendOtp({ email });
      sessionStorage.setItem(`otp_sent_${email}`, Date.now().toString());
      setResendCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-2 text-2xl font-medium">Verify your email</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter the 6-digit code sent to{" "}
        <span className="font-medium text-foreground">{email}</span>.
      </p>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          disabled={verifying}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="mt-4 h-6 text-center text-sm">
        {verifying && (
          <span className="text-muted-foreground">Verifying...</span>
        )}
        {error && <span className="text-destructive">{error}</span>}
      </div>

      <div className="mt-6 text-center text-sm">
        {resendCooldown > 0 ? (
          <p className="text-muted-foreground">
            Resend code in {resendCooldown}s
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="underline disabled:opacity-50 hover:text-foreground text-muted-foreground"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>
    </div>
  );
}
