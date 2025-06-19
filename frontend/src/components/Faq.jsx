import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
  {
    category: 'Shipping',
    items: [
      {
        question: 'How long does delivery take?',
        answer: 'Delivery usually takes 3–7 working days depending on your location.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'We currently only ship within India. Global shipping coming soon!',
      },
    ],
  },
  {
    category: 'Orders',
    items: [
      {
        question: 'How do I track my order?',
        answer: 'You can track your order from the “My Orders” section in your account or via the tracking link emailed to you.',
      },
      {
        question: 'Can I cancel my order?',
        answer: 'Yes, you can cancel your order before it is shipped. Contact support for help.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 7-day return window for unused items in original packaging.',
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are processed within 5–7 business days after receiving your return.',
      },
    ],
  },
  {
    category: 'Payments',
    items: [
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept UPI, Credit/Debit Cards, Net Banking, and PayPal for select products.',
      },
      {
        question: 'Is it safe to make payments on your site?',
        answer: 'Yes, our platform uses secure SSL encryption and verified payment gateways for complete protection.',
      },
    ],
  },
  {
    category: 'Account & Security',
    items: [
      {
        question: 'How do I reset my password?',
        answer: 'Go to the login page and click on “Forgot Password”. Follow the instructions to reset it via email.',
      },
      {
        question: 'Is my personal data secure?',
        answer: 'Yes, we follow strict data protection policies and never share your information with third parties.',
      },
    ],
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState({});

  const toggleQuestion = (catIndex, qIndex) => {
    setOpenIndex((prev) => ({
      ...prev,
      [catIndex + '-' + qIndex]: !prev[catIndex + '-' + qIndex],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">Frequently Asked Questions</h2>

      {faqData.map((section, catIndex) => (
        <div key={catIndex} className="mb-10">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4">{section.category}</h3>
          <div className="space-y-4">
            {section.items.map((item, qIndex) => {
              const isOpen = openIndex[catIndex + '-' + qIndex];
              return (
                <div
                  key={qIndex}
                  className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(catIndex, qIndex)}
                    className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-slate-50 transition"
                  >
                    <span className="text-base font-medium text-slate-700">{item.question}</span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-600">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
