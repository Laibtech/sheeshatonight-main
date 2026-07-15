'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flame, ChevronDown, Quote, Phone } from 'lucide-react';

export interface Package {
  name: string;
  price: number;
  image: string;
  popular?: boolean;
  features: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  text: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export default function InteractiveContent({
  packages,
  testimonials,
  faqs,
}: {
  packages: Package[];
  testimonials: Testimonial[];
  faqs: Faq[];
}) {
  const [packageType, setPackageType] = useState('');
  const [flavor, setFlavor] = useState('');
  const [location, setLocation] = useState('');
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) =>
      prev.includes(index)
        ? prev.filter((faqIndex) => faqIndex !== index)
        : [...prev, index]
    );
  };

  return (
    <div>
      {/* Package Selection Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            Choose Your Perfect Sheesha Experience
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Select from our curated packages designed for every occasion
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`rounded-lg border transition-all cursor-pointer ${
                  packageType === pkg.name
                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                    : 'border-border hover:border-primary'
                }`}
                onClick={() => setPackageType(pkg.name)}
              >
                <div className="relative pb-[100%]">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {pkg.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">
                      ₹{pkg.price}
                    </span>
                    <span className="text-muted-foreground ml-2">/event</span>
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Flame className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full mt-6 py-2 rounded-lg font-semibold transition-all ${
                      packageType === pkg.name
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-foreground hover:bg-primary/10'
                    }`}
                  >
                    {packageType === pkg.name ? 'Selected' : 'Select Package'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            What Our Clients Say
          </h2>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <Quote className="w-12 h-12 text-primary opacity-20" />
            </div>
            <p className="text-center text-lg text-foreground mb-6">
              {testimonials[activeTestimonial]?.text}
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src={testimonials[activeTestimonial]?.image}
                alt={testimonials[activeTestimonial]?.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-foreground">
                  {testimonials[activeTestimonial]?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[activeTestimonial]?.role}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial
                      ? 'bg-primary w-8'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-semibold text-foreground text-left">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openFaqs.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqs.includes(index) && (
                  <div className="p-4 bg-secondary/20 border-t border-border">
                    <p className="text-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/90">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Celebrate?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Book your sheesha experience today and make your event unforgettable
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
}
