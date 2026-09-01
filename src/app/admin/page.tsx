import { useState } from 'react';
import {
  Users, Calendar, FileText, TrendingUp, Phone, Mail, MessageCircle,
  LayoutDashboard, Image, Settings, LogOut, ChevronDown, Search,
  Filter, Download, Plus, Eye, CheckCircle, XCircle, Clock, Star,
  Home, Wrench, IndianRupee, BarChart2, Bell, RefreshCw
} from 'lucide-react';

// ─── Demo data ───────────────────────────────────────────────────────────────
const DEMO_LEADS = [
  { id: '1', name: 'Rahul Mehta', phone: '+91 98201 45678', email: 'rahul.mehta@gmail.com', budget: '₹15L – ₹25L', source: 'WhatsApp', status: 'new', location: 'Bandra West', createdAt: '2025-08-28T10:30:00', message: 'Looking for complete 3BHK interior.' },
  { id: '2', name: 'Priya Shah', phone: '+91 97693 21034', email: 'priya.shah@outlook.com', budget: '₹8L – ₹12L', source: 'Website', status: 'contacted', location: 'Juhu', createdAt: '2025-08-27T14:15:00', message: 'Need modular kitchen and master bedroom.' },
  { id: '3', name: 'Amit Joshi', phone: '+91 96543 87621', email: 'amit.j@company.com', budget: '₹25L – ₹50L', source: 'Referral', status: 'qualified', location: 'Worli', createdAt: '2025-08-26T09:00:00', message: 'Luxury penthouse — full interior project.' },
  { id: '4', name: 'Sneha Kapoor', phone: '+91 95432 10987', email: 'sneha.k@gmail.com', budget: '₹10L – ₹15L', source: 'Instagram', status: 'consultation', location: 'Powai', createdAt: '2025-08-25T16:45:00', message: '2BHK flat interior with custom furniture.' },
  { id: '5', name: 'Vikram Nair', phone: '+91 94321 56789', email: 'vikram.nair@corp.in', budget: '₹50L+', source: 'Phone', status: 'converted', location: 'Lower Parel', createdAt: '2025-08-24T11:00:00', message: 'Corporate office + residential project.' },
  { id: '6', name: 'Ananya Desai', phone: '+91 93210 34567', email: 'ananya.d@gmail.com', budget: '₹6L – ₹8L', source: 'Website', status: 'lost', location: 'Thane', createdAt: '2025-08-23T08:30:00', message: 'Studio apartment interior.' },
  { id: '7', name: 'Rohan Kulkarni', phone: '+91 98765 43210', email: 'rohan.k@mail.com', budget: '₹12L – ₹18L', source: 'WhatsApp', status: 'new', location: 'Andheri West', createdAt: '2025-08-29T09:45:00', message: '3BHK complete interior with terrace.' },
  { id: '8', name: 'Meera Patel', phone: '+91 97654 32109', email: 'meera.p@gmail.com', budget: '₹20L – ₹30L', source: 'Referral', status: 'qualified', location: 'Santacruz', createdAt: '2025-08-29T13:20:00', message: 'Heritage bungalow renovation.' },
];

const DEMO_CONSULTATIONS = [
  { id: '1', name: 'Rahul Mehta', phone: '+91 98201 45678', email: 'rahul.mehta@gmail.com', date: '2025-09-02', time: '11:00 AM', type: 'In-Person', designer: 'Sneha Doshi', status: 'confirmed', propertyType: '3BHK' },
  { id: '2', name: 'Priya Shah', phone: '+91 97693 21034', email: 'priya.shah@outlook.com', date: '2025-09-02', time: '3:00 PM', type: 'Video Call', designer: 'Ankit Mehta', status: 'pending', propertyType: '2BHK' },
  { id: '3', name: 'Amit Joshi', phone: '+91 96543 87621', email: 'amit.j@company.com', date: '2025-09-03', time: '10:00 AM', type: 'In-Person', designer: 'Sneha Doshi', status: 'confirmed', propertyType: 'Penthouse' },
  { id: '4', name: 'Sneha Kapoor', phone: '+91 95432 10987', email: 'sneha.k@gmail.com', date: '2025-09-04', time: '2:00 PM', type: 'In-Person', designer: 'Riya Verma', status: 'rescheduled', propertyType: '2BHK' },
  { id: '5', name: 'Meera Patel', phone: '+91 97654 32109', email: 'meera.p@gmail.com', date: '2025-09-05', time: '11:30 AM', type: 'In-Person', designer: 'Ankit Mehta', status: 'pending', propertyType: 'Bungalow' },
];

