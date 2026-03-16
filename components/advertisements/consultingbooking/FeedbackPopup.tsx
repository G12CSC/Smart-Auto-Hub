"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FeedbackPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const feedbackShown = sessionStorage.getItem("consultingFeedbackShown");

    if (!feedbackShown) {
      const timer = window.setTimeout(() => {
        setShowPopup(true);
      }, 30000);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("consultingFeedbackShown", "true");
    setShowPopup(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closePopup();
    }
  };

  const handleScheduleConsultation = () => {
    closePopup();
    router.push("/consultation");
  };

  const points = [
    "Choosing the best car for your budget",
    "Comparing models, features, and practical value",
    "Understanding leasing and financing options",
    "Selecting reliable vehicles for Sri Lankan roads",
  ];

  return (
    <Dialog open={showPopup} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden border-border bg-card p-0 shadow-2xl sm:max-w-2xl">
        <div className="bg-linear-to-br from-primary/15 via-background to-background p-6 sm:p-8">
          <DialogHeader className="space-y-3 text-left">
            <div className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Expert Consultation
            </div>
            <DialogTitle className="max-w-xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Need Help Choosing the Right Car?
            </DialogTitle>
            <DialogDescription className="max-w-xl text-base leading-7 text-muted-foreground">
              Sameera Auto Traders offers personalized guidance so you can
              choose a vehicle with confidence, not guesswork.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-foreground">
                What we help with
              </p>
              <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                {points.map((point, index) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-xl bg-secondary px-5 py-4 text-secondary-foreground shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground/70">
                Ready to book?
              </p>
              <p className="mt-3 text-sm leading-7 text-secondary-foreground/85">
                Schedule your consultation and get practical advice on the right
                vehicle for your budget and long-term use.
              </p>
              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                <Button
                  className="h-auto w-full whitespace-normal py-2 text-center"
                  onClick={handleScheduleConsultation}
                >
                  Schedule Consultation
                </Button>
                <Button
                  className="h-auto w-full whitespace-normal py-2 text-center"
                  variant="outline"
                  onClick={closePopup}
                >
                  Maybe later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
