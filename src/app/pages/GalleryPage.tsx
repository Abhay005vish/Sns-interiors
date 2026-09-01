import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Masonry from 'react-responsive-masonry';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'living', name: 'Living Room' },
    { id: 'bedroom', name: 'Bedroom' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'furniture', name: 'Furniture' }
  ];

  const demoImages = [
    { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6', category: 'living' },
    { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0', category: 'bedroom' },
    { url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1', category: 'kitchen' },
    { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', category: 'furniture' },
    { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', category: 'living' },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', category: 'bedroom' },
    { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', category: 'living' },
    { url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d', category: 'kitchen' },
    { url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25', category: 'furniture' },
    { url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37', category: 'bedroom' },
    { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', category: 'living' },
    { url: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7', category: 'kitchen' }
  ];

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-664a60c7/gallery`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();
      if (data.success && data.images.length > 0) {
        setImages(data.images);
      } else {
        setImages(demoImages.map((img, i) => ({ ...img, id: `demo-${i}` })));
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
      setImages(demoImages.map((img, i) => ({ ...img, id: `demo-${i}` })));
    }
  };

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-heading font-bold mb-4"
          >
            Our Portfolio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-primary-foreground/90 max-w-2xl mx-auto"
          >
            Explore our completed projects across Mumbai
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
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-primary/10'
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
          <Masonry columnsCount={3} gutter="1rem">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="cursor-pointer group relative overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={`${image.url}?w=600&auto=format`}
                  alt={image.description || 'Gallery image'}
                  className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-semibold">View Details</p>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-6xl max-h-[90vh]">
            <img
              src={`${selectedImage.url}?w=1200&auto=format`}
              alt={selectedImage.description || 'Gallery image'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
