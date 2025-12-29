"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";
import ChatBot from "@/components/ChatBot";
// import { setTimeout } from "timers/promises"
import { handleConsultationRequests } from "../APITriggers/handleConsultationRequests";
import { toast } from "sonner";

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "Please enter a valid Sri Lankan phone number (10 digits starting with 0)";
    }
    return "";
  };

  const validateDate = (date) => {
    if (!date) return "Preferred date is required";
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return "Please select a future date";
    }
    return "";
  };

  const validateField = (name, value) => {
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
        return validateDate(value);
      case "preferredTime":
        return !value ? "Please select a time slot" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "message") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
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
      alert("Booking failed. Please try again.");
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

  const getInputClassName = (fieldName, baseClassName) => {
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClassName} border-red-500 focus:ring-red-500`;
    }
    return baseClassName;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-96 bg-linear-to-r from-primary via-primary/90 to-secondary text-primary-foreground flex items-center mb-24"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=384&width=1600&query=professional car consultation advisor customer meeting)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-6xl font-bold mb-4 text-balance">
            Book an Appointment
          </h1>
          <p className="text-xl opacity-90 text-balance max-w-2xl">
            Connect with our technical experts for personalized vehicle guidance
            and advice.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultation Benefits */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/10">
                    <User className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Expert Guidance</h3>
                  <p className="text-sm text-muted-foreground">
                    Get personalized advice from our experienced technical
                    consultants.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/10">
                    <Clock className="text-green-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Flexible Scheduling
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a time that works best for you, at your convenience.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500/10">
                    <MapPin className="text-purple-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Multiple Locations</h3>
                  <p className="text-sm text-muted-foreground">
                    Meet at any of our branches or schedule an online
                    consultation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
              <h2 className="text-3xl font-bold mb-6">
                Schedule Your Consultation
              </h2>

              {submitted && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-green-800 font-semibold">
                    Thank you! We've received your request. Our team will
                    contact you shortly.
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
                      "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
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
                      "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
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
                      "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
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
                      "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
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
                      "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
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
                      "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
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
                    rows="4"
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
          </div>
        </div>
      </div>

      {/* Chatbot Icon */}
      <ChatBot />

      <Footer />
    </div>
  );
}
