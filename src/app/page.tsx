import { Link } from 'react-router-dom';
import { SEO } from '../components/seo/SEO';
import {
  ArrowRight,
  CheckCircle,
  Phone,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Hero } from '../components/sections/hero';

export default function Home() {
  const services = [
    {
      title: 'Interior Design',
      description:
        'Complete home design solutions tailored to your lifestyle.',
      image:
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900',
    },
    {
      title: 'Custom Furniture',
      description:
        'Bespoke furniture designed and crafted specifically for your space.',
      image:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900',
    },
    {
      title: 'Modular Kitchen',
      description:
        'Functional, elegant and practical kitchen solutions for modern homes.',
      image:
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=900',
    },
  ];

  const pricingPackages = [
    {
      name: 'Essential',
      budget: '₹5L - ₹8L',
      property: '2BHK',
      features: [
        'Complete Interior Design',
        'Modular Kitchen',
        'Wardrobe',
        '1 Year Warranty',
      ],
    },
    {
      name: 'Premium',
      budget: '₹8L - ₹12L',
      property: '3BHK',
      features: [
        'Premium Materials',
        'Custom Furniture',
        'Lighting Design',
        '2 Year Warranty',
      ],
      popular: true,
    },
    {
      name: 'Luxury',
      budget: '₹12L+',
      property: '3BHK+',
      features: [
        'Luxury Finishes',
        'Designer Furniture',
        'Smart Home Integration',
        '3 Year Warranty',
      ],
    },
  ];

  const process = [
    {
      step: 1,
      title: 'Consultation',
      description: 'Free design consultation at your property.',
    },
    {
      step: 2,
      title: 'Design',
      description: '3D visualization and material selection.',
    },
    {
      step: 3,
      title: 'Execution',
      description: 'Professional installation with a clear timeline.',
    },
    {
      step: 4,
      title: 'Handover',
      description: 'Quality check and warranty activation.',
    },
  ];

  const faqs = [
    {
      question: 'How long does a typical project take?',
      answer:
        '2BHK projects typically take 45-60 days, while 3BHK projects take 60-90 days from design approval.',
    },
    {
      question: 'Do you provide warranty?',
      answer:
        'Yes, we provide 1-3 year warranty depending on your package, covering materials and workmanship.',
    },
    {
      question: 'What is included in the pricing?',
      answer:
        'Our pricing includes design, materials, furniture, installation, and project management. No hidden costs.',
    },
    {
      question: 'Can I customize the packages?',
      answer:
        'Absolutely! Our packages are flexible and can be customized to match your specific requirements and budget.',
    },
  ];

  return (
  <>
    <SEO
      title="SnS Interiors | Premium Interiors, Timeless Furniture"
      description="SnS Interiors creates premium home interiors, custom furniture and modular kitchens for modern 2BHK and 3BHK homes."
    />

    <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      name: "SnS Interiors",
      url: "https://snsinteriors.in/",
      description:
        "Premium interior design, custom furniture and modular kitchen solutions for modern homes.",
      slogan: "Premium Interiors, Timeless Furniture",
      areaServed: {
        "@type": "City",
        name: "Mumbai",
      },
      serviceType: [
        "Home Interior Design",
        "2BHK Interior Design",
        "3BHK Interior Design",
        "Modular Kitchen Design",
        "Custom Furniture",
      ],
    }),
  }}
/>

    <div className="min-h-screen">

      {/* ==================== HERO ==================== */}
      <Hero />

      {/* ==================== SERVICES ==================== */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              What We Do
            </p>

            <h2 className="font-heading text-4xl font-semibold md:text-5xl">
              Our Services
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              End-to-end interior solutions designed around your lifestyle,
              space and vision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                }}
                className="group"
              >
                <div className="relative mb-6 h-[420px] overflow-hidden rounded-2xl">

                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                    <h3 className="font-heading text-3xl font-semibold">
                      {service.title}
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/85">
                      {service.description}
                    </p>

                    <Link
                      to="/services"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
                    >
                      Explore Service
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border-b border-primary pb-1 font-semibold text-primary transition-all hover:gap-3"
            >
              View All Services
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== PRICING ==================== */}
      <section className="bg-card py-24">
        <div className="container mx-auto px-6">

          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Investment
            </p>

            <h2 className="font-heading text-4xl font-semibold md:text-5xl">
              Transparent Pricing
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Choose a package that fits your home, requirements and budget.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {pricingPackages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className={`relative rounded-2xl p-8 ${
                  pkg.popular
                    ? 'bg-primary text-primary-foreground shadow-2xl md:scale-105'
                    : 'border border-border bg-background'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Most Popular
                  </div>
                )}

                <h3 className="font-heading text-2xl font-semibold">
                  {pkg.name}
                </h3>

                <p
                  className={`mt-2 text-sm ${
                    pkg.popular
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {pkg.property}
                </p>

                <p className="mt-6 text-4xl font-semibold">
                  {pkg.budget}
                </p>

                <div className="my-8 h-px bg-current opacity-10" />

                <ul className="space-y-4">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/quote"
                  className={`mt-8 block w-full rounded-lg py-3 text-center font-semibold transition-opacity hover:opacity-90 ${
                    pkg.popular
                      ? 'bg-white text-primary'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  Get Quote
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:gap-3"
            >
              View Detailed Pricing
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== PROCESS ==================== */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-6">

          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              How It Works
            </p>

            <h2 className="font-heading text-4xl font-semibold md:text-5xl">
              Our Process
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Simple, transparent and hassle-free from the first conversation
              to final handover.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-4">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                  {item.step}
                </div>

                <h3 className="font-heading text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="bg-card py-24">
        <div className="container mx-auto px-6">

          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              FAQ
            </p>

            <h2 className="font-heading text-4xl font-semibold md:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                className="rounded-xl border border-border bg-background p-6"
              >
                <h3 className="font-heading text-lg font-semibold">
                  {faq.question}
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container mx-auto px-6 text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] opacity-80">
            Let's Create Something Beautiful
          </p>

          <h2 className="font-heading text-4xl font-semibold md:text-5xl">
            Ready to Transform Your Space?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg opacity-90">
            Get started with a free consultation and let us bring your vision
            to life.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/consultation"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-primary transition-opacity hover:opacity-90"
            >
              Book Free Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="tel:+91 92432 68385"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-semibold transition-colors hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />
              Call +91 92432 68385
            </a>
          </div>
        </div>
      </section>

        </div>
  </>
  );
}