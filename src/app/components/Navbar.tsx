import { Link } from 'react-router-dom';
import { Phone, MessageCircle } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-heading font-bold text-primary">
            SnS Interiors
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link to="/gallery" className="text-foreground hover:text-primary transition-colors">
              Gallery
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call Us</span>
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
