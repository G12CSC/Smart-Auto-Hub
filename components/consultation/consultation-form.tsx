"use client";

import { handleConsultationRequests } from "@/app/APITriggers/handleConsultationRequests";
import { Consultation } from "@/types";
import { AlertCircle, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function consultationForm() {
  const [formData, setFormData] = useState<Consultation>({
    fullName: "",
    email: "",
    phone: "",
    vehicleType: "",
    consultationType: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "Please enter a valid Sri Lankan phone number (10 digits starting with 0)";
    }
    return "";
  };

  const validateDate = (date: Date) => {
    if (!date) return "Preferred date is required";
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return "Please select a future date";
    }
    return "";
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "fullName":
        return !value ? "Full name is required" : "";
      case "email":
        return validateEmail(value);
      case "phone":
        return validatePhone(value);
      case "vehicleType":
        return !value ? "Please select a vehicle type" : "";
      case "consultationType":
        return !value ? "Please select a consultation type" : "";
      case "preferredDate":
        return validateDate(new Date(value));
      case "preferredTime":
        return !value ? "Please select a time slot" : "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {} as { [key: string]: string };
    Object.keys(formData).forEach((key) => {
      if (key !== "message") {
        const error = validateField(key, (formData as any)[key]);
        if (error) newErrors[key] = error;
      }
    });

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      await handleConsultationRequests(formData); // ✅ THIS IS CORRECT

      toast("Booking submitted successfully!", {
        duration: 4000,
        icon: "📅",
      });

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        vehicleType: "",
        consultationType: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
      setErrors({});
      setTouched({});
      setSubmitted(false);
    }, 3000);
  };

  const getInputClassName = (fieldName: string, baseClassName: string) => {
    if ((submitted || touched[fieldName]) && errors[fieldName]) {
      return `${baseClassName} border-red-500 focus:ring-red-500`;
    }
    return baseClassName;
  };

  return (
    <div className="bg-card rounded-lg p-8 border border-border shadow-sm animate-pop-in delay-300">
      <h2 className="text-3xl font-bold mb-6 animate-text-reveal">
        Schedule Your Consultation
      </h2>

      {submitted && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-green-800 font-semibold">
            Thank you! We've received your request. Our team will contact you
            shortly.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            className={getInputClassName(
              "fullName",
              "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition",
            )}
          />
          {errors.fullName && touched.fullName && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>{errors.fullName}</span>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="john@example.com"
            className={getInputClassName(
              "email",
              "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition",
            )}
          />
          {errors.email && touched.email && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0771234567"
            className={getInputClassName(
              "phone",
              "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition",
            )}
          />
          {errors.phone && touched.phone && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>{errors.phone}</span>
            </div>
          )}
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Interested Vehicle Type *
          </label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName(
              "vehicleType",
              "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition",
            )}
          >
            <option value="">Select a vehicle type</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="van">Van</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {errors.vehicleType && touched.vehicleType && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>{errors.vehicleType}</span>
            </div>
          )}
        </div>

        {/* Consultation Type */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Consultation Type *
          </label>
          <div className="space-y-2">
            {[
              "General Inquiry",
              "Test Drive",
              "Finance Options",
              "Trade-in Valuation",
            ].map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="consultationType"
                  value={type}
                  checked={formData.consultationType === type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-4 h-4"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
          {errors.consultationType && touched.consultationType && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>{errors.consultationType}</span>
            </div>
          )}
        </div>

        {/* Preferred Date */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Preferred Date *
          </label>
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            onBlur={handleBlur}
            min={new Date().toISOString().split("T")[0]}
            className={getInputClassName(
              "preferredDate",
              "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition",
            )}
          />
          {errors.preferredDate && touched.preferredDate && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>{errors.preferredDate}</span>
            </div>
          )}
        </div>

        {/* Preferred Time */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Preferred Time *
          </label>
          <select
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName(
              "preferredTime",
              "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition",
            )}
          >
            <option value="">Select a time slot</option>
            <option value="09:00-10:00">09:00 - 10:00 AM</option>
            <option value="10:00-11:00">10:00 - 11:00 AM</option>
            <option value="11:00-12:00">11:00 - 12:00 PM</option>
            <option value="14:00-15:00">02:00 - 03:00 PM</option>
            <option value="15:00-16:00">03:00 - 04:00 PM</option>
            <option value="16:00-17:00">04:00 - 05:00 PM</option>
          </select>
          {errors.preferredTime && touched.preferredTime && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>{errors.preferredTime}</span>
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Additional Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about your needs..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none transition"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={18} />
              Scheduling...
            </>
          ) : (
            <>
              <Calendar className="mr-2" size={18} />
              Schedule Appointment
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
