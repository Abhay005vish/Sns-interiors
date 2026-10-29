import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteSettings } from "../../../context/SiteSettingsContext";

export function Hero() {
  const { settings } = useSiteSettings();
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920)',
        }}
      />

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20 text-center text-white">
        <div className="mx-auto max-w-5xl">

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="font-heading text-[3.2rem] font-semibold leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Premium Interiors,
            <br />
            Timeless Furniture
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto mt-6 max-w-3xl px-2 text-[0.95rem] leading-relaxed text-white/85 sm:px-0 sm:text-lg md:text-xl"
          >
            Transform your space with Mumbai's trusted interior design experts
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4"
          >
            <Link
              to="/consultation"
              className="group inline-flex w-full max-w-[280px] sm:w-auto sm:min-w-[230px] items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 font-semibold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Book Free Consultation
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full max-w-[280px] sm:w-auto sm:min-w-[190px] items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/60 md:flex"
          >
            <span>Scroll to explore</span>
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="h-8 w-px bg-white/50"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}