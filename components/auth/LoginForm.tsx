"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import Link from "next/link";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [authError, setAuthError] = useState("");
  const [shake, setShake] = useState(false);

  const validate = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (validate()) {
      setIsLoading(true);
      try {
        const res = await signIn("user-credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (res?.error) {
          setAuthError("Invalid email or password");
          setShake(true);
          setTimeout(() => setShake(false), 500);
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } catch {
        setAuthError("Unable to sign in. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Trigger shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto fade-in-up",
        shake && "animate-[shake_0.5s_ease-in-out]",
      )}
    >
      <div className="text-center mb-8 animate-slide-up-1">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Welcome Back
        </h2>
        <p className="text-muted-foreground">Sign in to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2 animate-slide-up-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <MailIcon className="h-5 w-5" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={cn(
                "pl-10 transition-all duration-300",
                errors.email &&
                  "border-destructive focus-visible:ring-destructive",
              )}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors({
                    ...errors,
                    email: undefined,
                  });
              }}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2 animate-slide-up-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline transition-all"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <LockIcon className="h-5 w-5" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "pl-10 pr-10 transition-all duration-300",
                errors.password &&
                  "border-destructive focus-visible:ring-destructive",
              )}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors({
                    ...errors,
                    password: undefined,
                  });
              }}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Removed specific checkbox layout constraint, assuming Checkbox handles it */}
        <div className="flex items-center space-x-2 animate-slide-up-3 delay-100">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember" className="font-normal cursor-pointer">
            Remember me for 30 days
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full hover-glow animate-slide-up-3 delay-200 h-11 text-base"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {authError && (
          <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1 text-center">
            {authError}
          </p>
        )}

        <div className="relative animate-slide-up-3 delay-300 my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full animate-slide-up-3 delay-400 h-11"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <p className="text-center text-sm text-muted-foreground animate-slide-up-3 delay-500 mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-primary hover:underline transition-all hover:cursor-pointer"
          >
            Create an account
          </button>
        </p>
        <p className="text-center text-sm text-muted-foreground animate-slide-up-3 delay-500 mt-4">
          If you're an admin or an advisor
          <Link
            href="/admin/login"
            className="font-semibold text-primary hover:underline transition-all ml-1"
          >
            Go to Admin Portal Login
          </Link>
        </p>
      </form>
    </div>
  );
}
