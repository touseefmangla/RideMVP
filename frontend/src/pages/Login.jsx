import { useState } from "react";
import { useLocation, Link, useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthField } from "@/components/AuthField";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const { login, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: location.state?.email || "", password: "" },
  });

  async function onSubmit(values) {
    setServerError(null);
    try {
      await login(values);
    } catch (err) {
      if (
        err.status === 403 ||
        err.message === "unverified" ||
        err.message?.toLowerCase().includes("verify")
      ) {
        navigate("/verify-email", {
          replace: true,
          state: { email: values.email },
        });
        return;
      }

      setServerError(
        err.status === 401 ? "Invalid email or password" : err.message,
      );
    }
  }

  if (loading) return null;

  if (user) {
    const from = location.state?.from?.pathname;
    return <Navigate to={from && from !== "/login" ? from : "/"} replace />;
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-2 text-2xl font-medium">Log in</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
        </AuthField>

        <AuthField label="Password" htmlFor="password" error={errors.password}>
          <Input id="password" type="password" {...register("password")} />
        </AuthField>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        <Link
          to="/forgot-password"
          state={{ email: getValues("email") }}
          className="hover:underline"
        >
          Forgot password?
        </Link>
        <Link to="/signup" className="underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}
