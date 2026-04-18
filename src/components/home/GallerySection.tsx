import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, ImageIcon, X, ArrowRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const IMAGE_BUCKET = 'gallery-images';
const VIDEO_BUCKET = 'gallery-videos';

type GalleryItem = { id: string; fileName: string; url: string; type: 'image' | 'video'; name: string };

export const GallerySection = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GalleryItem | null>(null);
  const [tab, setTab] = useState<'photos' | 'videos'>('photos');

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isOpen = !!selectedImage || !!selectedVideo;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedImage, selectedVideo]);

  const { data: images = [], isLoading: loadingImages } = useQuery<GalleryItem[]>({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const [storageRes, metaRes] = await Promise.all([
        supabase.storage.from(IMAGE_BUCKET).list('', { sortBy: { column: 'created_at', order: 'desc' } }),
        supabase.from('image_metadata').select('file_name, title'),
      ]);
      if (storageRes.error) throw storageRes.error;
      const metaMap: Record<string, string> = {};
      (metaRes.data ?? []).forEach((m) => { metaMap[m.file_name] = m.title; });
      return (storageRes.data || [])
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .slice(0, 8)
        .map((f) => ({
          id: f.id ?? f.name,
          fileName: f.name,
          name: metaMap[f.name] ?? f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '),
          url: supabase.storage.from(IMAGE_BUCKET).getPublicUrl(f.name).data.publicUrl,
          type: 'image' as const,
        }));
    },
  });

  const { data: videos = [], isLoading: loadingVideos } = useQuery<GalleryItem[]>({
    queryKey: ['gallery-videos'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from(VIDEO_BUCKET).list('', {
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      return (data || [])
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .slice(0, 6)
        .map((f) => ({
          id: f.id ?? f.name,
          fileName: f.name,
          name: f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '),
          url: supabase.storage.from(VIDEO_BUCKET).getPublicUrl(f.name).data.publicUrl,
          type: 'video' as const,
        }));
    },
  });

  const isLoading = tab === 'photos' ? loadingImages : loadingVideos;
  const items = tab === 'photos' ? images : videos;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Our Memories</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Gallery</h2>
          </div>
          <Button variant="outline" onClick={() => navigate('/gallery')} className="gap-2">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('photos')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              tab === 'photos'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setTab('videos')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              tab === 'videos'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Videos
          </button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No {tab} yet.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`grid gap-4 ${
                tab === 'photos'
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden bg-muted cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                  onClick={() => item.type === 'image' ? setSelectedImage(item) : setSelectedVideo(item)}
                >
                  {item.type === 'image' ? (
                    <div className="w-full h-48 sm:h-52 overflow-hidden relative">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-white text-sm font-semibold capitalize truncate drop-shadow-lg">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 sm:h-52 overflow-hidden relative bg-black">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-80"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-xs text-white/90 font-medium truncate capitalize">{item.name}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Image Lightbox */}
      {createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image with overlay close button */}
                <div className="relative w-full" style={{ height: '380px' }}>
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.name}
                    className="w-full h-full object-cover rounded-t-3xl"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-gray-800" />
                  </button>
                </div>

                {/* Info panel */}
                <div className="bg-zinc-900 px-6 py-5 rounded-b-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                      <ImageIcon className="w-3 h-3" />
                      Photo
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-white/20 text-white/60">
                      Gallery
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white capitalize mb-1">{selectedImage.name}</h3>
                  <p className="text-sm text-white/50 mb-4">Hikma Class Union — Gallery</p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                      </svg>
                      {new Date().toLocaleDateString('en-GB').replace(/\//g, '/')}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['#hikma', '#gallery', '#memories'].map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      , document.body)}

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-3xl w-[90vw] p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-5 pb-3">
            <DialogTitle className="text-lg font-semibold capitalize">{selectedVideo?.name}</DialogTitle>
            <DialogDescription>Gallery Video</DialogDescription>
          </DialogHeader>
          <div className="bg-black w-full" style={{ height: '420px' }}>
            {selectedVideo && (
              <video key={selectedVideo.id} src={selectedVideo.url} controls autoPlay className="w-full h-full object-contain" />
            )}
          </div>
          <div className="flex items-center justify-between px-5 py-4 bg-background border-t">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground ml-0.5" />
              </div>
              <div>
                <p className="text-sm font-semibold capitalize">{selectedVideo?.name}</p>
                <p className="text-xs text-muted-foreground">Hikma Class Union</p>
              </div>
            </div>
            <Button onClick={() => setSelectedVideo(null)} className="rounded-full px-5">
              Close Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
