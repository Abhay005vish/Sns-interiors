import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SEO } from "../../components/seo/SEO";
import Masonry from "react-responsive-masonry";
import { apiFetch } from "../../../utils/supabase/api";

type GalleryImage = {
  id: string;
  title: string;
  category: string;
  url: string;
  description?: string;
  featured?: boolean;
  order?: number;
};

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] =
    useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "living", name: "Living Room" },
    { id: "bedroom", name: "Bedroom" },
    { id: "kitchen", name: "Kitchen" },
    { id: "furniture", name: "Furniture" },
    { id: "wardrobe", name: "Wardrobe" },
    { id: "dining", name: "Dining" },
    { id: "office", name: "Office" },
  ];

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(
          "/make-server-664a60c7/gallery"
        );

        const galleryImages = (
          data.images || data.gallery || []
        )
          .filter(
            (image: GalleryImage) =>
              image.active !== false
          )
          .sort(
            (a: GalleryImage, b: GalleryImage) =>
              Number(a.order || 0) -
              Number(b.order || 0)
          );

        setImages(galleryImages);
      } catch (err: any) {
        console.error(
          "Failed to load gallery:",
          err
        );

        setError(
          err.message ||
            "Unable to load gallery"
        );
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter(
          (image) =>
            image.category === selectedCategory
        );

  const getImageUrl = (
    url: string,
    width: number
  ) => {
    if (!url) return "";

    const separator = url.includes("?")
      ? "&"
      : "?";

    return `${url}${separator}w=${width}&auto=format`;
  };

  return (
  <>
    <SEO
      title="Interior Design Gallery | SnS Interiors"
      description="Explore the SnS Interiors portfolio featuring premium living rooms, bedrooms, modular kitchens, custom furniture and wardrobe designs."
    />

    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="text-5xl font-heading font-bold mb-4"
          >
            Our Portfolio
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="text-xl text-primary-foreground/90 max-w-2xl mx-auto"
          >
            Explore our completed projects
            across Mumbai
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    category.id
                  )
                }
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory ===
                  category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-primary/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                Loading our portfolio...
              </p>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-center">
              <p className="font-medium text-red-600">
                Unable to load gallery
              </p>

              <p className="mt-1 text-sm text-red-500">
                {error}
              </p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-medium">
                No projects found
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                We are adding more projects to
                our portfolio soon.
              </p>
            </div>
          ) : (
            <Masonry
              columnsCount={3}
              gutter="1rem"
            >
              {filteredImages.map(
                (image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.4,
                      delay:
                        index * 0.05,
                    }}
                    className="cursor-pointer group relative overflow-hidden rounded-lg"
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                  >
                    <img
                      src={getImageUrl(
                        image.url,
                        600
                      )}
                      alt={
                        image.title ||
                        "SnS Interiors project"
                      }
                      className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <p className="font-semibold">
                          {image.title}
                        </p>

                        <p className="text-sm mt-1 opacity-80">
                          View Details
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </Masonry>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <div
            className="max-w-6xl max-h-[90vh] relative"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <img
              src={getImageUrl(
                selectedImage.url,
                1200
              )}
              alt={
                selectedImage.title ||
                "SnS Interiors project"
              }
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />

            <div className="text-white text-center mt-4">
              <h2 className="text-xl font-heading font-semibold">
                {selectedImage.title}
              </h2>

              {selectedImage.description && (
                <p className="mt-2 text-sm text-white/70 max-w-2xl mx-auto">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
        </div>
  </>
  );
}