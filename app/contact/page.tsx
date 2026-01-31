import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building,
  AlertCircle,
  Loader2,
  FileQuestion,
} from "lucide-react";
import ChatBot from "@/components/ChatBot";
import ContactForm from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-96 bg-linear-to-r from-primary via-primary/90 to-secondary text-primary-foreground flex items-center mb-24 animate-slide-in-down"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=384&width=1600&query=customer service representative contact center professional)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-6xl font-bold mb-4 text-balance animate-text-reveal">
            Contact Us
          </h1>
          <p className="text-xl opacity-90 text-balance max-w-2xl animate-text-reveal stagger-1">
            Have questions? We're here to help. Reach out to our team anytime.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Office */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-amber-800/10">
                    <Building className="text-amber-900" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Head Office</h3>
                  <p className="text-sm text-muted-foreground">
                    109 Sunethradevi Rd
                    <br />
                    Nugegoda
                    <br />
                    Sri Lanka
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/10">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    <a
                      href="tel:0772329595"
                      className="hover:text-primary transition"
                    >
                      077 232 9595
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Available 9:00 AM - 6:00 PM daily
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/10">
                    <Mail className="text-green-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    <a
                      href="mailto:sameeraautotraders@gmail.com"
                      className="hover:text-primary transition"
                    >
                      sameeraautotraders@gmail.com
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500/10">
                    <Clock className="text-purple-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Business Hours</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Locations - Google Maps */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10">
                    <MapPin className="text-primary" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Business Locations</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click the map to view in Google Maps
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Location 1 - Nugegoda Kohuwala */}
                <a
                  href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.239234396785!2d79.88612917599389!3d6.86190681913631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bf8d0167ad7%3A0x50142863526f0c2!2sSameera%20Auto%20Traders%20-%20Kohuwala%20Branch!5e0!3m2!1sen!2slk!4v1764690973440!5m2!1sen!2slk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-border hover:border-primary transition cursor-pointer group"
                >
                  <div className="px-3 py-2 bg-muted/50 border-b border-border">
                    <p className="text-xs font-semibold text-foreground">
                      Location 1: Nugegoda
                    </p>
                    <p className="text-xs text-muted-foreground">
                      109 Sunethradevi Rd, Nugegoda
                    </p>
                  </div>
                  <div className="relative w-full h-40 bg-muted">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.239234396785!2d79.88612917599389!3d6.86190681913631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bf8d0167ad7%3A0x50142863526f0c2!2sSameera%20Auto%20Traders%20-%20Kohuwala%20Branch!5e0!3m2!1sen!2slk!4v1764690973440!5m2!1sen!2slk"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="pointer-events-none"
                    ></iframe>
                    <div className="absolute inset-0 bg-transparent group-hover:bg-primary/5 transition"></div>
                  </div>
                </a>

                {/* Location 2 - J'pura */}
                <a
                  href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0658309751516!2d79.89594727599393!3d6.882717618882704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bc251893e3b%3A0x1ea9b033eab48ec!2sSameera%20Auto%20Traders!5e0!3m2!1sen!2slk!4v1764691627678!5m2!1sen!2slk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-border hover:border-primary transition cursor-pointer group"
                >
                  <div className="px-3 py-2 bg-muted/50 border-b border-border">
                    <p className="text-xs font-semibold text-foreground">
                      Location 2: Sri Jayawardenepura Kotte
                    </p>
                    <p className="text-xs text-muted-foreground">
                      82 B345, Sri Jayawardenepura Kotte 10100
                    </p>
                  </div>
                  <div className="relative w-full h-40 bg-muted">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0658309751516!2d79.89594727599393!3d6.882717618882704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bc251893e3b%3A0x1ea9b033eab48ec!2sSameera%20Auto%20Traders!5e0!3m2!1sen!2slk!4v1764691627678!5m2!1sen!2slk"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="pointer-events-none"
                    ></iframe>
                    <div className="absolute inset-0 bg-transparent group-hover:bg-primary/5 transition"></div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />

            <div className="mt-6">
              {/* OR Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-sm font-semibold text-muted-foreground">
                  OR
                </span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {/* WhatsApp Section */}
              <a
                href="htttps://wa.me/94772329595"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card rounded-lg p-6 border border-border hover:border-primary transition group"
              >
                <div className="flex items-center justify-center gap-4">
                  {/* WhatsApp Logo */}
                  <svg
                    className="w-12 h-12 text-[#25D366] group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>

                  <div className="text-center">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition">
                      Chat with us on WhatsApp
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get instant responses to your quaries
                    </p>
                  </div>
                </div>
              </a>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-6 border border-border">
              <h3 className="font-bold text-xl mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-sm mb-2">
                    What are your response times?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We typically respond to emails within 24 hours during
                    business days.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-2">
                    Do you offer consultation on weekends?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Yes, we offer limited consultation on Saturdays. Contact us
                    to schedule.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-2">
                    Can I reach you outside business hours?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For urgent matters, please leave a voicemail and we'll get
                    back to you as soon as possible.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <a href="/faq" className="flex items-center justify-center">
                    <FileQuestion className="mr-2" size={18} />
                    View all FAQs
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
