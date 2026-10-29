import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

const BASE = "/server/make-server-664a60c7";

// ------------------------------------------------------------
// Supabase Authentication
// ------------------------------------------------------------

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
);

const ADMIN_EMAIL = "vishwakabhay005@gmail.com";

async function requireAuth(c: any) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      user: null,
    };
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return {
      authenticated: false,
      user: null,
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      authenticated: false,
      user: null,
    };
  }

  return {
    authenticated: true,
    user,
  };
}

async function requireAdmin(c: any) {
  const auth = await requireAuth(c);

  if (!auth.authenticated || !auth.user) {
    return {
      authorized: false,
      status: 401,
      user: null,
    };
  }

  if (
    auth.user.email?.toLowerCase() !==
    ADMIN_EMAIL.toLowerCase()
  ) {
    return {
      authorized: false,
      status: 403,
      user: auth.user,
    };
  }

  return {
    authorized: true,
    status: 200,
    user: auth.user,
  };
}
// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: [
      "Content-Type",
      "Authorization",
    ],
    allowMethods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
  }),
);

app.use("*", logger(console.log));
// ------------------------------------------------------------
// Protect private/admin API operations
// ------------------------------------------------------------

app.use("*", async (c, next) => {
  const path = c.req.path;
  const method = c.req.method;

  // CORS preflight must remain public
  if (method === "OPTIONS") {
    await next();
    return;
  }

  // Public endpoints
  const publicEndpoint =
  path === `${BASE}/health` ||
  (path === `${BASE}/leads` && method === "POST") ||
  (path === `${BASE}/consultations` && method === "POST") ||
  (path === `${BASE}/quotes` && method === "POST") ||
  (path === `${BASE}/gallery` && method === "GET") ||
  (path === `${BASE}/services` && method === "GET") ||
  (path.startsWith(`${BASE}/services/`) && method === "GET") ||
  (path === `${BASE}/settings` && method === "GET");

  if (publicEndpoint) {
    await next();
    return;
  }

  // Everything else requires a valid Supabase login
  const admin = await requireAdmin(c);

if (!admin.authorized) {
  return c.json(
    {
      success: false,
      error:
        admin.status === 403
          ? "Admin access required"
          : "Authentication required",
    },
    admin.status,
  );
}

c.set("user", admin.user);

await next();
});
// ------------------------------------------------------------
// Health Check
// ------------------------------------------------------------

app.get(`${BASE}/health`, (c) => {
  return c.json({
    status: "ok",
    service: "SnS Interiors API",
  });
});

// ============================================================
// LEADS
// ============================================================

