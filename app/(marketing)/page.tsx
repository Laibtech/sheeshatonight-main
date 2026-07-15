import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import { CheckCircle, Truck, Flame, Users, Check } from 'lucide-react';
import InteractiveContent from './InteractiveContent';

const packages = [
  {
    name: 'Silver Sheesha Setup',
    price: 999,
    image: '/silver.webp',
    features: [
      '4 Sheesha units',
      '1 professional Sheesha master',
      '4 premium flavours',
      'Unlimited charcoal and head changes',
      'Portable burner',
      'Free Delivery',
      '3 hours of service plus 1 extra free hour'
    ]
  },
  {
    name: 'Gold Sheesha Setup',
    price: 1299,
    image: '/gold.webp',
    popular: true,
    features: [
      '6 Sheesha units',
      '2 professional Sheesha masters',
      '6 premium flavours',
      'Unlimited charcoal and head changes',
      'Premium portable burners',
      'Free Delivery',
      '4 hours of service plus 1 extra free hour'
    ]
  },
  {
    name: 'Platinum Sheesha Setup',
    price: 1899,
    image: '/platinum.webp',
    features: [
      '10 Sheesha units',
      '3 professional Sheesha masters',
      'All flavours available',
      'VIP setup and customization',
      'Premium ambiance lighting',
      'Free Delivery',
      '6 hours of premium service'
    ]
  }
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Event Organizer',
    image: '/testimonial1.jpg',
    text: 'Sheesha Tonight made our corporate event absolutely unforgettable! The professionalism and quality were outstanding.'
  },
  {
    name: 'Raj Patel',
    role: 'Wedding Planner',
    image: '/testimonial2.jpg',
    text: 'The team went above and beyond. Our clients were thrilled with the sheesha experience at the wedding reception!'
  },
  {
    name: 'Neha Desai',
    role: 'Party Host',
    image: '/testimonial3.jpg',
    text: 'Best decision for my birthday bash! Everyone is still talking about the amazing sheesha setup and service.'
  }
];

const faqs = [
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 2-3 weeks in advance, especially for peak season (Oct-Dec). However, we can accommodate last-minute bookings based on availability.'
  },
  {
    question: 'What is included in the package?',
    answer: 'Each package includes sheesha units, professional masters, premium flavours, charcoal, and service duration as specified. Delivery is free within the city.'
  },
  {
    question: 'Can I customize my package?',
    answer: 'Absolutely! We can customize any package based on your specific needs and budget. Contact our team for personalized quotes.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: '50% refund if cancelled 2 weeks before the event. No refunds for cancellations within 1 week, except in case of emergencies.'
  },
  {
    question: 'Do you serve outside the city?',
    answer: 'Yes! We serve areas within a 50km radius. Additional delivery charges may apply. Contact us for details.'
  }
];

export default function LandingPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
            Transform Your Events with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Premium Sheesha Experience
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Professional sheesha setups for weddings, corporate events, parties, and special celebrations
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link
              href="/contact"
              className="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              Book Your Event
            </Link>
            <Link
              href="#packages"
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition-colors"
            >
              Explore Packages
            </Link>
          </div>

          {/* Features Row */}
          <div className="grid md:grid-cols-4 gap-4 mt-16">
            <div className="flex items-center gap-3 justify-center">
              <Truck className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">Free Delivery</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Users className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">Expert Masters</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Flame className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">Premium Quality</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <CheckCircle className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-xl" />
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose Sheesha Tonight?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-background rounded-lg border border-border hover:border-primary transition-colors">
              <Flame className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Premium Quality
              </h3>
              <p className="text-muted-foreground">
                We only use the finest imported sheesha units and premium flavours sourced from trusted suppliers.
              </p>
            </div>

            <div className="p-8 bg-background rounded-lg border border-border hover:border-primary transition-colors">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Professional Masters
              </h3>
              <p className="text-muted-foreground">
                Our certified sheesha masters have years of experience and ensure the best smoking experience.
              </p>
            </div>

            <div className="p-8 bg-background rounded-lg border border-border hover:border-primary transition-colors">
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Complete Packages
              </h3>
              <p className="text-muted-foreground">
                Everything is included - setup, service, cleanup, and support for a hassle-free experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Content Section */}
      <InteractiveContent
        packages={packages}
        testimonials={testimonials}
        faqs={faqs}
      />
    </PageLayout>
  );
}
