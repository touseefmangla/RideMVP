import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthField } from "@/components/AuthField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as api from "@/lib/api";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  role: z.enum(["Rider", "Driver"], {
    errorMap: () => ({ message: "Choose a role" }),
  }),
});

export default function Signup() {
  const navigate = useNavigate();
  const [emailTaken, setEmailTaken] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", role: "Rider" },
  });

  async function onSubmit(values) {
    setServerError(null);
    setEmailTaken(false);
    try {
      await api.signup(values);
      navigate("/verify-email", {
        replace: true,
        state: { email: values.email },
      });
    } catch (err) {
      if (err.message === "Email already in use") {
        setEmailTaken(true);
      } else {
        setServerError(err.message);
      }
    }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-6 text-2xl font-medium">Create an account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField label="Name" htmlFor="name" error={errors.name}>
          <Input id="name" {...register("name")} />
        </AuthField>

        <AuthField label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            {...register("email", { onChange: () => setEmailTaken(false) })}
          />
        </AuthField>
        {emailTaken && (
          <p className="-mt-2 text-sm text-destructive">
            That email's already registered.{" "}
            <Link
              to="/login"
              state={{ email: getValues("email") }}
              className="underline"
            >
              Log in instead
            </Link>
          </p>
        )}

        <AuthField label="Password" htmlFor="password" error={errors.password}>
          <Input id="password" type="password" {...register("password")} />
        </AuthField>

        <AuthField label="I am a" htmlFor="role" error={errors.role}>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="w-(--radix-select-trigger-width) max-h-48"
                  alignItemWithTrigger={false}
                >
                  <SelectItem value="Rider">Rider</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </AuthField>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
