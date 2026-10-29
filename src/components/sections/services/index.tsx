import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Complete Interior Design',
    description:
      'Transform your entire home with our comprehensive design solutions.',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
    features: [
      '3D visualization',
      'Space planning',
      'Color consultation',
      'Material selection',
      'Project management',
    ],
    price: 'Starting from ₹5L',
  },
  {
    title: 'Custom Furniture',
    description:
      'Bespoke furniture designed and crafted specifically for your space.',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
    features: [
      'Custom designs',
      'Premium materials',
      'Expert craftsmanship',
      'Personalized finishes',
      'Professional installation',
    ],
    price: 'Starting from ₹50K',
  },
  {
    title: 'Modular Kitchen',
    description:
      'Functional and elegant kitchens designed around your lifestyle.',
    image:
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200',
    features: [
      'Modern layouts',
      'Premium hardware',
      'Storage optimization',
      'Countertop selection',
      'Complete installation',
    ],
    price: 'Starting from ₹2.5L',
  },
  {
    title: 'Wardrobes & Storage',
    description:
      'Smart storage solutions that combine functionality with timeless design.',
    image:
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1200',
    features: [
      'Walk-in wardrobes',
      'Sliding wardrobes',
      'Built-in storage',
      'Custom interiors',
      'Premium finishes',
    ],
    price: 'Starting from ₹75K',
  },
];

export function ServicesSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            What We Do
          </p>

          <h2 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
            Complete Interior Solutions
          </h2>

          <p className="mt-5 text-lg text-muted-foreground">
            From concept to completion, we create beautiful spaces designed
            around you.
          </p>
        </div>

        <div className="space-y-20">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                index % 2 !== 0 ? 'md:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-[360px] w-full object-cover transition-transform duration-700 hover:scale-105 md:h-[430px]"
                />
              </div>

              <div>
                <h3 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
                  {service.title}
                </h3>

                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  {service.description}
                </p>

                <div className="mt-7 space-y-3">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <span className="font-semibold text-primary">
                    {service.price}
                  </span>

                  <Link
                    to="/quote"
                    className="inline-flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    Get Quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
