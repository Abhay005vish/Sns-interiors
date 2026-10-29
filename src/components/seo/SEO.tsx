import { useEffect } from 'react';

type SEOProps = {
  title: string;
  description: string;
};

export function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }

    metaDescription.content = description;
  }, [title, description]);

  return null;
}