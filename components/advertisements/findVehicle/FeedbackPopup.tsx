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
    const feedbackShown = sessionStorage.getItem("findVehicleFeedbackShown");

    if (!feedbackShown) {
      const timer = window.setTimeout(() => {
        setShowPopup(true);
      }, 5000);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("findVehicleFeedbackShown", "true");
    setShowPopup(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closePopup();
    }
  };

  const handleExploreCars = () => {
    closePopup();
    router.push("/vehicles");
  };

  return (
    <Dialog open={showPopup} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden border-border bg-card p-0 shadow-2xl sm:max-w-2xl">
        <div className="bg-linear-to-br from-primary/15 via-background to-background p-6 sm:p-8">
          <DialogHeader className="space-y-3 text-left">
            <div className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Sri Lanka Vehicle Finder
            </div>
            <DialogTitle className="max-w-xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Find Your Perfect Car in Sri Lanka
            </DialogTitle>
            <DialogDescription className="max-w-xl text-base leading-7 text-muted-foreground">
              Looking for a reconditioned or brand-new vehicle at the best
              price? Browse trusted listings from dealers across Sri Lanka and
              compare options without the usual guesswork.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-foreground">
                Why buyers start here
              </p>
              <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    1
                  </span>
                  Toyota, Honda, Nissan, Suzuki and more in one place.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    2
                  </span>
                  Brand-new and reconditioned vehicles matched to your budget.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    3
                  </span>
                  Trusted dealers with leasing-friendly options.
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-secondary px-5 py-4 text-secondary-foreground shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground/70">
                Ready to browse?
              </p>
              <p className="mt-3 text-sm leading-7 text-secondary-foreground/85">
                Start exploring listings now and move from shortlisting to
                driving your next vehicle home with more confidence.
              </p>
              <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                <Button className="w-full" onClick={handleExploreCars}>
                  Explore Cars Now
                </Button>
                <Button className="w-full" variant="outline" onClick={closePopup}>
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
