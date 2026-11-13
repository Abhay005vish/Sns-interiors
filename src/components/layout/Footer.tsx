
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export function Footer() {
  const { settings } = useSiteSettings();

  const phoneNumber = settings.phone.replace(/\D/g, '');
  const whatsappNumber = settings.whatsapp.replace(/\D/g, '');

  return (
    <footer className="border-t border-border bg-[#111111] text-white">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center"
              aria-label="SnS Interiors Home"
            >
              <img
                src="/images/sns-logo.png"
                alt="SnS Interiors"
                className="mb-5 h-auto w-[270px] max-h-[115px] object-contain object-left"
              />
            </Link>

            <p className="mb-4 text-sm text-white/60">
              {settings.tagline}
            </p>

            <p className="text-sm leading-7 text-white/60">
              Transforming spaces with premium design, custom furniture
              and exceptional craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 font-heading text-lg font-semibold text-white">
              Quick Links
            </h4>

            <div className="space-y-3">
              <Link to="/" className="block text-sm text-white/60 transition-colors hover:text-accent">Home</Link>
              <Link to="/services" className="block text-sm text-white/60 transition-colors hover:text-accent">Services</Link>
              <Link to="/gallery" className="block text-sm text-white/60 transition-colors hover:text-accent">Gallery</Link>
              <Link to="/pricing" className="block text-sm text-white/60 transition-colors hover:text-accent">Pricing</Link>
              <Link to="/consultation" className="block text-sm text-white/60 transition-colors hover:text-accent">Book Consultation</Link>
              <Link to="/quote" className="block text-sm text-white/60 transition-colors hover:text-accent">Get Quote</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-5 font-heading text-lg font-semibold text-white">
              Our Services
            </h4>

            <div className="space-y-3 text-sm text-white/60">
              <p>Interior Design</p>
              <p>Custom Furniture</p>
              <p>Modular Kitchen</p>
              <p>Wardrobe Design</p>
              <p>Complete Renovation</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 font-heading text-lg font-semibold text-white">
              Contact Us
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm leading-6 text-white/60">
                  {settings.address}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <a
                  href={`tel:${phoneNumber}`}
                  className="text-sm text-white/60 transition-colors hover:text-accent"
                >
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <a
                  href={`mailto:${settings.email}`}
                  className="break-all text-sm text-white/60 transition-colors hover:text-accent"
                >
                  {settings.email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 shrink-0 text-accent" />
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 transition-colors hover:text-accent"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} SnS Interiors. All rights reserved.
          </p>
          <p className="mt-2 text-xs tracking-wider text-white/30">
            PREMIUM INTERIORS · TIMELESS FURNITURE
          </p>
        </div>
      </div>
    </footer>
  );
}
