import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../../components/seo/SEO";
import {
  ArrowRight,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { apiFetch } from "../../../utils/supabase/api";
type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  pricing: string;
  active: boolean;
  order: number;
};


export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch(
        "/make-server-664a60c7/services"
      );

      const publishedServices = (
        data.services || []
      )
        .filter(
          (service: Service) =>
            service.active !== false
        )
        .sort(
          (a: Service, b: Service) =>
            Number(a.order || 0) -
            Number(b.order || 0)
        );

      setServices(publishedServices);
    } catch (err: any) {
      console.error("Failed to load services:", err);
      setError(
        err.message || "Unable to load services"
      );
    } finally {
      setLoading(false);
    }
  };

  loadServices();
}, []);
    return (
    <>
      <SEO
        title="Interior Design Services | SnS Interiors"
        description="Explore SnS Interiors services including home interior design, custom furniture and modular kitchen solutions for modern homes."
      />

      <div className="min-h-screen">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative h-[50vh] min-h-[420px] flex items-center justify-center overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920)",
            filter: "brightness(0.4)",
          }}
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 text-center text-white px-6">

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="text-5xl md:text-6xl font-heading font-bold mb-6"
          >
            Our Services
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Complete interior solutions from design
            to installation
          </motion.p>

        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="py-20 bg-background">

        <div className="container mx-auto px-6">

          {/* Loading */}

          {loading && (
            <div className="py-20 text-center">

              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-4 text-primary" />

              <p className="text-muted-foreground">
                Loading our services...
              </p>

            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="max-w-xl mx-auto py-16 text-center">

              <div className="border border-red-200 bg-red-50 rounded-xl p-6">

                <p className="text-red-700 font-medium">
                  Unable to load services
                </p>

                <p className="text-sm text-red-600 mt-2">
                  {error}
                </p>

              </div>

            </div>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            services.length === 0 && (
              <div className="py-20 text-center">

                <p className="text-lg font-medium">
                  Our services are being updated.
                </p>

                <p className="text-muted-foreground mt-2">
                  Please check back shortly.
                </p>

              </div>
            )}

          {/* Service List */}

          {!loading &&
            !error &&
            services.length > 0 && (
              <div className="space-y-20">

                {services.map(
                  (service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{
                        opacity: 0,
                        y: 35,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.65,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      className={`flex flex-col ${
                        index % 2 === 0
                          ? "md:flex-row"
                          : "md:flex-row-reverse"
                      } gap-8 lg:gap-14 items-center`}
                    >

                      {/* IMAGE */}

                      <div className="w-full md:w-1/2">

                        <div className="group rounded-2xl overflow-hidden shadow-lg bg-muted">

                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                              loading={
                                index === 0
                                  ? "eager"
                                  : "lazy"
                              }
                            />
                          ) : (
                            <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center text-muted-foreground">
                              No image available
                            </div>
                          )}

                        </div>

                      </div>

                      {/* CONTENT */}

                      <div className="w-full md:w-1/2">

                        <div className="max-w-xl">

                          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
                            SnS Interiors
                          </p>

                          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-5">
                            {service.title}
                          </h2>

                          <p className="text-muted-foreground text-lg leading-relaxed mb-7">
                            {service.description}
                          </p>

                          {/* FEATURES */}

                          {service.features?.length > 0 && (
                            <ul className="space-y-3 mb-8">

                              {service.features.map(
                                (
                                  feature,
                                  featureIndex
                                ) => (
                                  <li
                                    key={`${service.id}-${featureIndex}`}
                                    className="flex items-start gap-3"
                                  >

                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />

                                    <span>
                                      {feature}
                                    </span>

                                  </li>
                                )
                              )}

                            </ul>
                          )}

                          {/* PRICE + CTA */}

                          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                            {service.pricing && (
                              <p className="text-xl font-semibold text-primary">
                                {service.pricing}
                              </p>
                            )}

                            <Link
                              to="/quote"
                              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all group"
                            >
                              Get Quote

                              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>

                          </div>

                        </div>

                      </div>

                    </motion.div>
                  )
                )}

              </div>
            )}

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="py-20 bg-card border-t border-border">

        <div className="container mx-auto px-6 text-center">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
          >

            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
              Let's Create Together
            </p>

            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Need a Custom Solution?
            </h2>

            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              We can combine multiple services or create
              a completely custom package for your unique
              requirements.
            </p>

            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all group"
            >
              Book Free Consultation

              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

          </motion.div>

        </div>

      </section>

          </div>
    </>
  );
}