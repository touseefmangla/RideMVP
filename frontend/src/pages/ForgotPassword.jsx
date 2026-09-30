import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthField } from "@/components/AuthField";
import * as api from "@/lib/api";

const forgotSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export default function ForgotPassword() {
  const location = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: location.state?.email || "" },
  });

  async function onSubmit(values) {
    setServerError(null);
    try {
      await api.forgotPassword(values);
      setIsSubmitted(true);
    } catch (err) {
      setServerError(err.message || "Failed to send reset link.");
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 text-center">
        <h1 className="mb-2 text-2xl font-medium">Check your email</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          If an account exists for that email, we've sent instructions to reset
          your password.
        </p>
        <Link to="/login" className="underline">
          Return to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-2 text-2xl font-medium">Reset password</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
        </AuthField>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link to="/login" className="underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
