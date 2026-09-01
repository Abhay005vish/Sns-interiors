import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-664a60c7/health", (c) => {
  return c.json({ status: "ok" });
});

// Leads Management
app.post("/make-server-664a60c7/leads", async (c) => {
  try {
    const body = await c.req.json();
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const lead = {
      id: leadId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      budget: body.budget || null,
      propertyType: body.propertyType || null,
      message: body.message || '',
      source: body.source || 'website',
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`lead:${leadId}`, lead);

    const leadsList = await kv.get('leads:list') || [];
    leadsList.unshift(leadId);
    await kv.set('leads:list', leadsList);

    return c.json({ success: true, leadId, lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-664a60c7/leads", async (c) => {
  try {
    const leadsList = await kv.get('leads:list') || [];
    const leads = await kv.mget(leadsList.map(id => `lead:${id}`));
    return c.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-664a60c7/leads/:id", async (c) => {
  try {
    const leadId = c.req.param('id');
    const lead = await kv.get(`lead:${leadId}`);
    if (!lead) {
      return c.json({ success: false, error: 'Lead not found' }, 404);
    }
    return c.json({ success: true, lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-664a60c7/leads/:id", async (c) => {
  try {
    const leadId = c.req.param('id');
    const body = await c.req.json();
    const existingLead = await kv.get(`lead:${leadId}`);

    if (!existingLead) {
      return c.json({ success: false, error: 'Lead not found' }, 404);
    }

    const updatedLead = {
      ...existingLead,
      ...body,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`lead:${leadId}`, updatedLead);
    return c.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-664a60c7/leads/:id", async (c) => {
  try {
    const leadId = c.req.param('id');
    await kv.del(`lead:${leadId}`);

    const leadsList = await kv.get('leads:list') || [];
    const updatedList = leadsList.filter(id => id !== leadId);
    await kv.set('leads:list', updatedList);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Consultations Management
app.post("/make-server-664a60c7/consultations", async (c) => {
  try {
    const body = await c.req.json();
    const consultationId = `consultation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const consultation = {
      id: consultationId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      date: body.date,
      time: body.time,
      propertyType: body.propertyType || null,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`consultation:${consultationId}`, consultation);

    const consultationsList = await kv.get('consultations:list') || [];
    consultationsList.unshift(consultationId);
    await kv.set('consultations:list', consultationsList);

    return c.json({ success: true, consultationId, consultation });
  } catch (error) {
    console.error('Error creating consultation:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-664a60c7/consultations", async (c) => {
  try {
    const consultationsList = await kv.get('consultations:list') || [];
    const consultations = await kv.mget(consultationsList.map(id => `consultation:${id}`));
    return c.json({ success: true, consultations });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-664a60c7/consultations/:id", async (c) => {
  try {
    const consultationId = c.req.param('id');
    const body = await c.req.json();
    const existingConsultation = await kv.get(`consultation:${consultationId}`);

    if (!existingConsultation) {
      return c.json({ success: false, error: 'Consultation not found' }, 404);
    }

    const updatedConsultation = {
      ...existingConsultation,
      ...body,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`consultation:${consultationId}`, updatedConsultation);
    return c.json({ success: true, consultation: updatedConsultation });
  } catch (error) {
    console.error('Error updating consultation:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Quotes Management
app.post("/make-server-664a60c7/quotes", async (c) => {
  try {
    const body = await c.req.json();
    const quoteId = `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const quote = {
      id: quoteId,
      name: body.name,
      phone: body.phone,
      email: body.email,
      propertyType: body.propertyType,
      area: body.area,
      budget: body.budget,
      services: body.services || [],
      description: body.description || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`quote:${quoteId}`, quote);

    const quotesList = await kv.get('quotes:list') || [];
    quotesList.unshift(quoteId);
    await kv.set('quotes:list', quotesList);

    return c.json({ success: true, quoteId, quote });
  } catch (error) {
    console.error('Error creating quote:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-664a60c7/quotes", async (c) => {
  try {
    const quotesList = await kv.get('quotes:list') || [];
    const quotes = await kv.mget(quotesList.map(id => `quote:${id}`));
    return c.json({ success: true, quotes });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Gallery Management
app.post("/make-server-664a60c7/gallery", async (c) => {
  try {
    const body = await c.req.json();
    const imageId = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const image = {
      id: imageId,
      url: body.url,
      category: body.category || 'general',
      description: body.description || '',
      createdAt: new Date().toISOString()
    };

    await kv.set(`gallery:${imageId}`, image);

    const galleryList = await kv.get('gallery:list') || [];
    galleryList.unshift(imageId);
    await kv.set('gallery:list', galleryList);

    return c.json({ success: true, imageId, image });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-664a60c7/gallery", async (c) => {
  try {
    const galleryList = await kv.get('gallery:list') || [];
    const images = await kv.mget(galleryList.map(id => `gallery:${id}`));
    return c.json({ success: true, images });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-664a60c7/gallery/:id", async (c) => {
  try {
    const imageId = c.req.param('id');
    await kv.del(`gallery:${imageId}`);

    const galleryList = await kv.get('gallery:list') || [];
    const updatedList = galleryList.filter(id => id !== imageId);
    await kv.set('gallery:list', updatedList);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Analytics/Stats
app.get("/make-server-664a60c7/stats", async (c) => {
  try {
    const leadsList = await kv.get('leads:list') || [];
    const consultationsList = await kv.get('consultations:list') || [];
    const quotesList = await kv.get('quotes:list') || [];

    const leads = await kv.mget(leadsList.map(id => `lead:${id}`));
    const consultations = await kv.mget(consultationsList.map(id => `consultation:${id}`));

    const stats = {
      totalLeads: leadsList.length,
      totalConsultations: consultationsList.length,
      totalQuotes: quotesList.length,
      newLeads: leads.filter(l => l?.status === 'new').length,
      scheduledConsultations: consultations.filter(c => c?.status === 'scheduled').length,
      completedConsultations: consultations.filter(c => c?.status === 'completed').length
    };

    return c.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

Deno.serve(app.fetch);