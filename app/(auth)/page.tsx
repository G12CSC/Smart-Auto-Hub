"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { cn } from "@/lib/utils";
import { AuthLogo } from "@/components/auth/AuthLogo";

type AuthTab = "login" | "register";

interface AuthPageProps {
  initialTab?: AuthTab;
}

export default function AuthPage({ initialTab = "login" }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden">
      {/* Left Panel - Branding & Decoration (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] relative bg-secondary flex-col justify-between p-12 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/30 z-0" />

        {/* Animated Particles / Floating Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
          <div
            className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full bg-primary blur-3xl animate-float"
          />
          <div
            className="absolute top-[60%] right-[10%] w-48 h-48 rounded-full bg-primary blur-3xl animate-float delay-2000"
          />
          <div
            className="absolute bottom-[10%] left-[20%] w-24 h-24 rounded-full bg-accent blur-2xl animate-float delay-4000"
          />
        </div>

        {/* Abstract Automotive SVG Decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10 z-0 pointer-events-none">
          <svg
            width="400"
            height="400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary animate-pulse-glow rounded-full"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
            <path d="M12 12l-4-4" strokeWidth="1" className="text-primary" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 animate-slide-in-left">
          <AuthLogo />
        </div>

        <div className="relative z-10 text-secondary-foreground animate-slide-up-2">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Find Your Dream Car <br />
            <span className="text-primary">With Confidence.</span>
          </h1>
          <p className="text-lg text-secondary-foreground/80 max-w-md">
            Join thousands of satisfied customers who found their perfect
            vehicle through Sameera Auto Traders. Premium selection, transparent
            pricing.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-4 text-sm text-secondary-foreground/60 animate-slide-up-3">
          <span>© {new Date().getFullYear()} Sameera Auto Traders</span>
          <span>•</span>
          <Link
            href="/support"
            className="hover:text-primary transition-colors"
          >
            Support
          </Link>
          <span>•</span>
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="md:hidden flex justify-center pt-8 pb-4 animate-slide-in-down">
          <AuthLogo />
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12">
          {/* Tab Navigation */}
          <div className="w-full max-w-md mx-auto mb-8 animate-fade-in-up">
            <div className="flex relative border-b border-border">
              <button
                className={cn(
                  "flex-1 pb-4 text-base font-medium transition-colors relative z-10",
                  activeTab === "login"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab("login")}
              >
                Sign In
              </button>
              <button
                className={cn(
                  "flex-1 pb-4 text-base font-medium transition-colors relative z-10",
                  activeTab === "register"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>

              <div
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-1/2 bg-primary transition-transform duration-300 ease-in-out z-20",
                  activeTab === "login" ? "translate-x-0" : "translate-x-full",
                )}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="relative w-full max-w-md mx-auto">
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                activeTab === "login"
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 -translate-x-8 pointer-events-none absolute inset-x-0 top-0",
              )}
            >
              <LoginForm onSwitchToRegister={() => setActiveTab("register")} />
            </div>

            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                activeTab === "register"
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 translate-x-8 pointer-events-none absolute inset-x-0 top-0",
              )}
            >
              <RegisterForm onSwitchToLogin={() => setActiveTab("login")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
