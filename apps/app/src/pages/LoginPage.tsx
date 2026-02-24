import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../shared/components/ui/Button";
import { Input } from "../shared/components/ui/Input";
import { useAuth, useLogin } from "../features/auth/hooks/useAuth";
import { loginSchema, type LoginFormData } from "../features/auth/schema";

export default function LoginPage() {
  const { mutate, isPending } = useLogin();
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          navigate("/");
        },
        onError: (err: any) => {
          alert(err?.response?.data?.message || "Signup failed");
        },
      },
    );
  };

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, isLoading]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-100 mx-auto px-6"
    >
      <h1 className="text-2xl font-semibold text-center">Welcome To Webyz</h1>
      <span className="block text-center">
        Enter your credentials to continue.
      </span>

      <div>
        <Input
          label="Email"
          placeholder="Ex: example@gmail.com"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </div>
      <div className="mt-4">
        <Input
          label="Password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-[13px] text-accentPrimary">
          Forgort password?
        </span>
      </div>

      <div className="mt-4">
        <Button className="w-full" disabled={isPending}>
          {isPending ? "Loading..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
