import { useEffect, useState } from 'react';
import { apiFetch } from "../../../utils/supabase/api";
import { supabase } from "../../lib/supabase";
import { AdminLogin } from "../../components/admin/AdminLogin";
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Phone,
  MessageCircle,
  LayoutDashboard,
  Image,
  Settings,
  LogOut,
  Search,
  Plus,
  Eye,
  XCircle,
  Home,
  Wrench,
  Bell,
  RefreshCw,
  Trash2,
} from 'lucide-react';





// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'consultation'
  | 'converted'
  | 'lost';

type ConsultationStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

type NavSection =
  | 'overview'
  | 'leads'
  | 'consultations'
  | 'quotes'
  | 'gallery'
  | 'services'
  | 'settings';

type Consultation = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  date: string;
  time: string;
  propertyType?: string | null;
  type: string;
  designer?: string | null;
  status: ConsultationStatus;
  createdAt?: string;
  updatedAt?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles / helpers
// ─────────────────────────────────────────────────────────────────────────────

const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  consultation:
    'bg-[#B58E5F]/10 text-[#8B6B4A] border-[#B58E5F]/30',
  converted: 'bg-green-50 text-green-700 border-green-200',
  lost: 'bg-red-50 text-red-600 border-red-200',
};

const CONSULT_STATUS_STYLES: Record<
  ConsultationStatus,
  string
> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  rescheduled:
    'bg-purple-50 text-purple-700 border-purple-200',
};

const SOURCE_ICON: Record<string, string> = {
  whatsapp: '💬',
  website: '🌐',
  referral: '⭐',
  instagram: '📸',
  phone: '📞',
};

const LEAD_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'consultation',
  'converted',
  'lost',
];

function normalizeSource(source?: string) {
  const value = String(source || 'website').toLowerCase();

  return {
    label:
      value.charAt(0).toUpperCase() +
      value.slice(1),
    icon: SOURCE_ICON[value] || '🌐',
  };
}

function getLeadLocation(lead: Lead) {
  return (
    lead.location ||
    lead.propertyType ||
    'Not specified'
  );
}

function getLeadBudget(lead: Lead) {
  return lead.budget || 'Not specified';
}

function StatusBadge({
  status,
  styles,
}: {
  status: string;
  styles: Record<string, string>;
}) {
  const cls =
    styles[status] ??
    'bg-gray-50 text-gray-600 border-gray-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}
    >
      {String(status || '').replace('_', ' ')}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'text-primary',
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
      <div
        className={`p-2.5 rounded-lg bg-primary/8 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>

        <p className="text-2xl font-bold text-foreground">
          {value}
        </p>

        {sub && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS: {
  section: NavSection;
  icon: React.ElementType;
  label: string;
}[] = [
  {
    section: 'overview',
    icon: LayoutDashboard,
    label: 'Overview',
  },
  {
    section: 'leads',
    icon: Users,
    label: 'Leads CRM',
  },
  {
    section: 'consultations',
    icon: Calendar,
    label: 'Consultations',
  },
  {
    section: 'quotes',
    icon: FileText,
    label: 'Quotes',
  },
  {
    section: 'gallery',
    icon: Image,
    label: 'Gallery CMS',
  },
  {
    section: 'services',
    icon: Wrench,
    label: 'Services CMS',
  },
  {
    section: 'settings',
    icon: Settings,
    label: 'Settings',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Overview
// ─────────────────────────────────────────────────────────────────────────────

function Overview({
  leads,
  consultations,
  quotes,
}: {
  leads: Lead[];
  consultations: any[];
  quotes: any[];
}) {
  const newLeads = leads.filter(
    (lead) => lead.status === 'new'
  ).length;

  const converted = leads.filter(
    (lead) => lead.status === 'converted'
  ).length;

  const convRate = leads.length
    ? Math.round(
        (converted / leads.length) * 100
      )
    : 0;

  const today = new Date()
    .toISOString()
    .slice(0, 10);

  const todayConsults =
    consultations.filter(
      (consultation) =>
        consultation.date === today
    ).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={leads.length}
          sub={`${newLeads} new`}
        />

        <StatCard
          icon={Calendar}
          label="Consultations"
          value={consultations.length}
          sub={`${todayConsults} today`}
        />

        <StatCard
          icon={FileText}
          label="Quote Requests"
          value={quotes.length}
          sub="awaiting review"
        />

        <StatCard
          icon={TrendingUp}
          label="Conversion Rate"
          value={`${convRate}%`}
          sub={`${converted} converted`}
        />
      </div>

      {/* Recent leads + consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              Recent Leads
            </h3>

            <span className="text-xs text-muted-foreground">
              Latest
            </span>
          </div>

          {leads.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No leads yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="px-5 py-3 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                    {lead.name
                      ?.split(' ')
                      .map(
                        (name: string) =>
                          name[0]
                      )
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {lead.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {getLeadLocation(lead)} ·{' '}
                      {getLeadBudget(lead)}
                    </p>
                  </div>

                  <StatusBadge
                    status={lead.status}
                    styles={LEAD_STATUS_STYLES}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              Upcoming Consultations
            </h3>

            <span className="text-xs text-muted-foreground">
              Next 7 days
            </span>
          </div>

          <div className="divide-y divide-border">
            {consultations
              .slice(0, 5)
              .map((consultation) => (
                <div
                  key={consultation.id}
                  className="px-5 py-3 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                    {consultation.name
                      .split(' ')
                      .map(
                        (name: string) =>
                          name[0]
                      )
                      .join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {consultation.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {consultation.date} ·{' '}
                      {consultation.time} ·{' '}
                      {consultation.type}
                    </p>
                  </div>

                  <StatusBadge
                    status={consultation.status}
                    styles={
                      CONSULT_STATUS_STYLES
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Lead source breakdown */}
      <div className="bg-card border border-border rounded-xl">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm">
            Lead Sources
          </h3>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            'whatsapp',
            'website',
            'referral',
            'instagram',
            'phone',
          ].map((source) => {
            const count = leads.filter(
              (lead) =>
                String(
                  lead.source || ''
                ).toLowerCase() === source
            ).length;

            const pct = leads.length
              ? Math.round(
                  (count / leads.length) *
                    100
                )
              : 0;

            const sourceData =
              normalizeSource(source);

            return (
              <div
                key={source}
                className="text-center"
              >
                <div className="text-2xl mb-1">
                  {sourceData.icon}
                </div>

                <p className="text-xs font-medium text-muted-foreground">
                  {sourceData.label}
                </p>

                <p className="text-xl font-bold text-foreground">
                  {count}
                </p>

                <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${pct}%`,
                    }}
                  />
                </div>

                <p className="text-[10px] text-muted-foreground mt-1">
                  {pct}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Leads CRM
