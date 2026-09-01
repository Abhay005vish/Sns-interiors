import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-heading font-bold mb-4"
          >
            About SnS Interiors
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-primary-foreground/90 max-w-2xl mx-auto"
          >
            Mumbai's trusted name in premium interior design since 2010
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
            >
              <div>
                <h2 className="text-3xl font-heading font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2010 by Sunita and Sanjay Nair, SnS Interiors began as a small design
                  studio in Bandra, Mumbai. What started as a passion project quickly grew into one of
                  the city's most respected interior design firms.
                </p>
                <p className="text-muted-foreground mb-4">
                  Over the past decade we have transformed more than 500 homes and offices across
                  Mumbai — from cozy 1BHK apartments in Andheri to sprawling sea-facing penthouses in
                  Worli — always staying true to our belief that great design should be beautiful,
                  functional, and accessible.
                </p>
                <p className="text-muted-foreground">
                  Today our team of 25 designers, craftspeople, and project managers work together to
                  deliver end-to-end interior solutions that exceed expectations, on time and within
                  budget.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"
                  alt="SnS Interiors studio"
                  className="w-full h-80 object-cover"
                />
              </div>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-heading font-bold text-center mb-12">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Quality First',
                    description:
                      'We source premium materials and partner with skilled craftspeople to ensure every detail is perfect.'
                  },
                  {
                    title: 'Transparent Pricing',
                    description:
                      'No hidden costs, no surprises. We provide clear, itemised quotes so you always know where your money goes.'
                  },
                  {
                    title: 'On-Time Delivery',
                    description:
                      'We respect your time. Our project managers ensure every milestone is hit and your home is ready when promised.'
                  }
                ].map((value, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg border border-border text-center">
                    <h3 className="text-xl font-heading font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Let's Work Together</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Ready to transform your space? Book a free consultation with our team today.
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
