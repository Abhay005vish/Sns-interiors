import { useState, useEffect } from 'react';
import { Users, Calendar, FileText, TrendingUp, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'consultations' | 'quotes'>('leads');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, leadsRes, consultationsRes, quotesRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-664a60c7/stats`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-664a60c7/leads`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-664a60c7/consultations`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-664a60c7/quotes`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        })
      ]);

      const statsData = await statsRes.json();
      const leadsData = await leadsRes.json();
      const consultationsData = await consultationsRes.json();
      const quotesData = await quotesRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (leadsData.success) setLeads(leadsData.leads);
      if (consultationsData.success) setConsultations(consultationsData.consultations);
      if (quotesData.success) setQuotes(quotesData.quotes);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-664a60c7/leads/${leadId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ status })
        }
      );

      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const updateConsultationStatus = async (consultationId: string, status: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-664a60c7/consultations/${consultationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ status })
        }
      );

      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error updating consultation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your leads, consultations, and quotes</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-primary" />
              <h3 className="font-heading font-semibold">Total Leads</h3>
            </div>
            <p className="text-3xl font-bold">{stats?.totalLeads || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">{stats?.newLeads || 0} new</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-primary" />
              <h3 className="font-heading font-semibold">Consultations</h3>
            </div>
            <p className="text-3xl font-bold">{stats?.totalConsultations || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {stats?.scheduledConsultations || 0} scheduled
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-primary" />
              <h3 className="font-heading font-semibold">Quotes</h3>
            </div>
            <p className="text-3xl font-bold">{stats?.totalQuotes || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Requests received</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h3 className="font-heading font-semibold">Conversion</h3>
            </div>
            <p className="text-3xl font-bold">
              {stats?.totalLeads > 0
                ? Math.round((stats?.completedConsultations / stats?.totalLeads) * 100)
                : 0}
              %
            </p>
            <p className="text-sm text-muted-foreground mt-1">Lead to consultation</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg border border-border">
          <div className="border-b border-border">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === 'leads'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Leads ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('consultations')}
                className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === 'consultations'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Consultations ({consultations.length})
              </button>
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-4 py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === 'quotes'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Quotes ({quotes.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                {leads.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No leads yet</p>
                ) : (
                  leads.map((lead) => (
                    <div key={lead.id} className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-heading font-semibold text-lg">{lead.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="px-3 py-1 rounded-lg border border-border bg-card text-sm"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <a href={`tel:${lead.phone}`} className="hover:text-primary">
                            {lead.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <a href={`mailto:${lead.email}`} className="hover:text-primary">
                            {lead.email}
                          </a>
                        </div>
                        {lead.budget && (
                          <div className="text-muted-foreground">Budget: {lead.budget}</div>
                        )}
                      </div>

                      {lead.message && (
                        <p className="mt-3 text-sm text-muted-foreground">{lead.message}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Consultations Tab */}
            {activeTab === 'consultations' && (
              <div className="space-y-4">
                {consultations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No consultations booked yet
                  </p>
                ) : (
                  consultations.map((consultation) => (
                    <div key={consultation.id} className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-heading font-semibold text-lg">
                            {consultation.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(consultation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <select
                          value={consultation.status}
                          onChange={(e) =>
                            updateConsultationStatus(consultation.id, e.target.value)
                          }
                          className="px-3 py-1 rounded-lg border border-border bg-card text-sm"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="rescheduled">Rescheduled</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{consultation.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{consultation.time}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <a href={`tel:${consultation.phone}`} className="hover:text-primary">
                            {consultation.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <a
                            href={`mailto:${consultation.email}`}
                            className="hover:text-primary"
                          >
                            {consultation.email}
                          </a>
                        </div>
                      </div>

                      {consultation.propertyType && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          Property: {consultation.propertyType.toUpperCase()}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Quotes Tab */}
            {activeTab === 'quotes' && (
              <div className="space-y-4">
                {quotes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No quote requests yet
                  </p>
                ) : (
                  quotes.map((quote) => (
                    <div key={quote.id} className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-heading font-semibold text-lg">{quote.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                          {quote.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <a href={`tel:${quote.phone}`} className="hover:text-primary">
                            {quote.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <a href={`mailto:${quote.email}`} className="hover:text-primary">
                            {quote.email}
                          </a>
                        </div>
                        <div className="text-muted-foreground">
                          Property: {quote.propertyType?.toUpperCase()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm text-muted-foreground">
                        <div>Area: {quote.area} sq ft</div>
                        <div>Budget: {quote.budget}</div>
                      </div>

                      {quote.services && quote.services.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold mb-2">Services Required:</p>
                          <div className="flex flex-wrap gap-2">
                            {quote.services.map((service: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {quote.description && (
                        <p className="text-sm text-muted-foreground mt-3">{quote.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
