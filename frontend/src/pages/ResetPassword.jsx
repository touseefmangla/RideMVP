import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthField } from "@/components/AuthField";
import * as api from "@/lib/api";

const resetSchema = z
  .object({
    newPassword: z.string().min(12, "Password must be at least 12 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values) {
    setServerError(null);
    try {
      await api.resetPassword({
        email,
        token,
        newPassword: values.newPassword,
      });
      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || "Failed to reset password.");
    }
  }

  // If the user lands here without a valid link format
  if (!email || !token) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 text-center">
        <h1 className="mb-2 text-2xl font-medium">Invalid Link</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          This password reset link is invalid or missing required information.
        </p>
        <Link to="/forgot-password" className="underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 text-center">
        <h1 className="mb-2 text-2xl font-medium">Password Reset</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Your password has been successfully reset.
        </p>
        <Button onClick={() => navigate("/login")} className="w-full">
          Go to log in
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-2 text-2xl font-medium">Set new password</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Create a new password for <span className="font-medium">{email}</span>.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField
          label="New Password"
          htmlFor="newPassword"
          error={errors.newPassword}
        >
          <Input
            id="newPassword"
            type="password"
            {...register("newPassword")}
          />
        </AuthField>

        <AuthField
          label="Confirm Password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword}
        >
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
          />
        </AuthField>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </div>
  );
}
