import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-blue-100">
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
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 space-y-8">
            {/* Agreement to Terms */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                By accessing or using Sameera Auto Traders' website and
                services, you agree to be bound by these Terms of Service and
                all applicable laws and regulations. If you do not agree with
                any of these terms, you are prohibited from using or accessing
                this site.
              </p>
            </div>

            {/* Use License */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Use License
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                Permission is granted to temporarily access the materials on
                Sameera Auto Traders' website for personal, non-commercial use
                only. This is the grant of a license, not a transfer of title.
                Under this license, you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>
                  Transfer the materials to another person or mirror the
                  materials on any other server
                </li>
              </ul>
            </div>

            {/* Vehicle Purchases */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Vehicle Purchases
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    3.1 Pricing and Availability
                  </h3>
                  <p className="leading-relaxed">
                    All prices are subject to change without notice. We reserve
                    the right to refuse or cancel any order for any reason,
                    including vehicle availability, pricing errors, or suspected
                    fraud.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    3.2 Vehicle Condition
                  </h3>
                  <p className="leading-relaxed">
                    While we strive to accurately describe all vehicles, we make
                    no warranty regarding the condition, quality, or fitness for
                    a particular purpose. All vehicles are sold "as is" unless
                    otherwise stated in writing.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    3.3 Test Drives
                  </h3>
                  <p className="leading-relaxed">
                    Test drives are permitted only with valid driver's license
                    and insurance. You assume all liability during test drives.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Payment Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                Payment terms include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-4">
                <li>Full payment required before vehicle delivery</li>
                <li>
                  Deposits are non-refundable unless otherwise agreed in writing
                </li>
                <li>
                  Financing is subject to approval by our partner institutions
                </li>
                <li>
                  Additional fees may apply for registration, documentation, and
                  delivery
                </li>
              </ul>
            </div>

            {/* Warranty and Returns */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Warranty and Returns
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Warranty coverage varies by vehicle and is specified in the
                purchase agreement. Return policies, if applicable, are outlined
                in your sales contract. All warranty claims must be made in
                writing within the specified timeframe.
              </p>
            </div>

            {/* User Accounts */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. User Accounts
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                When creating an account, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Sameera Auto Traders shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages
                resulting from your use of our services. Our total liability
                shall not exceed the amount paid by you for the specific vehicle
                or service in question.
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Indemnification
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You agree to indemnify and hold harmless Sameera Auto Traders
                from any claims, damages, losses, liabilities, and expenses
                arising from your use of our services or violation of these
                Terms of Service.
              </p>
            </div>

            {/* Modifications */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Modifications to Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We reserve the right to modify these Terms of Service at any
                time. Changes will be effective immediately upon posting. Your
                continued use of the website constitutes acceptance of the
                modified terms.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. Governing Law
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of Sri Lanka. Any disputes shall be
                resolved in the courts of Colombo, Sri Lanka.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                11. Contact Information
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                For questions about these Terms of Service, contact us:
              </p>
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <p>Email: legal@sameeraautotraders.com</p>
                <p>Phone: +94 77 123 4567</p>
                <p>Address: 123 Main Street, Colombo, Sri Lanka</p>
              </div>
            </div>

            {/* Back Link */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
