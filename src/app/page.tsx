import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const services = [
    {
      title: 'Interior Design',
      description: 'Complete home design solutions tailored to your lifestyle',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600'
    },
    {
      title: 'Custom Furniture',
      description: 'Bespoke furniture designed and crafted for your space',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'
    },
    {
      title: 'Modular Kitchen',
      description: 'Functional and stylish kitchen solutions',
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600'
    }
  ];

  const pricingPackages = [
    {
      name: 'Essential',
      budget: '₹5L - ₹8L',
      property: '2BHK',
      features: ['Complete Interior Design', 'Modular Kitchen', 'Wardrobe', '1 Year Warranty']
    },
    {
      name: 'Premium',
      budget: '₹8L - ₹12L',
      property: '3BHK',
      features: ['Premium Materials', 'Custom Furniture', 'Lighting Design', '2 Year Warranty'],
      popular: true
    },
    {
      name: 'Luxury',
      budget: '₹12L+',
      property: '3BHK+',
      features: ['Luxury Finishes', 'Designer Furniture', 'Smart Home Integration', '3 Year Warranty']
    }
  ];

  const process = [
    { step: 1, title: 'Consultation', description: 'Free design consultation at your property' },
    { step: 2, title: 'Design', description: '3D visualization and material selection' },
    { step: 3, title: 'Execution', description: 'Professional installation with timeline' },
    { step: 4, title: 'Handover', description: 'Quality check and warranty activation' }
  ];

  const faqs = [
    {
      question: 'How long does a typical project take?',
      answer: '2BHK projects typically take 45-60 days, while 3BHK projects take 60-90 days from design approval.'
    },
    {
      question: 'Do you provide warranty?',
      answer: 'Yes, we provide 1-3 year warranty depending on your package, covering materials and workmanship.'
    },
    {
      question: 'What is included in the pricing?',
      answer: 'Our pricing includes design, materials, furniture, installation, and project management. No hidden costs.'
    },
    {
      question: 'Can I customize the packages?',
      answer: 'Absolutely! Our packages are flexible and can be customized to match your specific requirements and budget.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920)',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-heading font-bold mb-6"
          >
            Premium Interiors,
            <br />
            Timeless Furniture
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            Transform your space with Mumbai's trusted interior design experts
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/consultation"
              className="px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-lg font-semibold hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              End-to-end interior solutions from design to installation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-heading font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the package that fits your budget and requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPackages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                <h3 className="text-2xl font-heading font-bold mb-2">{pkg.name}</h3>
                <p className={`text-sm mb-4 ${pkg.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {pkg.property}
                </p>
                <p className="text-3xl font-bold mb-6">{pkg.budget}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${pkg.popular ? '' : 'text-primary'}`} />
                      <span>{feature}</span>
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
                  Get Quote
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View Detailed Pricing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Our Process</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple, transparent, and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Get started with a free consultation and see how we can bring your vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/consultation"
              className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+919876543210"
              className="px-8 py-4 bg-primary-foreground/10 backdrop-blur-sm border-2 border-white rounded-lg font-semibold hover:bg-primary-foreground/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call +91 98765 43210
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
