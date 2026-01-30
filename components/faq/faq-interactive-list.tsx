"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  items: FAQItem[];
}

//Sub-Component for individual FAQ accordion item
function FAQAccordion({
  item,
  isOpen,
  onClick,
}: {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="font-semibold text-slate-900 dark:text-white pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQInteractiveList({
  faqData,
}: {
  faqData: FAQCategory[];
}) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-12">
      {faqData.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          {/* Category Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {category.category}
            </h2>
            <div className="h-1 w-16 bg-blue-600 rounded-full" />
          </div>

          {/* FAQ Items */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
            {category.items.map((item, itemIndex) => {
              const itemId = `${categoryIndex}-${itemIndex}`;
              return (
                <FAQAccordion
                  key={itemId}
                  item={item}
                  isOpen={openItems.includes(itemId)}
                  onClick={() => toggleItem(itemId)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