// ─────────────────────────────────────────────────────────────────────────────

function LeadsCRM({
  leads,
  onStatusChange,
  onAddLead,
  onDeleteLead,
  loading,
  error,
}: {
  leads: Lead[];
  onStatusChange: (
    id: string,
    status: LeadStatus
  ) => Promise<void>;
  onAddLead: (
    lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => Promise<void>;
  onDeleteLead: (id: string) => Promise<void>;
  loading: boolean;
  error: string;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState('all');
  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [formError, setFormError] =
    useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    propertyType: '',
    message: '',
    source: 'website',
  });

  const filtered = leads.filter((lead) => {
    const query =
      search.trim().toLowerCase();

    const matchSearch =
      !query ||
      String(lead.name || '')
        .toLowerCase()
        .includes(query) ||
      String(lead.phone || '')
        .toLowerCase()
        .includes(query) ||
      String(lead.email || '')
        .toLowerCase()
        .includes(query) ||
      String(
        getLeadLocation(lead)
      )
        .toLowerCase()
        .includes(query);

    const matchStatus =
      statusFilter === 'all' ||
      lead.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const resetForm = () => {
    setForm({
      name: '',
      phone: '',
      email: '',
      budget: '',
      propertyType: '',
      message: '',
      source: 'website',
    });

    setFormError('');
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError(
        'Client name is required.'
      );
      return;
    }

    if (!form.phone.trim()) {
      setFormError(
        'Phone number is required.'
      );
      return;
    }

    try {
      setSaving(true);
      setFormError('');

      await onAddLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        budget: form.budget.trim(),
        propertyType:
          form.propertyType.trim(),
        location:
          form.propertyType.trim(),
        message: form.message.trim(),
        source: form.source,
      });

      resetForm();
      setShowAddForm(false);
    } catch (err: any) {
      setFormError(
        err.message ||
          'Unable to add lead.'
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (
    lead: Lead
  ) => {
    const confirmed = window.confirm(
      `Delete lead "${lead.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    await onDeleteLead(lead.id);
  };

  return (
    <div className="space-y-4">
      {/* Error */}
      {(error || formError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {formError || error}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search by name, phone, email, location…"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">
            All Status
          </option>

          {LEAD_STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(
              (current) => !current
            );
            setFormError('');
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-xl p-5 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Add New Lead
              </h3>

              <p className="text-xs text-muted-foreground mt-1">
                Add a customer enquiry to your CRM.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (saving) return;
                setShowAddForm(false);
                resetForm();
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Client Name *
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Rahul Mehta"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Phone *
              </label>

              <input
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="+91 98201 45678"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="client@email.com"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Budget
              </label>

              <input
                value={form.budget}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    budget: event.target.value,
                  }))
                }
                placeholder="₹15L – ₹25L"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Property Type
              </label>

              <select
                value={form.propertyType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    propertyType:
                      event.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">
                  Select property
                </option>
                <option value="1BHK">
                  1BHK
                </option>
                <option value="2BHK">
                  2BHK
                </option>
                <option value="3BHK">
                  3BHK
                </option>
                <option value="4BHK">
                  4BHK
                </option>
                <option value="Penthouse">
                  Penthouse
                </option>
                <option value="Bungalow">
                  Bungalow
                </option>
                <option value="Office">
                  Office
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Source
              </label>

              <select
                value={form.source}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    source:
                      event.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="website">
                  Website
                </option>
                <option value="whatsapp">
                  WhatsApp
                </option>
                <option value="instagram">
                  Instagram
                </option>
                <option value="referral">
                  Referral
                </option>
                <option value="phone">
                  Phone
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Message
            </label>

            <textarea
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  message:
                    event.target.value,
                }))
              }
              rows={3}
              placeholder="Customer requirements..."
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : 'Save Lead'}
            </button>
          </div>
        </form>
      )}

      {/* Status summary */}
      <div className="flex flex-wrap gap-2">
        {LEAD_STATUSES.map((status) => {
          const count = leads.filter(
            (lead) =>
              lead.status === status
          ).length;

          return (
            <button
              key={status}
              type="button"
              onClick={() =>
                setStatusFilter(
                  statusFilter === status
                    ? 'all'
                    : status
                )
              }
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${
                statusFilter === status
                  ? LEAD_STATUS_STYLES[
                      status
                    ]
                  : 'bg-muted text-muted-foreground border-border'
              }`}
            >
              {status} · {count}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-card border border-border rounded-xl py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Loading leads...
          </p>
        </div>
      ) : (
        /* Table */
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_130px_130px_110px_110px_140px_125px] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Client</span>
            <span>Phone</span>
            <span>Budget</span>
            <span>Source</span>
            <span>Property</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {leads.length === 0
                  ? 'No leads yet'
                  : 'No leads match your filter'}
              </p>

              {leads.length === 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAddForm(true)
                  }
                  className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Add Your First Lead
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((lead) => {
                const source =
                  normalizeSource(
                    lead.source
                  );

                return (
                  <div key={lead.id}>
                    {/* Desktop */}
                    <div
                      className="hidden md:grid grid-cols-[1fr_130px_130px_110px_110px_140px_125px] gap-4 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedId(
                          expandedId ===
                            lead.id
                            ? null
                            : lead.id
                        )
                      }
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {lead.name}
                        </p>

                        <p className="text-xs text-muted-foreground truncate">
                          {lead.email ||
                            'No email'}
                        </p>
                      </div>

                      <a
                        href={`tel:${lead.phone}`}
                        className="text-xs text-primary hover:underline"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        {lead.phone}
                      </a>

                      <span className="text-xs">
                        {getLeadBudget(
                          lead
                        )}
                      </span>

                      <span className="text-sm">
                        {source.icon}{' '}
                        {source.label}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {getLeadLocation(
                          lead
                        )}
                      </span>

                      <select
                        value={lead.status}
                        onChange={(event) => {
                          event.stopPropagation();

                          void onStatusChange(
                            lead.id,
                            event.target
                              .value as LeadStatus
                          );
                        }}
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                        className={`text-xs px-2 py-1 rounded-full border font-medium focus:outline-none capitalize ${
                          LEAD_STATUS_STYLES[
                            lead.status
                          ]
                        }`}
                      >
                        {LEAD_STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-white text-foreground"
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>

                      <div className="flex gap-1.5">
                        <a
                          href={`https://wa.me/${lead.phone.replace(
                            /\D/g,
                            ''
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            setExpandedId(
                              expandedId ===
                                lead.id
                                ? null
                                : lead.id
                            );
                          }}
                          className="p-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                          title="Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void confirmDelete(
                              lead
                            );
                          }}
                          className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden p-4 space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {lead.name}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            {getLeadLocation(
                              lead
                            )}{' '}
                            ·{' '}
                            {getLeadBudget(
                              lead
                            )}
                          </p>
                        </div>

                        <StatusBadge
                          status={lead.status}
                          styles={
                            LEAD_STATUS_STYLES
                          }
                        />
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 text-blue-600 rounded text-xs"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>

                        <a
                          href={`https://wa.me/${lead.phone.replace(
                            /\D/g,
                            ''
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-green-50 text-green-600 rounded text-xs"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(
                              expandedId ===
                                lead.id
                                ? null
                                : lead.id
                            )
                          }
                          className="px-3 py-1.5 bg-muted rounded text-xs"
                        >
                          Details
                        </button>
                      </div>

                      {expandedId ===
                        lead.id && (
                        <div className="pt-2 space-y-2">
                          <select
                            value={
                              lead.status
                            }
                            onChange={(event) =>
                              void onStatusChange(
                                lead.id,
                                event.target
                                  .value as LeadStatus
                              )
                            }
                            className={`w-full text-xs px-3 py-2 rounded-lg border font-medium capitalize ${
                              LEAD_STATUS_STYLES[
                                lead.status
                              ]
                            }`}
                          >
                            {LEAD_STATUSES.map(
                              (
                                status
                              ) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {status}
                                </option>
                              )
                            )}
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              void confirmDelete(
                                lead
                              )
                            }
                            className="w-full py-2 text-xs text-red-600 bg-red-50 rounded-lg"
                          >
                            Delete Lead
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Expanded desktop details */}
                    {expandedId ===
                      lead.id && (
                      <div className="px-5 py-4 bg-muted/20 border-t border-border text-sm space-y-2">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Message:
                          </span>{' '}
                          {lead.message ||
                            'No message provided.'}
                        </p>

                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Email:
                          </span>{' '}
                          {lead.email ||
                            'No email provided.'}
                        </p>

                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Received:
                          </span>{' '}
                          {lead.createdAt
                            ? new Date(
                                lead.createdAt
                              ).toLocaleString(
                                'en-IN',
                                {
                                  dateStyle:
                                    'medium',
                                  timeStyle:
                                    'short',
                                }
                              )
                            : 'Unknown'}
                        </p>

                        <div className="flex gap-2 pt-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                          >
                            Call Client
                          </a>

                          <a
                            href={`https://wa.me/${lead.phone.replace(
                              /\D/g,
                              ''
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Consultations
// ─────────────────────────────────────────────────────────────────────────────

function ConsultationsView({
  consultations,
  onStatusChange,
}: {
  consultations: any[];
  onStatusChange: (
    id: string,
    status: string
  ) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'pending',
              'confirmed',
              'completed',
              'cancelled',
            ] as ConsultationStatus[]
          ).map((status) => {
            const count =
              consultations.filter(
                (consultation) =>
                  consultation.status ===
                  status
              ).length;

            return (
              <span
                key={status}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${CONSULT_STATUS_STYLES[status]}`}
              >
                {status} · {count}
              </span>
            );
          })}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Schedule
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_100px_120px_110px_120px_140px_120px] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Client</span>
          <span>Date</span>
          <span>Time</span>
          <span>Type</span>
          <span>Designer</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-border">
          {consultations.map(
            (consultation) => (
              <div
                key={consultation.id}
                className="hidden md:grid grid-cols-[1fr_100px_120px_110px_120px_140px_120px] gap-4 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">
                    {consultation.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {consultation.propertyType}{' '}
                    · {consultation.email}
                  </p>
                </div>

                <span className="text-xs font-medium">
                  {consultation.date}
                </span>

                <span className="text-xs text-muted-foreground">
                  {consultation.time}
                </span>

                <span className="text-xs">
                  {consultation.type ===
                  'In-Person'
                    ? '🏢'
                    : '💻'}{' '}
                  {consultation.type}
                </span>

                <span className="text-xs text-muted-foreground">
                  {consultation.designer}
                </span>

                <select
                  value={
                    consultation.status
                  }
                  onChange={(event) =>
                    onStatusChange(
                      consultation.id,
                      event.target.value
                    )
                  }
                  className={`text-xs px-2 py-1 rounded-full border font-medium focus:outline-none capitalize ${CONSULT_STATUS_STYLES[consultation.status as ConsultationStatus]}`}
                >
                  {Object.keys(
                    CONSULT_STATUS_STYLES
                  ).map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-white text-foreground"
                    >
                      {status}
                    </option>
                  ))}
                </select>

                <div className="flex gap-1.5">
                  <a
                    href={`tel:${consultation.phone}`}
                    className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`https://wa.me/${consultation.phone.replace(
                      /\D/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>

                  <button className="p-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/70 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          )}

          {/* Mobile */}
          {consultations.map(
            (consultation) => (
              <div
                key={`m-${consultation.id}`}
                className="md:hidden p-4 space-y-2"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {consultation.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {consultation.date} ·{' '}
                      {consultation.time}
                    </p>
                  </div>

                  <StatusBadge
                    status={
                      consultation.status
                    }
                    styles={
                      CONSULT_STATUS_STYLES
                    }
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {consultation.type} ·{' '}
                  {consultation.designer}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Quotes
// ─────────────────────────────────────────────────────────────────────────────

function QuotesView({
  quotes,
  onStatusChange,
  onDeleteQuote,
}: {
  quotes: any[];
  onStatusChange: (
    id: string,
    status: string
  ) => void;
  onDeleteQuote: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {quotes.length === 0 ? (
        <div className="bg-card border border-border rounded-xl py-16 text-center text-muted-foreground text-sm">
          No quote requests yet
        </div>
      ) : (
        quotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-semibold text-foreground">
                  {quote.name}
                </p>

                <p className="text-xs text-muted-foreground mt-0.5">
                  {quote.email || "No email"}
                </p>
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <select
                  value={quote.status || "pending"}
                  onChange={(e) =>
                    onStatusChange(
                      quote.id,
                      e.target.value
                    )
                  }
                  className="text-xs rounded-full border border-border bg-background px-3 py-1.5"
                >
                  <option value="pending">
                    Pending
                  </option>
                  <option value="in_progress">
                    In Progress
                  </option>
                  <option value="sent">
                    Sent
                  </option>
                  <option value="rejected">
                    Rejected
                  </option>
                </select>

                <span className="text-xs text-muted-foreground">
                  {quote.createdAt
                    ? new Date(
                        quote.createdAt
                      ).toLocaleDateString("en-IN")
                    : "—"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                [
                  "Property",
                  quote.propertyType || "—",
                ],
                [
                  "Area",
                  quote.area
                    ? `${quote.area} sq ft`
                    : "—",
                ],
                [
                  "Budget",
                  quote.budget || "—",
                ],
                [
                  "Phone",
                  quote.phone || "—",
                ],
              ].map(([key, value]) => (
                <div
                  key={key}
                  className="bg-muted/50 rounded-lg p-2.5"
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {key}
                  </p>

                  <p className="text-sm font-medium mt-0.5">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {(quote.services || []).map(
                (service: string) => (
                  <span
                    key={service}
                    className="px-2.5 py-1 bg-primary/8 text-primary text-xs rounded-full border border-primary/20"
                  >
                    {service}
                  </span>
                )
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    quote.id,
                    "sent"
                  )
                }
                className="px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Send Quote
              </button>

              <a
                href={`tel:${quote.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted border border-border rounded-lg hover:bg-muted/70"
              >
                <Phone className="w-3 h-3" />
                Call
              </a>

              <a
                href={`https://wa.me/${(quote.phone || "").replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100"
              >
                <MessageCircle className="w-3 h-3" />
                WhatsApp
              </a>

              <button
                type="button"
                onClick={() =>
                  onDeleteQuote(quote.id)
                }
                className="px-3 py-1.5 text-xs text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery CMS
// ─────────────────────────────────────────────────────────────────────────────

function GalleryCMS() {
  type GalleryImage = {
    id: string;
    title: string;
    category: string;
    url: string;
    description?: string;
    featured?: boolean;
    order?: number;
  };

  const [images, setImages] =
    useState<GalleryImage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'living',
    url: '',
    description: '',
    featured: false,
  });

  const loadGallery = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await apiFetch(
        '/make-server-664a60c7/gallery'
      );

      const gallery = (
        data.images ||
        data.gallery ||
        []
      ).sort(
        (
          a: GalleryImage,
          b: GalleryImage
        ) =>
          Number(a.order || 0) -
          Number(b.order || 0)
      );

      setImages(gallery);
    } catch (err: any) {
      console.error(
        'Failed to load gallery:',
        err
      );

      setError(
        err.message ||
          'Unable to load gallery'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleAdd = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.url.trim()
    ) {
      setError(
        'Title and image URL are required.'
      );
      return;
    }

    try {
      setSaving(true);
      setError('');

      await apiFetch(
        '/make-server-664a60c7/gallery',
        {
          method: 'POST',
          body: JSON.stringify({
            title: form.title.trim(),
            category: form.category,
            url: form.url.trim(),
            description:
              form.description.trim(),
            featured: form.featured,
            order: images.length + 1,
          }),
        }
      );

      setForm({
        title: '',
        category: 'living',
        url: '',
        description: '',
        featured: false,
      });

      setShowAddForm(false);

      await loadGallery();
    } catch (err: any) {
      console.error(
        'Failed to add gallery image:',
        err
      );

      setError(
        err.message ||
          'Unable to add image'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this gallery image?'
    );

    if (!confirmed) return;

    try {
      setError('');

      await apiFetch(
        `/make-server-664a60c7/gallery/${id}`,
        {
          method: 'DELETE',
        }
      );

      setImages((current) =>
        current.filter(
          (image) => image.id !== id
        )
      );
    } catch (err: any) {
      console.error(
        'Failed to delete gallery image:',
        err
      );

      setError(
        err.message ||
          'Unable to delete image'
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {images.length}{' '}
          {images.length === 1
            ? 'image'
            : 'images'}{' '}
          in gallery
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={loadGallery}
            className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted"
          >
            Refresh
          </button>

          <button
            onClick={() => {
              setShowAddForm(
                (value) => !value
              );
              setError('');
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Add Gallery Image
            </h3>

            <button
              type="button"
              onClick={() =>
                setShowAddForm(false)
              }
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Title
              </label>

              <input
                value={form.title}
                onChange={(event) =>
                  setForm({
                    ...form,
                    title:
                      event.target.value,
                  })
                }
                placeholder="e.g. Bandra Living Room"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Category
              </label>

              <select
                value={form.category}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category:
                      event.target.value,
                  })
                }
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background outline-none"
              >
                <option value="living">
                  Living
                </option>
                <option value="bedroom">
                  Bedroom
                </option>
                <option value="kitchen">
                  Kitchen
                </option>
                <option value="furniture">
                  Furniture
                </option>
                <option value="wardrobe">
                  Wardrobe
                </option>
                <option value="dining">
                  Dining
                </option>
                <option value="office">
                  Office
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Image URL
            </label>

            <input
              value={form.url}
              onChange={(event) =>
                setForm({
                  ...form,
                  url: event.target.value,
                })
              }
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              Use a direct public image URL.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,
                  description:
                    event.target.value,
                })
              }
              rows={3}
              placeholder="Short description of this project..."
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                setForm({
                  ...form,
                  featured:
                    event.target.checked,
                })
              }
              className="w-4 h-4"
            />

            Featured project
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : 'Save Image'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Loading gallery...
          </p>
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No gallery images found.
          </p>

          <button
            onClick={() =>
              setShowAddForm(true)
            }
            className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Add Your First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-card border border-border rounded-xl overflow-hidden group"
            >
              <div className="relative h-36 bg-muted">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        image.url,
                        '_blank'
                      )
                    }
                    className="p-1.5 bg-white rounded text-foreground hover:bg-muted"
                    title="View image"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        image.id
                      )
                    }
                    className="p-1.5 bg-red-500 rounded text-white hover:bg-red-600"
                    title="Delete image"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-xs font-medium truncate">
                  {image.title}
                </p>

                <span className="text-[10px] text-muted-foreground capitalize">
                  {image.category}
                </span>

                {image.featured && (
                  <span className="ml-2 text-[10px] text-primary">
                    Featured
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Services CMS
// ─────────────────────────────────────────────────────────────────────────────

function ServicesCMS() {
  type Service = {
    id: string;
    title: string;
    description: string;
    image: string;
    features: string[];
    pricing: string;
    active: boolean;
    order: number;
    createdAt?: string;
    updatedAt?: string;
  };

  const emptyForm = {
    title: '',
    description: '',
    image: '',
    features: '',
    pricing: '',
    active: true,
    order: 1,
  };

  const [services, setServices] =
    useState<Service[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [showForm, setShowForm] =
    useState(false);

  const [editingService, setEditingService] =
    useState<Service | null>(null);

  const [form, setForm] =
    useState(emptyForm);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await apiFetch(
        '/make-server-664a60c7/services'
      );

      setServices(
        (data.services || []).sort(
          (
            first: Service,
            second: Service
          ) =>
            Number(first.order || 0) -
            Number(second.order || 0)
        )
      );
    } catch (err: any) {
      console.error(
        'Failed to load services:',
        err
      );

      setError(
        err.message ||
          'Unable to load services'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddForm = () => {
    setEditingService(null);

    setForm({
      ...emptyForm,
      order: services.length + 1,
    });

    setError('');
    setShowForm(true);
  };

  const openEditForm = (
    service: Service
  ) => {
    setEditingService(service);

    setForm({
      title: service.title || '',
      description:
        service.description || '',
      image: service.image || '',
      features: (
        service.features || []
      ).join('\n'),
      pricing: service.pricing || '',
      active: service.active,
      order: service.order || 1,
    });

    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingService(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSave = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError(
        'Service title is required.'
      );
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        title: form.title.trim(),
        description:
          form.description.trim(),
        image: form.image.trim(),
        features: form.features
          .split('\n')
          .map((feature) =>
            feature.trim()
          )
          .filter(Boolean),
        pricing: form.pricing.trim(),
        active: form.active,
        order:
          Number(form.order) || 1,
      };

      const data = await apiFetch(
        editingService
          ? `/make-server-664a60c7/services/${editingService.id}`
          : '/make-server-664a60c7/services',
        {
          method: editingService
            ? 'PUT'
            : 'POST',
          body: JSON.stringify(
            payload
          ),
        }
      );

      const savedService =
        data.service;

      if (editingService) {
        setServices((current) =>
          current
            .map((service) =>
              service.id ===
              editingService.id
                ? savedService
                : service
            )
            .sort(
              (first, second) =>
                first.order -
                second.order
            )
        );
      } else {
        setServices((current) =>
          [
            ...current,
            savedService,
          ].sort(
            (first, second) =>
              first.order -
              second.order
          )
        );
      }

      closeForm();
    } catch (err: any) {
      console.error(
        'Failed to save service:',
        err
      );

      setError(
        err.message ||
          'Failed to save service'
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleService = async (
    service: Service
  ) => {
    try {
      setError('');

      const data = await apiFetch(
        `/make-server-664a60c7/services/${service.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            active: !service.active,
          }),
        }
      );

      setServices((current) =>
        current.map((item) =>
          item.id === service.id
            ? data.service
            : item
        )
      );
    } catch (err: any) {
      console.error(
        'Failed to update service:',
        err
      );

      setError(
        err.message ||
          'Failed to update service'
      );
    }
  };

  const deleteService = async (
    service: Service
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${service.title}"? This cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setError('');

      await apiFetch(
        `/make-server-664a60c7/services/${service.id}`,
        {
          method: 'DELETE',
        }
      );

      setServices((current) =>
        current.filter(
          (item) =>
            item.id !== service.id
        )
      );
    } catch (err: any) {
      console.error(
        'Failed to delete service:',
        err
      );

      setError(
        err.message ||
          'Failed to delete service'
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl py-16 text-center">
        <div className="text-sm text-muted-foreground">
          Loading services...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Services
          </h2>

          <p className="text-xs text-muted-foreground mt-1">
            Manage the services displayed on your website.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadServices}
            className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-card border border-border rounded-xl p-5 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {editingService
                  ? 'Edit Service'
                  : 'Add Service'}
              </h3>

              <p className="text-xs text-muted-foreground mt-1">
                Enter the information that should appear on the website.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Service Title *
              </label>

              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title:
                      event.target.value,
                  }))
                }
                placeholder="e.g. Complete Interior Design"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description:
                      event.target.value,
                  }))
                }
                placeholder="Describe this service..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Image URL
              </label>

              <input
                value={form.image}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    image:
                      event.target.value,
                  }))
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />

              {form.image && (
                <div className="mt-3 h-40 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={form.image}
                    alt="Service preview"
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Features
              </label>

              <textarea
                value={form.features}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    features:
                      event.target.value,
                  }))
                }
                placeholder={`Modular Kitchen\nWardrobe\nInstallation`}
                rows={5}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <p className="text-[11px] text-muted-foreground mt-1">
                Enter one feature per line.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Pricing
              </label>

              <input
                value={form.pricing}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    pricing:
                      event.target.value,
                  }))
                }
                placeholder="Starting from ₹5L"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <div className="mt-4">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Display Order
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.order}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      order: Number(
                        event.target.value
                      ),
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  active:
                    event.target.checked,
                }))
              }
              className="w-4 h-4"
            />

            <div>
              <p className="text-sm font-medium">
                Publish this service
              </p>

              <p className="text-xs text-muted-foreground">
                Published services are visible on the public website.
              </p>
            </div>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : editingService
                ? 'Update Service'
                : 'Save Service'}
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <>
          {services.length === 0 ? (
            <div className="bg-card border border-border rounded-xl py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No services found.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Add Your First Service
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map(
                (service) => (
                  <div
                    key={service.id}
                    className="bg-card border border-border rounded-xl px-5 py-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <span className="w-8 h-8 shrink-0 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center font-mono">
                        {service.order}
                      </span>

                      {service.image ? (
                        <img
                          src={
                            service.image
                          }
                          alt={
                            service.title
                          }
                          className="w-20 h-14 rounded-lg object-cover bg-muted"
                        />
                      ) : (
                        <div className="w-20 h-14 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">
                          {service.title}
                        </p>

                        {service.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {
                              service.description
                            }
                          </p>
                        )}

                        {service.pricing && (
                          <p className="text-xs text-primary font-medium mt-2">
                            {
                              service.pricing
                            }
                          </p>
                        )}
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs border font-medium ${
                          service.active
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {service.active
                          ? 'Published'
                          : 'Hidden'}
                      </span>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              service
                            )
                          }
                          className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void toggleService(
                              service
                            )
                          }
                          className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                          {service.active
                            ? 'Hide'
                            : 'Publish'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void deleteService(
                              service
                            )
                          }
                          className="px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────────────────

function SettingsView() {
  const [settings, setSettings] = useState({
  businessName: "",
  tagline: "",
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  metaTitle: "",
  metaDescription: "",
  instagramUrl: "",
  googleBusinessUrl: "",
});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await apiFetch(
          "/make-server-664a60c7/settings"
        );

        if (data?.settings) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        setMessage("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const handleChange = (
    field: keyof typeof settings,
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const data = await apiFetch(
        "/make-server-664a60c7/settings",
        {
          method: "PUT",
          body: JSON.stringify(settings),
        }
      );

      if (data?.settings) {
        setSettings(data.settings);
      }

      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

 const businessFields = [
  {
    key: "businessName",
    label: "Business Name",
  },
  {
    key: "tagline",
    label: "Tagline",
  },
  {
    key: "address",
    label: "Address",
  },
  {
    key: "phone",
    label: "Phone (Primary)",
  },
  {
    key: "whatsapp",
    label: "WhatsApp Number",
  },
  {
    key: "email",
    label: "Email",
  },
] as const;

  const seoFields = [
    {
      key: "metaTitle",
      label: "Meta Title",
    },
    {
      key: "metaDescription",
      label: "Meta Description",
    },
    {
      key: "instagramUrl",
      label: "Instagram URL",
    },
    {
      key: "googleBusinessUrl",
      label: "Google Business URL",
    },
  ] as const;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-muted/40 border-b border-border">
          <h3 className="text-sm font-semibold">
            Business
          </h3>
        </div>

        <div className="p-5 space-y-4">
          {businessFields.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                {label}
              </label>

              <input
                value={settings[key]}
                onChange={(event) =>
                  handleChange(key, event.target.value)
                }
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-muted/40 border-b border-border">
          <h3 className="text-sm font-semibold">
            SEO & Social
          </h3>
        </div>

        <div className="p-5 space-y-4">
          {seoFields.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                {label}
              </label>

              <input
                value={settings[key]}
                onChange={(event) =>
                  handleChange(key, event.target.value)
                }
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
        </div>
      </div>

      {message && (
        <div className="text-sm text-muted-foreground">
          {message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// Main Admin
// ─────────────────────────────────────────────────────────────────────────────

function AdminDashboard({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [activeSection, setActiveSection] =
    useState<NavSection>('overview');

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [consultations, setConsultations] =
  useState<Consultation[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [leadsLoading, setLeadsLoading] =
    useState(true);


  const [leadsError, setLeadsError] =
    useState('');

  // ───────────────────────────────────────────────────────────────────────────
  // Load real leads
  // ───────────────────────────────────────────────────────────────────────────

  const loadLeads = async () => {
    try {
      setLeadsLoading(true);
      setLeadsError('');

      const data = await apiFetch(
        '/make-server-664a60c7/leads'
      );

      const loadedLeads: Lead[] = (
        data.leads || []
      )
        .filter(Boolean)
        .map((lead: any) => ({
          ...lead,

          status:
            LEAD_STATUSES.includes(
              lead.status
            )
              ? lead.status
              : 'new',

          location:
            lead.location ||
            lead.propertyType ||
            'Not specified',

          budget:
            lead.budget ||
            'Not specified',
        }));

      setLeads(loadedLeads);
    } catch (err: any) {
      console.error(
        'Failed to load leads:',
        err
      );

      setLeadsError(
        err.message ||
          'Unable to load leads'
      );
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
// Load real consultations
// ───────────────────────────────────────────────────────────────────────────
useEffect(() => {
  const loadConsultations = async () => {
    try {
      const data = await apiFetch(
        "/make-server-664a60c7/consultations"
      );

      const consultationData = Array.isArray(data?.consultations)
        ? data.consultations
        : [];

      setConsultations(consultationData);
    } catch (error) {
      console.error(
        "Failed to load consultations:",
        error
      );
    }
  };

  loadConsultations();
}, []);

// ───────────────────────────────────────────────────────────────────────────
// Load real quotes
// ───────────────────────────────────────────────────────────────────────────
useEffect(() => {
  const loadQuotes = async () => {
    try {
      const data = await apiFetch(
        "/make-server-664a60c7/quotes"
      );

      const quoteData = Array.isArray(data?.quotes)
        ? data.quotes
        : [];

      setQuotes(quoteData);
    } catch (error) {
      console.error("Failed to load quotes:", error);
    }
  };

  loadQuotes();
}, []);
  // ───────────────────────────────────────────────────────────────────────────
  // Add lead
  // ───────────────────────────────────────────────────────────────────────────

  const handleAddLead = async (
    leadData: Omit<
      Lead,
      'id' | 'createdAt' | 'updatedAt' | 'status'
    >
  ) => {
    setLeadsError('');

    const data = await apiFetch(
      '/make-server-664a60c7/leads',
      {
        method: 'POST',
        body: JSON.stringify({
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          budget: leadData.budget,
          propertyType:
            leadData.propertyType,
          message: leadData.message,
          source:
            leadData.source ||
            'website',
        }),
      }
    );

    if (!data.lead) {
      throw new Error(
        'Server did not return the created lead.'
      );
    }

    const createdLead: Lead = {
      ...data.lead,
      location:
        data.lead.location ||
        data.lead.propertyType ||
        'Not specified',
      budget:
        data.lead.budget ||
        'Not specified',
    };

    setLeads((current) => [
      createdLead,
      ...current,
    ]);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Update lead status
  // ───────────────────────────────────────────────────────────────────────────

  const handleLeadStatusChange = async (
    id: string,
    status: LeadStatus
  ) => {
    setLeadsError('');

    // Optimistic UI
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              status,
            }
          : lead
      )
    );

    try {
      const data = await apiFetch(
        `/make-server-664a60c7/leads/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (data.lead) {
        setLeads((current) =>
          current.map((lead) =>
            lead.id === id
              ? {
                  ...lead,
                  ...data.lead,
                  location:
                    data.lead.location ||
                    data.lead.propertyType ||
                    lead.location ||
                    'Not specified',
                  budget:
                    data.lead.budget ||
                    lead.budget ||
                    'Not specified',
                }
              : lead
          )
        );
      }
    } catch (err: any) {
      console.error(
        'Failed to update lead status:',
        err
      );

      setLeadsError(
        err.message ||
          'Unable to update lead status'
      );

      // Reload so UI matches database
      await loadLeads();
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Delete lead
  // ───────────────────────────────────────────────────────────────────────────

  const handleDeleteLead = async (
    id: string
  ) => {
    try {
      setLeadsError('');

      await apiFetch(
        `/make-server-664a60c7/leads/${id}`,
        {
          method: 'DELETE',
        }
      );

      setLeads((current) =>
        current.filter(
          (lead) => lead.id !== id
        )
      );
    } catch (err: any) {
      console.error(
        'Failed to delete lead:',
        err
      );

      setLeadsError(
        err.message ||
          'Unable to delete lead'
      );

      throw err;
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Consultation status
  // ───────────────────────────────────────────────────────────────────────────

  const handleConsultationStatusChange = async (
  id: string,
  status: string
) => {
  try {
    const data = await apiFetch(
      `/make-server-664a60c7/consultations/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );

    if (data?.consultation) {
      setConsultations((current) =>
        current.map((consultation) =>
          consultation.id === id
            ? data.consultation
            : consultation
        )
      );
    }
  } catch (error) {
    console.error(
      "Failed to update consultation:",
      error
    );
  }
};
const handleQuoteStatusChange = async (
  id: string,
  status: string
) => {
  try {
    const data = await apiFetch(
      `/make-server-664a60c7/quotes/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );

    if (data?.quote) {
      setQuotes((current) =>
        current.map((quote) =>
          quote.id === id ? data.quote : quote
        )
      );
    }
  } catch (error) {
    console.error(
      "Failed to update quote:",
      error
    );
    alert("Unable to update quote status.");
  }
};

const handleDeleteQuote = async (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this quote request?"
  );

  if (!confirmed) return;

  try {
    await apiFetch(
      `/make-server-664a60c7/quotes/${id}`,
      {
        method: "DELETE",
      }
    );

    setQuotes((current) =>
      current.filter((quote) => quote.id !== id)
    );
  } catch (error) {
    console.error(
      "Failed to delete quote:",
      error
    );
    alert("Unable to delete quote.");
  }
};
  const newLeadsCount = leads.filter(
    (lead) => lead.status === 'new'
  ).length;

  const SECTION_TITLES: Record<
    NavSection,
    string
  > = {
    overview: 'Overview',
    leads: 'Leads CRM',
    consultations: 'Consultations',
    quotes: 'Quotes',
    gallery: 'Gallery CMS',
    services: 'Services CMS',
    settings: 'Settings',
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#2B2B2B] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <p
            className="text-white font-serif text-lg"
            style={{
              fontFamily:
                'Playfair Display, serif',
            }}
          >
            SnS Interiors
          </p>

          <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mt-0.5">
            Admin Dashboard
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(
            ({
              section,
              icon: Icon,
              label,
            }) => {
              const count =
                section === 'leads'
                  ? newLeadsCount
                  : undefined;

              return (
                <button
                  key={section}
                  onClick={() => {
                    setActiveSection(
                      section
                    );
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section
                      ? 'bg-[#B58E5F] text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />

                  <span className="flex-1 text-left">
                    {label}
                  </span>

                  {count !== undefined &&
                    count > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                          activeSection ===
                          section
                            ? 'bg-white/20 text-white'
                            : 'bg-[#B58E5F] text-white'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                </button>
              );
            }
          )}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"
          >
            <Home className="w-4 h-4" />
            View Website
          </a>

          <button
  type="button"
  onClick={onLogout}
  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"
>
  <LogOut className="w-4 h-4" />
  Logout
</button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-base font-semibold">
                {
                  SECTION_TITLES[
                    activeSection
                  ]
                }
              </h1>

              <p className="text-xs text-muted-foreground hidden sm:block">
                SnS Interiors Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />

              {newLeadsCount >
                0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#B58E5F] rounded-full" />
              )}
            </button>

            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              SA
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 overflow-auto">
          {activeSection ===
            'overview' && (
            <Overview
              leads={leads}
              consultations={
                consultations
              }
              quotes={quotes}
            />
          )}

          {activeSection ===
            'leads' && (
            <LeadsCRM
              leads={leads}
              onStatusChange={
                handleLeadStatusChange
              }
              onAddLead={
                handleAddLead
              }
              onDeleteLead={
                handleDeleteLead
              }
              loading={
                leadsLoading
              }
              error={leadsError}
            />
          )}

          {activeSection ===
            'consultations' && (
            <ConsultationsView
              consultations={
                consultations
              }
              onStatusChange={
                handleConsultationStatusChange
              }
            />
          )}

          {activeSection ===
            'quotes' && (
            <QuotesView
  quotes={quotes}
  onStatusChange={handleQuoteStatusChange}
  onDeleteQuote={handleDeleteQuote}
/>
          )}

          {activeSection ===
            'gallery' && (
            <GalleryCMS />
          )}

          {activeSection ===
            'services' && (
            <ServicesCMS />
          )}

          {activeSection ===
            'settings' && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}
function Admin() {
  const [session, setSession] =
    useState<any>(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [accessDenied, setAccessDenied] =
    useState(false);

  const ADMIN_EMAIL =
    "vishwakabhay005@gmail.com";

  useEffect(() => {
    let mounted = true;

    const validateSession = async (
      currentSession: any
    ) => {
      if (!currentSession) {
        if (!mounted) return;

        setSession(null);
        setAccessDenied(false);
        setCheckingAuth(false);
        return;
      }

      const userEmail =
        currentSession.user?.email?.toLowerCase();

      if (
        userEmail !==
        ADMIN_EMAIL.toLowerCase()
      ) {
        await supabase.auth.signOut();

        if (!mounted) return;

        setSession(null);
        setAccessDenied(true);
        setCheckingAuth(false);
        return;
      }

      if (!mounted) return;

      setSession(currentSession);
      setAccessDenied(false);
      setCheckingAuth(false);
    };

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        await validateSession(session);
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error
        );

        if (!mounted) return;

        setSession(null);
        setAccessDenied(false);
        setCheckingAuth(false);
      }
    };

    void initializeAuth();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
  (_event, newSession) => {
    setTimeout(() => {
      void validateSession(newSession);
    }, 0);
  }
);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (
    newSession: any
  ) => {
    const userEmail =
      newSession?.user?.email?.toLowerCase();

    if (
      userEmail !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      void supabase.auth.signOut();

      setSession(null);
      setAccessDenied(true);
      return;
    }

    setAccessDenied(false);
    setSession(newSession);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setSession(null);
    setAccessDenied(false);
  };

  // --------------------------------------------------
  // Authentication is still being checked
  // --------------------------------------------------

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="text-sm text-muted-foreground">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Logged in but not an admin
  // --------------------------------------------------

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="mb-2 text-xl font-semibold">
            Access Denied
          </h1>

          <p className="mb-6 text-sm text-muted-foreground">
            You do not have permission to access
            the SnS Interiors admin dashboard.
          </p>

          <button
            type="button"
            onClick={() => {
              setAccessDenied(false);
              setSession(null);
            }}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // No authenticated session
  // --------------------------------------------------

  if (!session) {
    return (
      <AdminLogin
        onLogin={handleLogin}
      />
    );
  }

  // --------------------------------------------------
  // Authenticated admin
  // --------------------------------------------------

  return (
    <AdminDashboard
      onLogout={handleLogout}
    />
  );
}

export default Admin;