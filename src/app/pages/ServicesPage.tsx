import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function ServicesPage() {
  const services = [
    {
      title: 'Complete Interior Design',
      description: 'Transform your entire home with our comprehensive design solutions',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
      features: [
        '3D visualization',
        'Space planning',
        'Color consultation',
        'Material selection',
        'Project management'
      ],
      pricing: 'Starting from ₹5L'
    },
    {
      title: 'Custom Furniture',
      description: 'Bespoke furniture designed and crafted specifically for your space',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      features: [
        'Custom designs',
        'Premium materials',
        'Expert craftsmanship',
        'Perfect fit guarantee',
        'Installation included'
      ],
      pricing: 'Custom pricing'
    },
    {
      title: 'Modular Kitchen',
      description: 'Functional and stylish kitchen solutions with premium finishes',
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
      features: [
        'Smart storage solutions',
        'Premium hardware',
        'Waterproof materials',
        'Chimney & appliances',
        '5-year warranty'
      ],
      pricing: 'From ₹2.5L'
    },
    {
      title: 'Wardrobe Design',
      description: 'Maximize your storage with custom wardrobe solutions',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      features: [
        'Space optimization',
        'Soft-close mechanisms',
        'Interior accessories',
        'Mirror options',
        'Durable finishes'
      ],
      pricing: 'From ₹80k'
    },
    {
      title: 'Living Room Design',
      description: 'Create the perfect space for relaxation and entertainment',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      features: [
        'TV unit design',
        'Sofa selection',
        'Lighting design',
        'Decor consultation',
        'Wall treatments'
      ],
      pricing: 'From ₹1.5L'
    },
    {
      title: 'Bedroom Design',
      description: 'Your personal sanctuary designed for comfort and style',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
      features: [
        'Bed & furniture',
        'Wardrobe integration',
        'Ambient lighting',
        'Window treatments',
        'Storage solutions'
      ],
      pricing: 'From ₹1.2L'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920)',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center text-white px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-6"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Complete interior solutions from design to installation
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 items-center`}
              >
                <div className="md:w-1/2">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                </div>

                <div className="md:w-1/2">
                  <h2 className="text-3xl font-heading font-bold mb-4">{service.title}</h2>
                  <p className="text-muted-foreground text-lg mb-6">{service.description}</p>

                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4">
                    <p className="text-xl font-semibold text-primary">{service.pricing}</p>
                    <Link
                      to="/quote"
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                      Get Quote
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            We can combine multiple services or create a completely custom package for your unique requirements
          </p>
          <Link
            to="/consultation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Book Free Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
