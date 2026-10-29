import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiFetch } from "../../utils/supabase/api";

export interface SiteSettings {
  businessName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  metaTitle: string;
  metaDescription: string;
  instagramUrl: string;
  googleBusinessUrl: string;
}

const defaultSettings: SiteSettings = {
  businessName: "SnS Interiors",
  tagline: "Premium Interiors, Timeless Furniture",
  address:
    "A. 109 Mini Bazar, Green Garden State, Patel Nagar, Near City Centre, Gwalior",
  phone: "+91 98206 34394",
  whatsapp: "+91 98206 34394",
  email: "snsinteriorkitchen@gmail.com",
  metaTitle:
    "SnS Interiors | Premium Interiors, Timeless Furniture",
  metaDescription:
    "Premium interior design, custom furniture and modular kitchen solutions for modern homes.",
  instagramUrl: "",
  googleBusinessUrl: "",
};

interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
}

const SiteSettingsContext =
  createContext<SiteSettingsContextValue>({
    settings: defaultSettings,
    loading: true,
  });

export function SiteSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const response = await apiFetch(
          "/make-server-664a60c7/settings"
        );

        if (
          mounted &&
          response?.success &&
          response?.settings
        ) {
          setSettings({
            ...defaultSettings,
            ...response.settings,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load site settings:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{ settings, loading }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}