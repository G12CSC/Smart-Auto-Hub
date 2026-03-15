"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = {
          ...prev,
        };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);

      // TODO: Connect this to your Next.js API route or external backend
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        alert("Registration successful!");
        onSwitchToLogin();
      }, 1500);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-muted";
    if (passwordStrength <= 1) return "bg-destructive";
    if (passwordStrength <= 2) return "bg-warning"; // Ensure this class exists in tailwind config
    if (passwordStrength <= 3) return "bg-info"; // Ensure this class exists in tailwind config
    return "bg-success"; // Ensure this class exists in tailwind config
  };

  const getStrengthText = () => {
    if (formData.password.length === 0) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    return "Strong";
  };

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto fade-in-up",
        shake && "animate-[shake_0.5s_ease-in-out]",
      )}
    >
      {/* Moved the style block here so it's scoped correctly */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-5px);
          }
        }
      `}</style>

      <div className="text-center mb-6 animate-slide-up-1">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Create Account
        </h2>
        <p className="text-muted-foreground">Join Sameera Auto Traders today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 animate-slide-up-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <UserIcon className="h-5 w-5" />
            </div>
            <Input
              id="name"
              placeholder="John Doe"
              className={cn(
                "pl-10 transition-all duration-300",
                errors.name &&
                  "border-destructive focus-visible:ring-destructive",
              )}
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive animate-in fade-in">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up-2 delay-100">
          <div className="space-y-2">
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
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive animate-in fade-in">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <PhoneIcon className="h-5 w-5" />
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className={cn(
                  "pl-10 transition-all duration-300",
                  errors.phone &&
                    "border-destructive focus-visible:ring-destructive",
                )}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive animate-in fade-in">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 animate-slide-up-3 delay-200">
          <Label htmlFor="password">Password</Label>
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
              value={formData.password}
              onChange={handleChange}
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

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <div className="pt-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">
                  Password strength:
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    passwordStrength <= 1
                      ? "text-destructive"
                      : passwordStrength <= 2
                        ? "text-warning"
                        : passwordStrength <= 3
                          ? "text-info"
                          : "text-success",
                  )}
                >
                  {getStrengthText()}
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "h-full flex-1 rounded-full transition-all duration-500",
                      passwordStrength >= level
                        ? getStrengthColor()
                        : "bg-transparent",
                    )}
                  />
                ))}
              </div>
            </div>
          )}
          {errors.password && (
            <p className="text-sm text-destructive animate-in fade-in">
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2 animate-slide-up-3 delay-300">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <LockIcon className="h-5 w-5" />
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "pl-10 pr-10 transition-all duration-300",
                errors.confirmPassword &&
                  "border-destructive focus-visible:ring-destructive",
              )}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive animate-in fade-in">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="space-y-2 animate-slide-up-3 delay-400 pt-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => {
                setAgreeTerms(checked as boolean);
                if (errors.terms)
                  setErrors((prev) => ({
                    ...prev,
                    terms: undefined,
                  }));
              }}
              className="mt-1"
            />
            <Label
              htmlFor="terms"
              className="font-normal text-sm leading-snug cursor-pointer"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-destructive animate-in fade-in">
              {errors.terms}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full hover-glow animate-slide-up-3 delay-500 h-11 text-base mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground animate-slide-up-3 delay-500 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-primary hover:underline transition-all"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}
