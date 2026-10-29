import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useSiteSettings } from "../../context/SiteSettingsContext";

export function Footer() {
   const { settings } = useSiteSettings();
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-heading font-bold text-primary mb-4">
  {settings.businessName}
</h3>
            <p className="text-muted-foreground mb-4">
  {settings.tagline}
</p>
            <p className="text-sm text-muted-foreground">
              Transforming spaces across Mumbai with premium design and craftsmanship.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/services" className="block text-muted-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/gallery" className="block text-muted-foreground hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link to="/pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="/consultation" className="block text-muted-foreground hover:text-primary transition-colors">
                Book Consultation
              </Link>
              <Link to="/quote" className="block text-muted-foreground hover:text-primary transition-colors">
                Get Quote
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>Interior Design</p>
              <p>Custom Furniture</p>
              <p>Modular Kitchen</p>
              <p>Wardrobe Design</p>
              <p>Complete Renovation</p>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">
                  {settings.address}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`tel:${settings.phone.replace(/\D/g, "")}`} className="text-muted-foreground hover:text-primary">
                 {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-primary">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SnS Interiors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
