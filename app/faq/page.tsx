import FAQInteractiveList, {
  FAQCategory,
} from "@/components/faq/faq-interactive-list";

const faqData: FAQCategory[] = [
  {
    category: "Buying Process",
    items: [
      {
        question: "How do I purchase a vehicle from Sameera Auto Traders?",
        answer:
          "Browse our vehicles online, select your preferred car, and book a consultation. Our team will guide you through the entire process including test drives, financing options, and paperwork.",
      },
      {
        question: "Can I trade in my current vehicle?",
        answer:
          "Yes! We accept trade-ins. Bring your current vehicle for evaluation, and we'll provide a fair market value that can be applied towards your new purchase.",
      },
      {
        question: "Do you offer financing options?",
        answer:
          "We work with multiple financial institutions to offer competitive financing rates. Our team can help you find the best loan terms that fit your budget.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept cash, bank transfers, certified checks, and financing through our partner banks. Credit card payments are available for deposits.",
      },
    ],
  },
  {
    category: "Vehicle Information",
    items: [
      {
        question: "Are all vehicles inspected before sale?",
        answer:
          "Yes, every vehicle undergoes a comprehensive 150-point inspection covering engine, transmission, brakes, suspension, electrical systems, and safety features.",
      },
      {
        question: "Do you provide vehicle history reports?",
        answer:
          "Absolutely. We provide detailed history reports including previous ownership, accident history, service records, and mileage verification for all our vehicles.",
      },
      {
        question: "Can I test drive a vehicle?",
        answer:
          "Yes! Test drives are highly encouraged. Schedule a consultation, and we'll arrange a comprehensive test drive at your convenience.",
      },
      {
        question: "What if I find an issue after purchase?",
        answer:
          "All our vehicles come with warranty options. If you encounter any issues, contact us immediately and we'll address them according to your warranty terms.",
      },
    ],
  },
  {
    category: "Warranty & Support",
    items: [
      {
        question: "What warranty do you offer?",
        answer:
          "We offer various warranty packages ranging from 3 months to 2 years, covering major components like engine, transmission, and electrical systems. Extended warranties are also available.",
      },
      {
        question: "What does the warranty cover?",
        answer:
          "Our standard warranty covers engine, transmission, drivetrain, electrical systems, and major mechanical components. Exclusions include wear-and-tear items like tires and brake pads.",
      },
      {
        question: "Do you provide after-sales service?",
        answer:
          "Yes, we have a dedicated service center for maintenance and repairs. Warranty customers receive priority service appointments and discounted labor rates.",
      },
      {
        question: "Can I extend my warranty?",
        answer:
          "Yes, extended warranty plans are available before your original warranty expires. Contact our service team for pricing and coverage details.",
      },
    ],
  },
  {
    category: "Documentation",
    items: [
      {
        question: "What documents do I need to purchase a vehicle?",
        answer:
          "You'll need a valid driver's license, proof of address, proof of income (for financing), and insurance information. Our team will guide you through all required paperwork.",
      },
      {
        question: "How long does the registration process take?",
        answer:
          "Vehicle registration typically takes 7-14 business days. We handle all registration paperwork on your behalf and will notify you when everything is complete.",
      },
      {
        question: "Do you handle title transfers?",
        answer:
          "Yes, we manage the entire title transfer process. Our documentation team ensures all paperwork is completed accurately and submitted to the relevant authorities.",
      },
      {
        question: "Can I drive the vehicle before registration is complete?",
        answer:
          "Yes, we provide temporary registration plates that allow you to legally drive your vehicle while permanent registration is being processed.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Find answers to common questions about buying vehicles, warranties,
            and our services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Client Component Injection */}
          <FAQInteractiveList faqData={faqData} />

          {/* Contact Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center mt-12">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Can't find the answer you're looking for? Our team is here to
              help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/consultation"
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
              >
                Book Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
