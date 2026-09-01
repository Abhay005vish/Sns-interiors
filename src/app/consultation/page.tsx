import { useState } from 'react';
import { CheckCircle, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function Consultation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    propertyType: '2bhk'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-664a60c7/consultations`,
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
      console.error('Error booking consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Free on-site visit',
    'Expert design consultation',
    'Space planning advice',
    'Material recommendations',
    'Budget estimation',
    'Timeline discussion'
  ];

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
            Book Free Consultation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-primary-foreground/90 max-w-2xl mx-auto"
          >
            Meet our design experts and bring your vision to life
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-heading font-bold mb-6">What to Expect</h2>
              <p className="text-muted-foreground mb-8">
                Our free consultation is designed to understand your needs and provide expert guidance
                for your interior design project.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-card p-6 rounded-lg border border-border mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3 className="font-heading font-semibold text-lg">Available Days</h3>
                </div>
                <p className="text-muted-foreground">Monday to Saturday, 10 AM - 7 PM</p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="font-heading font-semibold text-lg">Duration</h3>
                </div>
                <p className="text-muted-foreground">Approximately 60-90 minutes</p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {submitted ? (
                <div className="bg-primary/10 border border-primary rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-2">Consultation Booked!</h3>
                  <p className="text-muted-foreground mb-6">
                    We've received your request. Our team will call you within 24 hours to confirm
                    the appointment details.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        date: '',
                        time: '',
                        propertyType: '2bhk'
                      });
                    }}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                  >
                    Book Another Consultation
                  </button>
                </div>
              ) : (
                <div className="bg-card p-8 rounded-lg border border-border">
                  <h3 className="text-2xl font-heading font-bold mb-6">Schedule Your Visit</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                      <label htmlFor="date" className="block mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label htmlFor="time" className="block mb-2">
                        Preferred Time *
                      </label>
                      <select
                        id="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select a time</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? 'Booking...' : 'Book Consultation'}
                    </button>

                    <p className="text-sm text-muted-foreground text-center">
                      Our team will call you within 24 hours to confirm the appointment
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
