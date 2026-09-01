import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function Quote() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: '2bhk',
    area: '',
    budget: '',
    services: [] as string[],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const serviceOptions = [
    'Complete Interior Design',
    'Modular Kitchen',
    'Wardrobes',
    'Living Room Furniture',
    'Bedroom Furniture',
    'False Ceiling',
    'Lighting Design',
    'Flooring',
    'Wallpaper & Painting'
  ];

  const handleServiceToggle = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.includes(service)
        ? formData.services.filter(s => s !== service)
        : [...formData.services, service]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-664a60c7/quotes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
    } finally {
      setLoading(false);
    }
  };

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
            Get Your Free Quote
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-primary-foreground/90 max-w-2xl mx-auto"
          >
            Tell us about your project and receive a detailed quote within 24 hours
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/10 border border-primary rounded-lg p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2">Quote Request Received!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for your interest! Our team will review your requirements and send you a
                  detailed quote within 24 hours.
                </p>
                <p className="text-muted-foreground mb-6">
                  You'll receive the quote via email at <strong>{formData.email}</strong>
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      propertyType: '2bhk',
                      area: '',
                      budget: '',
                      services: [],
                      description: ''
                    });
                  }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Request Another Quote
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-8 rounded-lg border border-border"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="propertyType" className="block mb-2">
                        Property Type *
                      </label>
                      <select
                        id="propertyType"
                        required
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="1bhk">1 BHK</option>
                        <option value="2bhk">2 BHK</option>
                        <option value="3bhk">3 BHK</option>
                        <option value="4bhk">4 BHK+</option>
                        <option value="villa">Villa</option>
                        <option value="office">Office</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="area" className="block mb-2">
                        Carpet Area (sq ft) *
                      </label>
                      <input
                        type="number"
                        id="area"
                        required
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g., 1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block mb-2">
                      Budget Range *
                    </label>
                    <select
                      id="budget"
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select your budget</option>
                      <option value="5-8">₹5L - ₹8L</option>
                      <option value="8-12">₹8L - ₹12L</option>
                      <option value="12-15">₹12L - ₹15L</option>
                      <option value="15+">₹15L+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-3">Services Required *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {serviceOptions.map((service) => (
                        <label
                          key={service}
                          className="flex items-center gap-3 p-3 bg-input-background rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span>{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block mb-2">
                      Project Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Tell us more about your requirements, preferences, or any specific ideas you have..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || formData.services.length === 0}
                    className="w-full px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Get Free Quote'}
                  </button>

                  <p className="text-sm text-muted-foreground text-center">
                    You'll receive a detailed quote within 24 hours
                  </p>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
