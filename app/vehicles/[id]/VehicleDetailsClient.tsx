"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Loader2,
  User,
  X,
} from "lucide-react";
import { localStorageAPI } from "@/lib/storage/localStorage.js";
import { toast } from "sonner";
import StarRating from "@/components/StarRating";

type Vehicle = {
  id?: string | number;
  name?: string;
  price?: number;
  image?: string;
  images?: string[];
  status?: string;
  location?: string;
  make?: string;
  model?: string;
  year?: number;
  type?: string;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  description?: string;
};

type ReviewForm = {
  name: string;
  email: string;
  rating: number;
  comment: string;
  couponId: string;
};

type Review = ReviewForm & {
  id: string;
  userName: string;
  comment: string;
  rating: number;
  location: string;
};

type ReviewErrors = Partial<Record<keyof ReviewForm, string>>;

type VehicleDetailsClientProps = {
  vehicle?: Vehicle | null;
  vehicleId?: string;
};

export default function VehicleDetailsClient({
  vehicle: initialVehicle,
  vehicleId,
}: VehicleDetailsClientProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(
    initialVehicle || null,
  );
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [loanAmount, setLoanAmount] = useState(initialVehicle?.price || 0);
  const [downPayment, setDownPayment] = useState(0);
  const [loanTerm, setLoanTerm] = useState(5);

  const [isFavourite, setIsFavourite] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    name: "",
    email: "",
    rating: 0,
    comment: "",
    couponId: "",
  });
  const [reviewErrors, setReviewErrors] = useState<ReviewErrors>({});
  const [submittingReview, setSubmittingReview] = useState(false);

  const resolvedVehicleId =
    vehicleId ??
    (vehicle?.id !== undefined && vehicle?.id !== null
      ? String(vehicle.id)
      : null);

  // Mock images array for gallery - in production, this would come from vehicle data
  const vehicleImages: string[] =
    vehicle?.images && vehicle.images.length > 0
      ? vehicle.images
      : [vehicle?.image || "/placeholder.svg"];

  useEffect(() => {
    if (!initialVehicle) return;
    setVehicle(initialVehicle);
    setLoanAmount(initialVehicle.price || 0);
  }, [initialVehicle]);

  useEffect(() => {
    if (!resolvedVehicleId) return;
    localStorageAPI.addRecentlyViewed(resolvedVehicleId);
    setIsFavourite(localStorageAPI.isFavourite(resolvedVehicleId));
    setReviews(localStorageAPI.getReviews(resolvedVehicleId));
  }, [resolvedVehicleId]);

  const calculatePayment = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = 0.06 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPaymentCalc =
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    setMonthlyPayment(monthlyPaymentCalc);
  };

  const toggleFavourite = () => {
    if (!resolvedVehicleId) return;

    if (isFavourite) {
      localStorageAPI.removeFavourite(resolvedVehicleId);
      setIsFavourite(false);
    } else {
      localStorageAPI.addFavourite(resolvedVehicleId);
      setIsFavourite(true);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length,
    );
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [lightboxOpen]);

  const validateReviewForm = () => {
    const errors: ReviewErrors = {};

    if (!reviewForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!reviewForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (reviewForm.rating === 0) {
      errors.rating = "Please select a rating";
    }

    if (!reviewForm.comment.trim()) {
      errors.comment = "Review comment is required";
    } else if (reviewForm.comment.trim().length < 10) {
      errors.comment = "Review must be at least 10 characters";
    }

    setReviewErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReviewSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateReviewForm()) {
      toast.error("Please fix the errors");
      return;
    }

    setSubmittingReview(true);

    const res = await fetch("/api/reviews/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        carId: resolvedVehicleId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        couponId: reviewForm.couponId,
      }),
    });

    const newReview = await res.json();

    setReviews([newReview, ...reviews]);

    setSubmittingReview(false);

    toast.success("Review added!");
  };

  useEffect(() => {
    if (!resolvedVehicleId) return;

    const fetchReviews = async () => {
      const res = await fetch(`/api/reviews/${resolvedVehicleId}`);
      const data = await res.json();

      setReviews(data);
    };

    fetchReviews();
  }, [resolvedVehicleId]);

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Vehicle Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The vehicle you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/vehicles">Back to Vehicle Listing</Link>
        </Button>
      </div>
    );
  }

  const averageRatingLabel = resolvedVehicleId
    ? localStorageAPI.getAverageRating(resolvedVehicleId)
    : "0.0";
  const averageRatingValue = Number.parseFloat(averageRatingLabel) || 0;

  return (
    <div className="w-full">
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition p-2 rounded-full bg-black/50 hover:bg-black/70"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 transition p-3 rounded-full bg-black/50 hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="max-w-6xl max-h-[90vh] p-4">
            <img
              src={vehicleImages[currentImageIndex] || "/placeholder.svg"}
              alt={`${vehicle?.name || "Vehicle"} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4">
              {currentImageIndex + 1} / {vehicleImages.length}
            </p>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition p-3 rounded-full bg-black/50 hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/vehicles">
            <ArrowLeft size={18} className="mr-2" />
            Back to Search
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div
              className="bg-muted rounded-lg overflow-hidden mb-4 h-80 cursor-pointer group relative"
              onClick={() => openLightbox(0)}
            >
              <img
                src={vehicleImages[0] || "/placeholder.svg"}
                alt={vehicle?.name || "Vehicle"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold bg-black/50 px-4 py-2 rounded-lg">
                  Click to enlarge
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {vehicleImages.slice(1).map((img, i) => (
                <div
                  key={`${img}-${i}`}
                  className="bg-muted rounded h-20 cursor-pointer hover:ring-2 hover:ring-primary transition"
                  onClick={() => openLightbox(i + 1)}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`thumbnail ${i + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-4xl font-bold">
                  {vehicle?.name || "Vehicle"}
                </h1>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleFavourite}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Heart
                    className={`w-5 h-5 ${isFavourite ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {isFavourite ? "Saved" : "Save"}
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  LKR {vehicle?.price?.toLocaleString?.() || "N/A"}
                </span>
                <span
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    vehicle?.status === "Available"
                      ? "bg-green-500/20 text-green-700"
                      : vehicle?.status === "Shipped"
                        ? "bg-yellow-500/20 text-yellow-700"
                        : "bg-red-500/20 text-red-700"
                  }`}
                >
                  {vehicle?.status || "Unknown"}
                </span>
              </div>
              <p className="text-lg text-muted-foreground">
                {vehicle?.location || "N/A"}
              </p>
            </div>

            {/* Key Details Table */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Make</p>
                  <p className="font-semibold">{vehicle?.make || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="font-semibold">{vehicle?.model || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-semibold">{vehicle?.year || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold">{vehicle?.type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-semibold">
                    {vehicle?.mileage
                      ? vehicle.mileage.toLocaleString()
                      : "N/A"}{" "}
                    km
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-semibold">
                    {vehicle?.transmission || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Type</p>
                  <p className="font-semibold">{vehicle?.fuelType || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button asChild className="flex-1 h-12" size="lg">
                <Link href="/consultation">Book an Appointment</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 h-12 bg-transparent"
                size="lg"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card rounded-lg border border-border p-6 mb-12">
          <h3 className="font-bold text-xl mb-4">Description</h3>
          <p className="text-foreground leading-relaxed">
            {vehicle?.description || "No description available"}
          </p>
        </div>

        {/* Leasing Calculator */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-border p-8 mb-12">
          <h3 className="font-bold text-2xl mb-6">
            Estimate Your Monthly Payment
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Loan Amount (LKR)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Down Payment (LKR)
              </label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full px-4 py-3 rounded bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Loan Term (Years)
              </label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full px-4 py-3 rounded bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                  <option key={year} value={year}>
                    {year} {year === 1 ? "year" : "years"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={calculatePayment} className="w-full h-12">
                Calculate Payment
              </Button>
            </div>
          </div>

          {monthlyPayment > 0 && (
            <div className="mt-6 p-4 bg-primary/20 rounded-lg border border-primary/30">
              <p className="text-sm text-muted-foreground mb-1">
                Estimated Monthly Payment
              </p>
              <p className="text-3xl font-bold text-primary">
                LKR{" "}
                {monthlyPayment.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Based on 6% annual interset rate. Actual rates may vary.
              </p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-card rounded-lg border border-border p-8 mb-12">
          <div className="mb-8">
            <h3 className="font-bold text-2xl mb-2">Customer Reviews</h3>
            {reviews.length > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={averageRatingValue} readOnly size={20} />
                <span className="text-lg font-semibold">
                  {averageRatingLabel} out of 5
                </span>
                <span className="text-muted-foreground">
                  ({reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>

          {/* Review Form */}

          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-lg mb-6">Write a Review</h4>

            <form onSubmit={handleReviewSubmit} className="space-y-5">
              {/* NAME + EMAIL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NAME */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, name: e.target.value })
                    }
                    className={`input ${reviewErrors.name && "input-error"}`}
                    placeholder="John Doe"
                  />
                  {reviewErrors.name && (
                    <p className="error-text">{reviewErrors.name}</p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={reviewForm.email}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, email: e.target.value })
                    }
                    className={`input ${reviewErrors.email && "input-error"}`}
                    placeholder="john@example.com"
                  />
                  {reviewErrors.email && (
                    <p className="error-text">{reviewErrors.email}</p>
                  )}
                </div>
              </div>

              {/* COUPON */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={reviewForm.couponId}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, couponId: e.target.value })
                  }
                  className={`input ${reviewErrors.couponId && "input-error"}`}
                  placeholder="Enter coupon code"
                />
                {reviewErrors.couponId && (
                  <p className="error-text">{reviewErrors.couponId}</p>
                )}
              </div>

              {/* RATING */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <StarRating
                  rating={reviewForm.rating}
                  onRatingChange={(rating) =>
                    setReviewForm({ ...reviewForm, rating })
                  }
                  size={32}
                />
                {reviewErrors.rating && (
                  <p className="error-text">{reviewErrors.rating}</p>
                )}
              </div>

              {/* COMMENT */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  rows={4}
                  className={`textarea ${reviewErrors.comment && "textarea-error"}`}
                  placeholder="Share your experience with this vehicle..."
                />

                <div className="flex justify-between mt-1">
                  {reviewErrors.comment ? (
                    <p className="error-text">{reviewErrors.comment}</p>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Minimum 10 characters
                    </p>
                  )}
                  <p className="text-muted-foreground text-sm">
                    {reviewForm.comment.length} characters
                  </p>
                </div>
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={submittingReview}
                className="w-full md:w-auto"
              >
                {submittingReview ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </form>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews yet. Be the first to review this vehicle!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-border pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="bg-primary/10 rounded-full p-3">
                      <User className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="font-semibold">{review.name}</h5>

                          {/* Location + Date */}
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            {review.location && (
                              <>
                                📍 {review.location}
                                <span>•</span>
                              </>
                            )}
                            {new Date(review.timestamp).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>

                        <StarRating rating={review.rating} readOnly size={18} />
                      </div>

                      {/* Comment */}
                      <p className="text-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Similar Vehicles Section */}
          <div className="mb-12">
            <h3 className="font-bold text-2xl mb-6">
              Similar Vehicles you might like
            </h3>
            <div className="bg-card rounded-lg border border-border p-6 text-center">
              <p className="text-muted-foreground">
                Check out our{" "}
                <Link
                  href="/vehicles"
                  className="text-primary font-semibold hover:underline"
                >
                  full inventory
                </Link>{" "}
                for more options
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
