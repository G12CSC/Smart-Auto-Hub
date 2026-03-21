"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function FeedbackPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const feedbackShown = sessionStorage.getItem("contactFeedbackShown");

    if (!feedbackShown) {
      const timeoutId = setTimeout(() => {
        setShowPopup(true);
      }, 15000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("contactFeedbackShown", "true");
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

  if (!showPopup) return null;

  return (
    <Dialog open={showPopup} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden border-border bg-card p-0 shadow-2xl sm:max-w-2xl">
        <div className="bg-linear-to-br from-primary/15 via-background to-background p-6 sm:p-8">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="max-w-xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Contact Sameera Auto Traders Today!
            </DialogTitle>
            <DialogDescription className="max-w-xl text-base leading-7 text-muted-foreground">
              Looking for your dream car or need more information about our
              vehicles?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">
              How we can help you
            </h3>
            <p className="text-sm font-semibold text-foreground">
              Our team is ready to help you with car inquiries, vehicle
              availability, pricing, and consultation services.
            </p>

            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  📞
                </span>{" "}
                Friendly customer support
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  🚗
                </span>{" "}
                Expert advice on buying vehicles
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  🤝
                </span>{" "}
                Trusted car dealers
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  💬
                </span>{" "}
                Quick responses to your questions
              </li>
            </ul>
            <p className="p-2">
              Reach out to us anytime and let us help you drive away with
              confidence.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={handleExploreCars}
              className="bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              📩 Contact Sameera Auto Traders today
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
