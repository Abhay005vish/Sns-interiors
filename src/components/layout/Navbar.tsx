import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MessageCircle, Phone, X } from 'lucide-react';
import { useSiteSettings } from "../../context/SiteSettingsContext";

const navigation = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const { settings } = useSiteSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
  className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
    isScrolled
      ? 'border-b border-white/10 bg-black/35 shadow-lg backdrop-blur-xl'
      : 'border-b border-transparent bg-transparent backdrop-blur-0'
  }`}
>
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex flex-col leading-none"
          aria-label="SnS Interiors - Home"
        >
          <span
            className={`font-heading text-2xl font-semibold tracking-tight transition-colors duration-300 ${
              isScrolled
                ? 'text-white'
                : 'text-white'
            }`}
          >
           {settings.businessName}
          </span>

          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-white/70">
            {settings.tagline}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative py-2 text-sm font-medium transition-colors duration-300 ${
                isActive(item.path)
                  ? 'text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {item.label}

              {isActive(item.path) && (
                <span className="absolute inset-x-0 -bottom-1 mx-auto h-px w-5 bg-accent" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 sm:flex">
          <a
           href={`tel:${settings.phone.replace(/\D/g, "")}`} 
            className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-all duration-300 ${
              isScrolled
                ? 'border border-white/20 bg-white/5 text-white hover:border-accent hover:bg-white/10'
                : 'border border-white/60 bg-black/10 text-white backdrop-blur-sm hover:bg-white/10'
            }`}
            aria-label="Call SnS Interiors"
          >
            <Phone className="h-4 w-4" />
            <span>Call Us</span>
          </a>

          <a
            href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md"
            aria-label="Contact SnS Interiors on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-black/10 text-white backdrop-blur-sm transition-colors hover:border-white/60 sm:hidden"
          aria-label={
            isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-black/70 px-5 pb-5 pt-3 backdrop-blur-xl sm:hidden"
        >
          <div className="flex flex-col">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`border-b border-white/10 py-4 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-accent'
                    : 'text-white hover:text-accent'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="grid grid-cols-2 gap-3 pt-5">
              <a
                href={`tel:${settings.phone.replace(/\D/g, "")}`}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/30 text-sm font-medium text-white transition-colors hover:border-white"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}