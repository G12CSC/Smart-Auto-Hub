import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-96 bg-linear-to-r from-primary via-primary/90 to-secondary text-primary-foreground flex items-center mb-24"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=384&width=1600&query=privacy policy document on desk in modern office)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
            Privacy Policy
          </h1>
          <p className="text-xl opacity-90 text-balance max-w-2xl">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="bg-card rounded-lg shadow-sm border border-border p-8 space-y-8">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Sameera Auto Traders ("we," "our," or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website or use our services. Please read this privacy
                policy carefully. If you do not agree with the terms of this
                privacy policy, please do not access the site.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    2.1 Personal Information
                  </h3>
                  <p className="leading-relaxed">
                    We may collect personally identifiable information such as
                    your name, email address, phone number, mailing address, and
                    payment information when you register, make inquiries, or
                    conduct transactions on our website.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    2.2 Usage Data
                  </h3>
                  <p className="leading-relaxed">
                    We automatically collect information about your device,
                    browsing actions, and patterns when you use our website.
                    This includes IP addresses, browser type, operating system,
                    pages visited, and time spent on pages.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    2.3 Vehicle Preferences
                  </h3>
                  <p className="leading-relaxed">
                    Information about your vehicle preferences, search history,
                    favorite vehicles, and browsing behavior to provide
                    personalized recommendations.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Process transactions and send related information</li>
                <li>Respond to inquiries and provide customer support</li>
                <li>Send marketing communications and promotional offers</li>
                <li>Improve our website and services</li>
                <li>Analyze usage patterns and trends</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Service providers who assist in our operations</li>
                <li>Financial institutions for payment processing</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your consent</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We do not sell your personal information to third parties.
              </p>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                5. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, no
                method of transmission over the internet or electronic storage
                is 100% secure. While we strive to protect your information, we
                cannot guarantee absolute security.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Your Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your
                experience, analyze site traffic, and personalize content. You
                can control cookie preferences through your browser settings.
              </p>
            </div>

            {/* Changes to Policy */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                8. Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. The updated
                version will be indicated by an updated "Last updated" date. We
                encourage you to review this Privacy Policy periodically.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                9. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have questions about this Privacy Policy, please contact
                us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: info@sameeraautotraders.com</p>
                <p>Phone: +94 77 123 4567</p>
                <p>Address: 123 Main Street, Colombo, Sri Lanka</p>
              </div>
            </div>

            {/* Back Link */}
            <div className="pt-8 border-t border-border">
              <Link
                href="/"
                className="text-primary hover:text-primary/80 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
      </section>

      {/* Chatbot Icon */}
      <ChatBot />

      <Footer />
    </div>
  );
}

