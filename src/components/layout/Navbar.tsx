
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MessageCircle, Phone, X } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SnSLogo } from '../common/SnSLogo';

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

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => setIsMenuOpen(false);

  const phoneNumber = settings.phone.replace(/\D/g, '');
  const whatsappNumber = settings.whatsapp.replace(/\D/g, '');

  return (

<header
  className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
    isScrolled
      ? 'border-[#C9A46A]/30 bg-[#171614]/95 shadow-lg backdrop-blur-xl'
      : 'border-white/10 bg-[#171614]/85 backdrop-blur-md'
  }`}
>

      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Brand Logo */}
<Link
  to="/"
  aria-label="SnS Interiors Home"
  className="block w-[220px] sm:w-[270px] lg:w-[310px] shrink-0 border-0 bg-transparent shadow-none outline-none focus:outline-none focus-visible:outline-none"
>
  <SnSLogo />
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
                  : 'text-white/75 hover:text-white'
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
            href={`tel:${phoneNumber}`}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/30 bg-white/5 px-4 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-white/10"
            aria-label="Call SnS Interiors"
          >
            <Phone className="h-4 w-4" />
            <span>Call Us</span>
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}`}
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-colors hover:border-white/60 sm:hidden"
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
          className="border-t border-white/10 bg-black/95 px-5 pb-5 pt-3 shadow-xl backdrop-blur-xl sm:hidden"
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
                href={`tel:${phoneNumber}`}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/30 text-sm font-medium text-white transition-colors hover:border-white"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}`}
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
