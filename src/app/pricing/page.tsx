import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/seo/SEO';
import { motion } from 'motion/react';

export default function Pricing() {
  const packages = [
    {
      name: 'Essential',
      budget: '₹5L - ₹8L',
      property: '2BHK',
      description: 'Perfect for first-time homeowners looking for quality interiors',
      features: [
        'Complete Interior Design',
        'Modular Kitchen with standard hardware',
        'Master Bedroom Wardrobe',
        'TV Unit & Crockery Unit',
        'Foyer Shoe Rack',
        'Basic Lighting',
        '1 Year Warranty',
        'Project Timeline: 45-60 days'
      ],
      popular: false
    },
    {
      name: 'Premium',
      budget: '₹8L - ₹12L',
      property: '3BHK',
      description: 'Most popular choice for families seeking premium quality',
      features: [
        'Complete Interior Design with 3D Renders',
        'Premium Modular Kitchen with soft-close',
        '2 Wardrobes with accessories',
        'Living Room Furniture Package',
        'Study Unit',
        'Premium Lighting & Fixtures',
        'Window Blinds',
        '2 Year Warranty',
        'Project Timeline: 60-75 days'
      ],
      popular: true
    },
    {
      name: 'Luxury',
      budget: '₹12L+',
      property: '3BHK+',
      description: 'Ultimate luxury with premium materials and finishes',
      features: [
        'Luxury Interior Design with Designer Consultation',
        'Italian/German Kitchen Hardware',
        'Walk-in Wardrobe with Premium Accessories',
        'Custom Designer Furniture',
        'Home Theater Setup',
        'Smart Home Integration',
        'Premium Wallpapers & Paintings',
        'Imported Fixtures & Fittings',
        '3 Year Warranty',
        'Project Timeline: 75-90 days'
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'What is included in the price?',
      answer: 'Our pricing includes design, materials, furniture, installation, and project management. There are no hidden costs. Any customizations or premium upgrades will be discussed and quoted separately.'
    },
    {
      question: 'Do you offer payment plans?',
      answer: 'Yes! We offer flexible payment schedules: 30% on design approval, 40% on material procurement, and 30% on completion. We also partner with leading banks for EMI options.'
    },
    {
      question: 'Can I customize the packages?',
      answer: 'Absolutely! These packages are starting points. We can mix and match services, adjust materials, and customize based on your specific requirements and budget.'
    },
    {
      question: 'What about additional rooms?',
      answer: 'Additional rooms can be added to any package. Guest rooms, balconies, and study rooms are priced separately based on requirements.'
    },
    {
      question: 'How is the warranty handled?',
      answer: 'Our warranty covers both materials and workmanship. We provide free service visits during the warranty period for any manufacturing defects or installation issues.'
    }
  ];

  const addOns = [
    { name: 'Pooja Unit', price: 'From ₹40,000' },
    { name: 'Study Table & Storage', price: 'From ₹60,000' },
    { name: 'Balcony Design', price: 'From ₹80,000' },
    { name: 'Guest Room Package', price: 'From ₹1,50,000' },
    { name: 'False Ceiling (per room)', price: 'From ₹25,000' },
    { name: 'Wallpaper (per room)', price: 'From ₹15,000' }
  ];

  return (
  <>
    <SEO
      title="Interior Design Pricing | SnS Interiors"
      description="Explore SnS Interiors interior design packages and pricing for 2BHK, 3BHK and premium homes, including modular kitchens, furniture and installation."
    />

    <div className="min-h-screen">
      {/* existing Pricing page */}
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-heading font-bold mb-4"
          >
            Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-primary-foreground/90 max-w-2xl mx-auto"
          >
            No hidden costs. Clear packages. Flexible customization.
          </motion.p>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-lg ${
                  pkg.popular
                    ? 'bg-primary text-primary-foreground shadow-2xl scale-105'
                    : 'bg-card border border-border'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <h3 className="text-3xl font-heading font-bold mb-2">{pkg.name}</h3>
                <p className={`text-sm mb-4 ${pkg.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {pkg.property}
                </p>
                <p className="text-4xl font-bold mb-4">{pkg.budget}</p>
                <p className={`mb-6 ${pkg.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {pkg.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${pkg.popular ? '' : 'text-primary'}`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/quote"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-opacity ${
                    pkg.popular
                      ? 'bg-white text-primary hover:opacity-90'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  Get Custom Quote
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Add-ons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-3xl font-heading font-bold text-center mb-8">Popular Add-ons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addOns.map((addon, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-card rounded-lg border border-border"
                >
                  <span className="font-medium">{addon.name}</span>
                  <span className="text-primary font-semibold">{addon.price}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">Pricing FAQs</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-lg border border-border"
                >
                  <h3 className="font-heading font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Get a detailed quote customized for your space and requirements
          </p>
          <Link
            to="/quote"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Your Free Quote
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
        </div>
  </>
  );
}