const DEMO_QUOTES = [
  { id: '1', name: 'Vikram Nair', phone: '+91 94321 56789', email: 'vikram.nair@corp.in', propertyType: '4BHK', area: '2800', budget: '₹50L+', services: ['Full Interior', 'Custom Furniture', 'Smart Home'], status: 'in_progress', createdAt: '2025-08-24T11:00:00' },
  { id: '2', name: 'Rohan Kulkarni', phone: '+91 98765 43210', email: 'rohan.k@mail.com', propertyType: '3BHK', area: '1600', budget: '₹12L – ₹18L', services: ['Full Interior', 'Terrace Design'], status: 'pending', createdAt: '2025-08-29T09:45:00' },
  { id: '3', name: 'Meera Patel', phone: '+91 97654 32109', email: 'meera.p@gmail.com', propertyType: 'Bungalow', area: '4200', budget: '₹20L – ₹30L', services: ['Renovation', 'Custom Furniture', 'Lighting'], status: 'sent', createdAt: '2025-08-29T13:20:00' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'consultation' | 'converted' | 'lost';
type ConsultationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
type NavSection = 'overview' | 'leads' | 'consultations' | 'quotes' | 'gallery' | 'services' | 'settings';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  new:          'bg-blue-50 text-blue-700 border-blue-200',
  contacted:    'bg-amber-50 text-amber-700 border-amber-200',
  qualified:    'bg-purple-50 text-purple-700 border-purple-200',
  consultation: 'bg-[#B58E5F]/10 text-[#8B6B4A] border-[#B58E5F]/30',
  converted:    'bg-green-50 text-green-700 border-green-200',
  lost:         'bg-red-50 text-red-600 border-red-200',
};

const CONSULT_STATUS_STYLES: Record<ConsultationStatus, string> = {
  pending:     'bg-amber-50 text-amber-700 border-amber-200',
  confirmed:   'bg-green-50 text-green-700 border-green-200',
  completed:   'bg-blue-50 text-blue-700 border-blue-200',
  cancelled:   'bg-red-50 text-red-600 border-red-200',
  rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
};

const SOURCE_ICON: Record<string, string> = {
  WhatsApp: '💬', Website: '🌐', Referral: '⭐', Instagram: '📸', Phone: '📞',
};

function StatusBadge({ status, styles }: { status: string; styles: Record<string, string> }) {
  const cls = styles[status as keyof typeof styles] ?? 'bg-gray-50 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-primary' }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg bg-primary/8 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS: { section: NavSection; icon: React.ElementType; label: string; badge?: number }[] = [
  { section: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { section: 'leads', icon: Users, label: 'Leads CRM', badge: 2 },
  { section: 'consultations', icon: Calendar, label: 'Consultations', badge: 2 },
  { section: 'quotes', icon: FileText, label: 'Quotes' },
  { section: 'gallery', icon: Image, label: 'Gallery CMS' },
  { section: 'services', icon: Wrench, label: 'Services CMS' },
  { section: 'settings', icon: Settings, label: 'Settings' },
];

// ─── Sections ─────────────────────────────────────────────────────────────────
function Overview({ leads, consultations, quotes }: { leads: any[]; consultations: any[]; quotes: any[] }) {
  const newLeads = leads.filter(l => l.status === 'new').length;
  const converted = leads.filter(l => l.status === 'converted').length;
  const convRate = leads.length ? Math.round((converted / leads.length) * 100) : 0;
  const todayConsults = consultations.filter(c => c.date === '2025-09-02').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Leads" value={leads.length} sub={`${newLeads} new today`} />
        <StatCard icon={Calendar} label="Consultations" value={consultations.length} sub={`${todayConsults} today`} />
        <StatCard icon={FileText} label="Quote Requests" value={quotes.length} sub="awaiting review" />
        <StatCard icon={TrendingUp} label="Conversion Rate" value={`${convRate}%`} sub={`${converted} converted`} />
      </div>

      {/* Recent leads + upcoming consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Recent Leads</h3>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="divide-y divide-border">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                  {lead.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.location} · {lead.budget}</p>
                </div>
                <StatusBadge status={lead.status} styles={LEAD_STATUS_STYLES} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Upcoming Consultations</h3>
            <span className="text-xs text-muted-foreground">Next 7 days</span>
          </div>
          <div className="divide-y divide-border">
            {consultations.slice(0, 5).map(c => (
              <div key={c.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                  {c.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.date} · {c.time} · {c.type}</p>
                </div>
                <StatusBadge status={c.status} styles={CONSULT_STATUS_STYLES} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead source breakdown */}
      <div className="bg-card border border-border rounded-xl">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm">Lead Sources</h3>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-5 gap-4">
          {['WhatsApp', 'Website', 'Referral', 'Instagram', 'Phone'].map(src => {
            const count = leads.filter(l => l.source === src).length;
            const pct = leads.length ? Math.round((count / leads.length) * 100) : 0;
            return (
              <div key={src} className="text-center">
                <div className="text-2xl mb-1">{SOURCE_ICON[src]}</div>
                <p className="text-xs font-medium text-muted-foreground">{src}</p>
                <p className="text-xl font-bold text-foreground">{count}</p>
                <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LeadsCRM({ leads, onStatusChange }: { leads: any[]; onStatusChange: (id: string, status: string) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="consultation">Consultation</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(LEAD_STATUS_STYLES).map(s => {
          const count = leads.filter(l => l.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${
                statusFilter === s
                  ? LEAD_STATUS_STYLES[s as LeadStatus]
                  : 'bg-muted text-muted-foreground border-border'
              }`}
            >
              {s} · {count}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_130px_130px_110px_110px_140px_100px] gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Client</span>
          <span>Phone</span>
          <span>Budget</span>
          <span>Source</span>
          <span>Location</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">No leads match your filter</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(lead => (
              <div key={lead.id}>
                <div
                  className="hidden md:grid grid-cols-[1fr_130px_130px_110px_110px_140px_100px] gap-4 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                >
                  <div>
                    <p className="text-sm font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                  <a href={`tel:${lead.phone}`} className="text-xs text-primary hover:underline" onClick={e => e.stopPropagation()}>
                    {lead.phone}
                  </a>
                  <span className="text-xs">{lead.budget}</span>
                  <span className="text-sm">{SOURCE_ICON[lead.source]} {lead.source}</span>
                  <span className="text-xs text-muted-foreground">{lead.location}</span>
                  <select
                    value={lead.status}
                    onChange={e => { e.stopPropagation(); onStatusChange(lead.id, e.target.value); }}
                    onClick={e => e.stopPropagation()}
                    className={`text-xs px-2 py-1 rounded-full border font-medium focus:outline-none capitalize ${LEAD_STATUS_STYLES[lead.status as LeadStatus]}`}
                  >
                    {Object.keys(LEAD_STATUS_STYLES).map(s => <option key={s} value={s} className="bg-white text-foreground">{s}</option>)}
                  </select>
                  <div className="flex gap-1.5">
                    <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="WhatsApp">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                    <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                      className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Call">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={e => { e.stopPropagation(); setExpandedId(expandedId === lead.id ? null : lead.id); }}
                      className="p-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors" title="Details">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mobile card */}
                <div className="md:hidden p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.location} · {lead.budget}</p>
                    </div>
                    <StatusBadge status={lead.status} styles={LEAD_STATUS_STYLES} />
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${lead.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 text-blue-600 rounded text-xs">
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-green-50 text-green-600 rounded text-xs">
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                </div>

                {/* Expanded row */}
                {expandedId === lead.id && (
                  <div className="px-5 py-4 bg-muted/20 border-t border-border text-sm space-y-2">
                    <p className="text-muted-foreground"><span className="font-medium text-foreground">Message:</span> {lead.message}</p>
                    <p className="text-muted-foreground"><span className="font-medium text-foreground">Received:</span> {new Date(lead.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    <div className="flex gap-2 pt-1">
                      <button className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Book Consultation</button>
                      <button className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg hover:bg-muted/70">Add Note</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConsultationsView({ consultations, onStatusChange }: { consultations: any[]; onStatusChange: (id: string, status: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {(['pending', 'confirmed', 'completed', 'cancelled'] as ConsultationStatus[]).map(s => {
            const count = consultations.filter(c => c.status === s).length;
            return (
              <span key={s} className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${CONSULT_STATUS_STYLES[s]}`}>
                {s} · {count}
              </span>
            );
          })}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Schedule
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
          {consultations.map(c => (
            <div key={c.id} className="hidden md:grid grid-cols-[1fr_100px_120px_110px_120px_140px_120px] gap-4 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.propertyType} · {c.email}</p>
              </div>
              <span className="text-xs font-medium">{c.date}</span>
              <span className="text-xs text-muted-foreground">{c.time}</span>
              <span className="text-xs">{c.type === 'In-Person' ? '🏢' : '💻'} {c.type}</span>
              <span className="text-xs text-muted-foreground">{c.designer}</span>
              <select
                value={c.status}
                onChange={e => onStatusChange(c.id, e.target.value)}
                className={`text-xs px-2 py-1 rounded-full border font-medium focus:outline-none capitalize ${CONSULT_STATUS_STYLES[c.status as ConsultationStatus]}`}
              >
                {Object.keys(CONSULT_STATUS_STYLES).map(s => <option key={s} value={s} className="bg-white text-foreground">{s}</option>)}
              </select>
              <div className="flex gap-1.5">
                <a href={`tel:${c.phone}`} className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                  className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
                <button className="p-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/70 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Mobile */}
          {consultations.map(c => (
            <div key={`m-${c.id}`} className="md:hidden p-4 space-y-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.date} · {c.time}</p>
                </div>
                <StatusBadge status={c.status} styles={CONSULT_STATUS_STYLES} />
              </div>
              <p className="text-xs text-muted-foreground">{c.type} · {c.designer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuotesView({ quotes }: { quotes: any[] }) {
  return (
    <div className="space-y-3">
      {quotes.length === 0 ? (
        <div className="bg-card border border-border rounded-xl py-16 text-center text-muted-foreground text-sm">
          No quote requests yet
        </div>
      ) : (
        quotes.map(q => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-semibold text-foreground">{q.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{q.email}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                  q.status === 'sent' ? 'bg-green-50 text-green-700 border-green-200' :
                  q.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>{q.status.replace('_', ' ')}</span>
                <span className="text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[['Property', q.propertyType], ['Area', `${q.area} sq ft`], ['Budget', q.budget], ['Phone', q.phone]].map(([k, v]) => (
                <div key={k} className="bg-muted/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{k}</p>
                  <p className="text-sm font-medium mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {q.services.map((s: string) => (
                <span key={s} className="px-2.5 py-1 bg-primary/8 text-primary text-xs rounded-full border border-primary/20">{s}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Send Quote</button>
              <a href={`tel:${q.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted border border-border rounded-lg hover:bg-muted/70">
                <Phone className="w-3 h-3" /> Call
              </a>
              <a href={`https://wa.me/${q.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function GalleryCMS() {
  const demoImages = [
    { id: 1, title: 'Bandra Living Room', category: 'living', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&h=200&fit=crop' },
    { id: 2, title: 'Juhu Master Bedroom', category: 'bedroom', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=300&h=200&fit=crop' },
    { id: 3, title: 'Worli Modular Kitchen', category: 'kitchen', url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=300&h=200&fit=crop' },
    { id: 4, title: 'Custom Sofa Set', category: 'furniture', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop' },
    { id: 5, title: 'Powai Open Living', category: 'living', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop' },
    { id: 6, title: 'Lower Parel Suite', category: 'bedroom', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop' },
  ];
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{demoImages.length} images in gallery</p>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Upload Image
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {demoImages.map(img => (
          <div key={img.id} className="bg-card border border-border rounded-xl overflow-hidden group">
            <div className="relative h-36 bg-muted">
              <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-1.5 bg-white rounded text-foreground hover:bg-muted"><Eye className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 bg-red-500 rounded text-white hover:bg-red-600"><XCircle className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium truncate">{img.title}</p>
              <span className="text-[10px] text-muted-foreground capitalize">{img.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesCMS() {
  const services = [
    { id: 1, title: 'Full Home Interior Design', active: true, order: 1 },
    { id: 2, title: 'Custom Furniture & Joinery', active: true, order: 2 },
    { id: 3, title: 'Modular Kitchen Design', active: true, order: 3 },
    { id: 4, title: 'Bedroom & Wardrobe', active: true, order: 4 },
    { id: 5, title: 'Office & Commercial', active: false, order: 5 },
  ];
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>
      {services.map(s => (
        <div key={s.id} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="cursor-grab text-muted-foreground">⠿</div>
          <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center font-mono">{s.order}</span>
          <p className="flex-1 text-sm font-medium">{s.title}</p>
          <span className={`px-2.5 py-1 rounded-full text-xs border font-medium ${s.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-muted text-muted-foreground border-border'}`}>
            {s.active ? 'Active' : 'Hidden'}
          </span>
          <button className="text-xs px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors">Edit</button>
        </div>
      ))}
    </div>
  );
}

function SettingsView() {
  return (
    <div className="max-w-2xl space-y-6">
      {[
        { section: 'Business', fields: [
          { label: 'Business Name', value: 'SnS Interiors' },
          { label: 'Tagline', value: "Mumbai's Premier Interior Design Studio" },
          { label: 'Phone (Primary)', value: '+91 98201 00000' },
          { label: 'WhatsApp Number', value: '+91 98201 00000' },
          { label: 'Email', value: 'hello@snsinteriors.in' },
        ]},
        { section: 'SEO & Social', fields: [
          { label: 'Meta Title', value: 'SnS Interiors — Luxury Interior Design Mumbai' },
          { label: 'Meta Description', value: 'Premium interior design and custom furniture in Mumbai' },
          { label: 'Instagram URL', value: 'https://instagram.com/snsinteriors' },
          { label: 'Google Business URL', value: '' },
        ]},
      ].map(({ section, fields }) => (
        <div key={section} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 bg-muted/40 border-b border-border">
            <h3 className="text-sm font-semibold">{section}</h3>
          </div>
          <div className="p-5 space-y-4">
            {fields.map(({ label, value }) => (
              <div key={label}>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">{label}</label>
                <input defaultValue={value} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="px-6 py-2.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium">
        Save Settings
      </button>
    </div>
  );
}

// ─── Main Admin ───────────────────────────────────────────────────────────────
export default function Admin() {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [leads, setLeads] = useState(DEMO_LEADS);
  const [consultations, setConsultations] = useState(DEMO_CONSULTATIONS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const newLeadsCount = leads.filter(l => l.status === 'new').length;

  const handleLeadStatusChange = (id: string, status: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleConsultationStatusChange = (id: string, status: string) => {
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const SECTION_TITLES: Record<NavSection, string> = {
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#2B2B2B] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-white font-serif text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>SnS Interiors</p>
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest mt-0.5">Admin Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ section, icon: Icon, label, badge }) => {
            const count = section === 'leads' ? newLeadsCount : badge;
            return (
              <button
                key={section}
                onClick={() => { setActiveSection(section); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section
                    ? 'bg-[#B58E5F] text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {count !== undefined && count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${activeSection === section ? 'bg-white/20 text-white' : 'bg-[#B58E5F] text-white'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all">
            <Home className="w-4 h-4" /> View Website
          </a>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-semibold">{SECTION_TITLES[activeSection]}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">SnS Interiors Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              {newLeadsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#B58E5F] rounded-full" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              SA
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 overflow-auto">
          {activeSection === 'overview' && (
            <Overview leads={leads} consultations={consultations} quotes={DEMO_QUOTES} />
          )}
          {activeSection === 'leads' && (
            <LeadsCRM leads={leads} onStatusChange={handleLeadStatusChange} />
          )}
          {activeSection === 'consultations' && (
            <ConsultationsView consultations={consultations} onStatusChange={handleConsultationStatusChange} />
          )}
          {activeSection === 'quotes' && <QuotesView quotes={DEMO_QUOTES} />}
          {activeSection === 'gallery' && <GalleryCMS />}
          {activeSection === 'services' && <ServicesCMS />}
          {activeSection === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
