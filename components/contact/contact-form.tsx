"use client";

import { AlertCircle, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };
  const validatePhone = (phone) => {
    if (!phone) return ""; // Optional field
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "Please enter a valid Sri Lankan phone number (10 digits starting with 0)";
    }
    return "";
  };
  const validateMessage = (message) => {
    if (!message) return "Message is required";
    if (message.length < 10) return "Message must be at least 10 characters";
    return "";
  };
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return !value ? "Full name is required" : "";
      case "email":
        return validateEmail(value);
      case "phone":
        return validatePhone(value);
      case "subject":
        return !value ? "Please select a subject" : "";
      case "message":
        return validateMessage(value);
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
      {},
    );
    setTouched(allTouched);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent successfully! We'll get back to you soon.", {
      duration: 4000,
      icon: "✉️",
    });

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
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
    <div className="bg-card rounded-lg p-8 border border-border shadow-sm animate-bounce-in-up">
      <h2 className="text-2xl font-bold mb-6 animate-text-reveal">
        Send us a Message
      </h2>

      {submitted && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-green-800 font-semibold">
            Thank you for your message! We'll get back to you as soon as
            possible.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={getInputClassName(
                "name",
                "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition",
              )}
            />
            {errors.name && touched.name && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                <AlertCircle size={12} />
                <span>{errors.name}</span>
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
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="077 XXX XXXX"
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

        {/* Subject */}
        <div>
          <Label className="block text-sm font-semibold mb-2">Subject *</Label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName(
              "subject",
              "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition",
            )}
          >
            <option value="">Select a subject</option>
            <option value="general-inquiry">General Inquiry</option>
            <option value="vehicle-inquiry">Vehicle Inquiry</option>
            <option value="technical-support">Technical Support</option>
            <option value="booking-issue">Booking Issue</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
          {errors.subject && touched.subject && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>{errors.subject}</span>
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="block text-sm font-semibold">Message *</Label>
            <span className="text-xs text-muted-foreground">
              {formData.message.length} characters
            </span>
          </div>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tell us your message here..."
            rows={6}
            className={getInputClassName(
              "message",
              "w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none transition",
            )}
          />
          {errors.message && touched.message && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
              <AlertCircle size={12} />
              <span>{errors.message}</span>
            </div>
          )}
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
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2" size={18} />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