app.post(`${BASE}/leads`, async (c) => {
  try {
    const body = await c.req.json();

    if (!body.name || !body.phone) {
      return c.json(
        {
          success: false,
          error: "Name and phone are required",
        },
        400,
      );
    }

    const leadId = `lead-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    const now = new Date().toISOString();

    const lead = {
      id: leadId,
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      budget: body.budget || null,
      propertyType: body.propertyType || null,
      message: body.message || "",
      source: body.source || "website",
      location: body.location || null,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };

    await kv.set(`lead:${leadId}`, lead);

    const leadsList = (await kv.get("leads:list")) || [];
    leadsList.unshift(leadId);

    await kv.set("leads:list", leadsList);

    return c.json({
      success: true,
      leadId,
      lead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.get(`${BASE}/leads`, async (c) => {
  try {
    const leadsList = (await kv.get("leads:list")) || [];

    if (leadsList.length === 0) {
      return c.json({
        success: true,
        leads: [],
      });
    }

    const leads = await kv.mget(
      leadsList.map((id: string) => `lead:${id}`),
    );

    return c.json({
      success: true,
      leads: leads.filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching leads:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.get(`${BASE}/leads/:id`, async (c) => {
  try {
    const leadId = c.req.param("id");
    const lead = await kv.get(`lead:${leadId}`);

    if (!lead) {
      return c.json(
        {
          success: false,
          error: "Lead not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Error fetching lead:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.put(`${BASE}/leads/:id`, async (c) => {
  try {
    const leadId = c.req.param("id");
    const body = await c.req.json();

    const existingLead = await kv.get(`lead:${leadId}`);

    if (!existingLead) {
      return c.json(
        {
          success: false,
          error: "Lead not found",
        },
        404,
      );
    }

    const updatedLead = {
      ...existingLead,
      ...body,
      id: leadId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`lead:${leadId}`, updatedLead);

    return c.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.delete(`${BASE}/leads/:id`, async (c) => {
  try {
    const leadId = c.req.param("id");

    await kv.del(`lead:${leadId}`);

    const leadsList = (await kv.get("leads:list")) || [];

    const updatedList = leadsList.filter(
      (id: string) => id !== leadId,
    );

    await kv.set("leads:list", updatedList);

    return c.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting lead:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// ============================================================
// CONSULTATIONS
// ============================================================

app.post(`${BASE}/consultations`, async (c) => {
  try {
    const body = await c.req.json();

    if (!body.name || !body.phone || !body.date || !body.time) {
      return c.json(
        {
          success: false,
          error: "Name, phone, date and time are required",
        },
        400,
      );
    }

    const consultationId = `consultation-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    const now = new Date().toISOString();

    const consultation = {
      id: consultationId,
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      date: body.date,
      time: body.time,
      propertyType: body.propertyType || null,
      type: body.type || "In-Person",
      designer: body.designer || null,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    await kv.set(
      `consultation:${consultationId}`,
      consultation,
    );

    const consultationsList =
      (await kv.get("consultations:list")) || [];

    consultationsList.unshift(consultationId);

    await kv.set(
      "consultations:list",
      consultationsList,
    );

    return c.json({
      success: true,
      consultationId,
      consultation,
    });
  } catch (error) {
    console.error("Error creating consultation:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.get(`${BASE}/consultations`, async (c) => {
  try {
    const consultationsList =
      (await kv.get("consultations:list")) || [];

    if (consultationsList.length === 0) {
      return c.json({
        success: true,
        consultations: [],
      });
    }

    const consultations = await kv.mget(
      consultationsList.map(
        (id: string) => `consultation:${id}`,
      ),
    );

    return c.json({
      success: true,
      consultations: consultations.filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching consultations:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.put(`${BASE}/consultations/:id`, async (c) => {
  try {
    const consultationId = c.req.param("id");
    const body = await c.req.json();

    const existingConsultation = await kv.get(
      `consultation:${consultationId}`,
    );

    if (!existingConsultation) {
      return c.json(
        {
          success: false,
          error: "Consultation not found",
        },
        404,
      );
    }

    const updatedConsultation = {
      ...existingConsultation,
      ...body,
      id: consultationId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(
      `consultation:${consultationId}`,
      updatedConsultation,
    );

    return c.json({
      success: true,
      consultation: updatedConsultation,
    });
  } catch (error) {
    console.error("Error updating consultation:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.delete(`${BASE}/consultations/:id`, async (c) => {
  try {
    const consultationId = c.req.param("id");

    await kv.del(`consultation:${consultationId}`);

    const consultationsList =
      (await kv.get("consultations:list")) || [];

    const updatedList = consultationsList.filter(
      (id: string) => id !== consultationId,
    );

    await kv.set(
      "consultations:list",
      updatedList,
    );

    return c.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting consultation:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// ============================================================
// QUOTES
// ============================================================

app.post(`${BASE}/quotes`, async (c) => {
  try {
    const body = await c.req.json();

    if (!body.name || !body.phone) {
      return c.json(
        {
          success: false,
          error: "Name and phone are required",
        },
        400,
      );
    }

    const quoteId = `quote-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    const now = new Date().toISOString();

    const quote = {
      id: quoteId,
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      propertyType: body.propertyType || null,
      area: body.area || null,
      budget: body.budget || null,
      services: Array.isArray(body.services)
        ? body.services
        : [],
      description: body.description || "",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    await kv.set(`quote:${quoteId}`, quote);

    const quotesList = (await kv.get("quotes:list")) || [];

    quotesList.unshift(quoteId);

    await kv.set("quotes:list", quotesList);

    return c.json({
      success: true,
      quoteId,
      quote,
    });
  } catch (error) {
    console.error("Error creating quote:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.get(`${BASE}/quotes`, async (c) => {
  try {
    const quotesList = (await kv.get("quotes:list")) || [];

    if (quotesList.length === 0) {
      return c.json({
        success: true,
        quotes: [],
      });
    }

    const quotes = await kv.mget(
      quotesList.map((id: string) => `quote:${id}`),
    );

    return c.json({
      success: true,
      quotes: quotes.filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.put(`${BASE}/quotes/:id`, async (c) => {
  try {
    const quoteId = c.req.param("id");
    const body = await c.req.json();

    const existingQuote = await kv.get(`quote:${quoteId}`);

    if (!existingQuote) {
      return c.json(
        {
          success: false,
          error: "Quote not found",
        },
        404,
      );
    }

    const updatedQuote = {
      ...existingQuote,
      ...body,
      id: quoteId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`quote:${quoteId}`, updatedQuote);

    return c.json({
      success: true,
      quote: updatedQuote,
    });
  } catch (error) {
    console.error("Error updating quote:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.delete(`${BASE}/quotes/:id`, async (c) => {
  try {
    const quoteId = c.req.param("id");

    await kv.del(`quote:${quoteId}`);

    const quotesList = (await kv.get("quotes:list")) || [];

    const updatedList = quotesList.filter(
      (id: string) => id !== quoteId,
    );

    await kv.set("quotes:list", updatedList);

    return c.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting quote:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// ============================================================
// GALLERY
// ============================================================

app.post(`${BASE}/gallery`, async (c) => {
  try {
    const body = await c.req.json();

    if (!body.url) {
      return c.json(
        {
          success: false,
          error: "Image URL is required",
        },
        400,
      );
    }

    const imageId = `image-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    const image = {
      id: imageId,
      title: body.title || "",
      url: body.url,
      category: body.category || "general",
      description: body.description || "",
      active: body.active !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`gallery:${imageId}`, image);

    const galleryList = (await kv.get("gallery:list")) || [];

    galleryList.unshift(imageId);

    await kv.set("gallery:list", galleryList);

    return c.json({
      success: true,
      imageId,
      image,
    });
  } catch (error) {
    console.error("Error adding gallery image:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.get(`${BASE}/gallery`, async (c) => {
  try {
    const galleryList = (await kv.get("gallery:list")) || [];

    if (galleryList.length === 0) {
      return c.json({
        success: true,
        images: [],
      });
    }

    const images = await kv.mget(
      galleryList.map((id: string) => `gallery:${id}`),
    );

    return c.json({
      success: true,
      images: images.filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.put(`${BASE}/gallery/:id`, async (c) => {
  try {
    const imageId = c.req.param("id");
    const body = await c.req.json();

    const existingImage = await kv.get(
      `gallery:${imageId}`,
    );

    if (!existingImage) {
      return c.json(
        {
          success: false,
          error: "Gallery image not found",
        },
        404,
      );
    }

    const updatedImage = {
      ...existingImage,
      ...body,
      id: imageId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(
      `gallery:${imageId}`,
      updatedImage,
    );

    return c.json({
      success: true,
      image: updatedImage,
    });
  } catch (error) {
    console.error("Error updating gallery image:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

app.delete(`${BASE}/gallery/:id`, async (c) => {
  try {
    const imageId = c.req.param("id");

    await kv.del(`gallery:${imageId}`);

    const galleryList = (await kv.get("gallery:list")) || [];

    const updatedList = galleryList.filter(
      (id: string) => id !== imageId,
    );

    await kv.set("gallery:list", updatedList);

    return c.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting gallery image:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// ============================================================
// SERVICES CMS
// ============================================================

// Get all services
app.get(`${BASE}/services`, async (c) => {
  try {
    const servicesList =
      (await kv.get("services:list")) || [];

    if (servicesList.length === 0) {
      return c.json({
        success: true,
        services: [],
      });
    }

    const services = await kv.mget(
      servicesList.map(
        (id: string) => `service:${id}`,
      ),
    );

    const validServices = services
      .filter(Boolean)
      .sort(
        (a, b) =>
          Number(a.order || 0) -
          Number(b.order || 0),
      );

    return c.json({
      success: true,
      services: validServices,
    });
  } catch (error) {
    console.error("Error fetching services:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Get single service
app.get(`${BASE}/services/:id`, async (c) => {
  try {
    const serviceId = c.req.param("id");

    const service = await kv.get(
      `service:${serviceId}`,
    );

    if (!service) {
      return c.json(
        {
          success: false,
          error: "Service not found",
        },
        404,
      );
    }

    return c.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Create service
app.post(`${BASE}/services`, async (c) => {
  try {
    const body = await c.req.json();

    if (!body.title || !body.description) {
      return c.json(
        {
          success: false,
          error: "Title and description are required",
        },
        400,
      );
    }

    const serviceId = `service-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    const now = new Date().toISOString();

    const service = {
      id: serviceId,
      title: body.title,
      description: body.description,
      image: body.image || "",
      features: Array.isArray(body.features)
        ? body.features
        : [],
      pricing: body.pricing || "",
      active: body.active !== false,
      order: Number(body.order) || 1,
      createdAt: now,
      updatedAt: now,
    };

    await kv.set(
      `service:${serviceId}`,
      service,
    );

    const servicesList =
      (await kv.get("services:list")) || [];

    servicesList.push(serviceId);

    await kv.set(
      "services:list",
      servicesList,
    );

    return c.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Update service
app.put(`${BASE}/services/:id`, async (c) => {
  try {
    const serviceId = c.req.param("id");
    const body = await c.req.json();

    const existingService = await kv.get(
      `service:${serviceId}`,
    );

    if (!existingService) {
      return c.json(
        {
          success: false,
          error: "Service not found",
        },
        404,
      );
    }

    const updatedService = {
      ...existingService,
      ...body,
      id: serviceId,

      title:
        body.title !== undefined
          ? body.title
          : existingService.title,

      description:
        body.description !== undefined
          ? body.description
          : existingService.description,

      image:
        body.image !== undefined
          ? body.image
          : existingService.image,

      pricing:
        body.pricing !== undefined
          ? body.pricing
          : existingService.pricing,

      features:
        Array.isArray(body.features)
          ? body.features
          : existingService.features || [],

      active:
        body.active !== undefined
          ? Boolean(body.active)
          : existingService.active !== false,

      order:
        body.order !== undefined
          ? Number(body.order)
          : existingService.order || 1,

      updatedAt: new Date().toISOString(),
    };

    await kv.set(
      `service:${serviceId}`,
      updatedService,
    );

    return c.json({
      success: true,
      service: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Delete service
app.delete(`${BASE}/services/:id`, async (c) => {
  try {
    const serviceId = c.req.param("id");

    const existingService = await kv.get(
      `service:${serviceId}`,
    );

    if (!existingService) {
      return c.json(
        {
          success: false,
          error: "Service not found",
        },
        404,
      );
    }

    await kv.del(
      `service:${serviceId}`,
    );

    const servicesList =
      (await kv.get("services:list")) || [];

    const updatedList = servicesList.filter(
      (id: string) => id !== serviceId,
    );

    await kv.set(
      "services:list",
      updatedList,
    );

    return c.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting service:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// Seed default services
app.post(`${BASE}/services/seed`, async (c) => {
  try {
    const existingList =
      (await kv.get("services:list")) || [];

    if (existingList.length > 0) {
      return c.json({
        success: true,
        seeded: false,
        message: "Services already exist",
      });
    }

    const now = new Date().toISOString();

    const defaultServices = [
      {
        id: "service-interior-design",
        title: "Complete Interior Design",
        description:
          "Transform your entire home with our comprehensive design solutions.",
        image:
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
        features: [
          "3D visualization",
          "Space planning",
          "Color consultation",
          "Material selection",
          "Project management",
        ],
        pricing: "Starting from ₹5L",
        active: true,
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "service-custom-furniture",
        title: "Custom Furniture",
        description:
          "Bespoke furniture designed and crafted specifically for your space.",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200",
        features: [
          "Custom designs",
          "Premium materials",
          "Expert craftsmanship",
          "Perfect fit guarantee",
          "Installation included",
        ],
        pricing: "Custom pricing",
        active: true,
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "service-modular-kitchen",
        title: "Modular Kitchen",
        description:
          "Functional and stylish kitchen solutions with premium finishes.",
        image:
          "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200",
        features: [
          "Smart storage solutions",
          "Premium hardware",
          "Waterproof materials",
          "Chimney & appliances",
          "5-year warranty",
        ],
        pricing: "From ₹2.5L",
        active: true,
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "service-wardrobe",
        title: "Wardrobe Design",
        description:
          "Maximize your storage with custom wardrobe solutions.",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
        features: [
          "Space optimization",
          "Soft-close mechanisms",
          "Interior accessories",
          "Mirror options",
          "Durable finishes",
        ],
        pricing: "From ₹80K",
        active: true,
        order: 4,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await kv.mset(
      defaultServices.map(
        (service) => `service:${service.id}`,
      ),
      defaultServices,
    );

    await kv.set(
      "services:list",
      defaultServices.map(
        (service) => service.id,
      ),
    );

    return c.json({
      success: true,
      seeded: true,
      services: defaultServices,
    });
  } catch (error) {
    console.error("Error seeding services:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});
// SETTINGS
// ─────────────────────────────────────────────────────────────

app.get(`${BASE}/settings`, async (c) => {
  try {
    const settings = (await kv.get("settings")) || {
      businessName: "SnS Interiors",
      tagline: "Gwalior's Premier Interior Design Studio",
      address: "A. 109 Mini Bazar, Green Garden State, Patel Nagar, Near City Centre, Gwalior",
      phone: "+91 98206 34394",
      whatsapp: "+91 98206 34394",
      email: "snsinteriorkitchen@gmail.com",
      metaTitle:
        "SnS Interiors — Luxury Interior Design Gwalior",
      metaDescription:
        "Premium interior design and custom furniture in Gwalior",
      instagramUrl:
        "https://instagram.com/snsinteriors",
      googleBusinessUrl: "",
    };

    return c.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);

    return c.json(
      {
        success: false,
        error: "Failed to fetch settings",
      },
      500,
    );
  }
});

app.put(`${BASE}/settings`, async (c) => {
  try {
    const body = await c.req.json();

    const settings = {
      businessName: body.businessName || "",
      tagline: body.tagline || "",
      phone: body.phone || "",
      whatsapp: body.whatsapp || "",
      email: body.email || "",
      metaTitle: body.metaTitle || "",
      metaDescription: body.metaDescription || "",
      instagramUrl: body.instagramUrl || "",
      googleBusinessUrl: body.googleBusinessUrl || "",
      updatedAt: new Date().toISOString(),
    };

    await kv.set("settings", settings);

    return c.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error saving settings:", error);

    return c.json(
      {
        success: false,
        error: "Failed to save settings",
      },
      500,
    );
  }
});

// ============================================================
// ANALYTICS / STATS
// ============================================================

app.get(`${BASE}/stats`, async (c) => {
  try {
    const leadsList =
      (await kv.get("leads:list")) || [];

    const consultationsList =
      (await kv.get("consultations:list")) || [];

    const quotesList =
      (await kv.get("quotes:list")) || [];

    const servicesList =
      (await kv.get("services:list")) || [];

    const galleryList =
      (await kv.get("gallery:list")) || [];

    const leads = await kv.mget(
      leadsList.map(
        (id: string) => `lead:${id}`,
      ),
    );

    const consultations = await kv.mget(
      consultationsList.map(
        (id: string) => `consultation:${id}`,
      ),
    );

    const stats = {
      totalLeads: leadsList.length,

      totalConsultations:
        consultationsList.length,

      totalQuotes:
        quotesList.length,

      totalServices:
        servicesList.length,

      totalGalleryImages:
        galleryList.length,

      newLeads: leads.filter(
        (lead) => lead?.status === "new",
      ).length,

      scheduledConsultations:
        consultations.filter(
          (consultation) =>
            consultation?.status === "scheduled",
        ).length,

      completedConsultations:
        consultations.filter(
          (consultation) =>
            consultation?.status === "completed",
        ).length,
    };

    return c.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

// ============================================================
// START SERVER
// ============================================================

Deno.serve(app.fetch);