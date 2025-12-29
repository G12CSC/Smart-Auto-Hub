"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Large Text */}
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-slate-900 dark:text-white">
            404
          </h1>
          <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full" />
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 bg-transparent"
          >
            <Link href="/vehicles">
              <Search className="w-5 h-5" />
              Browse Vehicles
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Looking for something specific? Try these pages:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/about"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              About Us
            </Link>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <Link
              href="/contact"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Contact
            </Link>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <Link
              href="/consultation"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Book Consultation
            </Link>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <Link
              href="/faq"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
