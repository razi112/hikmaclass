import { useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Play, Loader2, Pencil, ImagePlus, Check, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

type ImageItem = {
  id: string;
  fileName: string;
  url: string;
  title: string;
};

type VideoMeta = {
  title: string;
  thumbnail_url: string | null;
};

type VideoItem = {
  id: string;
  name: string;
  fileName: string;
  url: string;
  thumbnailUrl: string | null;
  created_at: string;
};

const VIDEO_BUCKET = 'gallery-videos';
const THUMB_BUCKET = 'gallery-thumbnails';
const IMAGE_BUCKET = 'gallery-images';

const Gallery = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<'photos' | 'videos'>('photos');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [thumbTargetFileName, setThumbTargetFileName] = useState<string | null>(null);

  // ── Images ──────────────────────────────────────────────────────────────────
  const { data: images = [], isLoading: loadingImages } = useQuery<ImageItem[]>({
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
        .map((f) => ({
          id: f.id ?? f.name,
          fileName: f.name,
          url: supabase.storage.from(IMAGE_BUCKET).getPublicUrl(f.name).data.publicUrl,
          title: metaMap[f.name] ?? f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '),
        }));
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast({ title: 'Image uploaded successfully' });
    },
    onError: (err: Error) => {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (fileName: string) => {
      const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([fileName]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast({ title: 'Image deleted' });
    },
    onError: (err: Error) => {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    },
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Only image files are allowed', variant: 'destructive' });
      return;
    }
    uploadImageMutation.mutate(file);
    e.target.value = '';
  };

  // ── Videos ──────────────────────────────────────────────────────────────────
  const { data: videos = [], isLoading: loadingVideos } = useQuery<VideoItem[]>({
    queryKey: ['gallery-videos'],
    queryFn: async () => {
      const [storageRes, metaRes] = await Promise.all([
        supabase.storage.from(VIDEO_BUCKET).list('', { sortBy: { column: 'created_at', order: 'desc' } }),
        supabase.from('video_metadata').select('file_name, title, thumbnail_url'),
      ]);
      if (storageRes.error) throw storageRes.error;
      const metaMap: Record<string, VideoMeta> = {};
      (metaRes.data ?? []).forEach((m) => {
        metaMap[m.file_name] = { title: m.title, thumbnail_url: m.thumbnail_url };
      });
      return (storageRes.data || [])
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .map((f) => {
          const meta = metaMap[f.name];
          return {
            id: f.id ?? f.name,
            name: meta?.title ?? f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '),
            fileName: f.name,
            url: supabase.storage.from(VIDEO_BUCKET).getPublicUrl(f.name).data.publicUrl,
            thumbnailUrl: meta?.thumbnail_url ?? null,
            created_at: f.created_at ?? '',
          };
        });
    },
  });

  const uploadVideoMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw new Error(error.message);
      const defaultTitle = file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
      await supabase.from('video_metadata').upsert({ file_name: fileName, title: defaultTitle });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-videos'] });
      toast({ title: 'Video uploaded successfully' });
    },
    onError: (err: Error) => {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (fileName: string) => {
      const { error } = await supabase.storage.from(VIDEO_BUCKET).remove([fileName]);
      if (error) throw new Error(`Storage error: ${error.message}`);
      const { error: metaError } = await supabase.from('video_metadata').delete().eq('file_name', fileName);
      if (metaError) throw new Error(`Metadata error: ${metaError.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-videos'] });
      toast({ title: 'Video deleted' });
    },
    onError: (err: Error) => {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: async ({ fileName, title }: { fileName: string; title: string }) => {
      const { error } = await supabase.from('video_metadata').upsert({ file_name: fileName, title });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-videos'] });
      setEditingId(null);
      toast({ title: 'Title updated' });
    },
    onError: (err: Error) => {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    },
  });

  const uploadThumbMutation = useMutation({
    mutationFn: async ({ file, fileName }: { file: File; fileName: string }) => {
      const thumbName = `thumb_${fileName.replace(/\.[^.]+$/, '')}.${file.name.split('.').pop()}`;
      const { error: upErr } = await supabase.storage.from(THUMB_BUCKET).upload(thumbName, file, {
        contentType: file.type,
        upsert: true,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(THUMB_BUCKET).getPublicUrl(thumbName);
      const { error: metaErr } = await supabase.from('video_metadata').upsert({
        file_name: fileName,
        title: videos.find((v) => v.fileName === fileName)?.name ?? fileName,
        thumbnail_url: data.publicUrl,
      });
      if (metaErr) throw metaErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-videos'] });
      setThumbTargetFileName(null);
      toast({ title: 'Thumbnail updated' });
    },
    onError: (err: Error) => {
      toast({ title: 'Thumbnail upload failed', description: err.message, variant: 'destructive' });
    },
  });

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast({ title: 'Only video files are allowed', variant: 'destructive' });
      return;
    }
    uploadVideoMutation.mutate(file);
    e.target.value = '';
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !thumbTargetFileName) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Only image files are allowed for thumbnails', variant: 'destructive' });
      return;
    }
    uploadThumbMutation.mutate({ file, fileName: thumbTargetFileName });
    e.target.value = '';
  };

  const startEdit = (video: VideoItem) => {
    setEditingId(video.fileName);
    setEditTitle(video.name);
  };

  const saveTitle = (fileName: string) => {
    if (!editTitle.trim()) return;
    updateTitleMutation.mutate({ fileName, title: editTitle.trim() });
  };

  return (
    <Layout>
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Gallery</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Relive the memories from our events and gatherings
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">

          {/* Tabs + upload buttons */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex gap-2">
              <Button variant={tab === 'photos' ? 'default' : 'outline'} onClick={() => setTab('photos')}>Photos</Button>
              <Button variant={tab === 'videos' ? 'default' : 'outline'} onClick={() => setTab('videos')}>Videos</Button>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                {tab === 'photos' && (
                  <>
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                    <Button onClick={() => imageInputRef.current?.click()} disabled={uploadImageMutation.isPending} className="gap-2">
                      {uploadImageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploadImageMutation.isPending ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </>
                )}
                {tab === 'videos' && (
                  <>
                    <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFileChange} />
                    <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbChange} />
                    <Button onClick={() => videoInputRef.current?.click()} disabled={uploadVideoMutation.isPending} className="gap-2">
                      {uploadVideoMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploadVideoMutation.isPending ? 'Uploading...' : 'Upload Video'}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Photos grid */}
          {tab === 'photos' && (
            <>
              {loadingImages ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  No photos yet.{isAdmin && ' Upload one to get started.'}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image) => (
                    <Card key={image.id} className="group overflow-hidden hover:shadow-elevated transition-all duration-300 cursor-pointer" onClick={() => setSelectedImage(image)}>
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.fileName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 px-3 py-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <p className="text-white text-sm font-semibold capitalize truncate drop-shadow-lg">
                              {image.title}
                            </p>
                          </div>
                          {isAdmin && (
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteImageMutation.mutate(image.fileName); }}
                              disabled={deleteImageMutation.isPending}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center
                                hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                              aria-label="Delete image"
                            >
                              <X className="w-3.5 h-3.5 text-white" />
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Videos grid */}
          {tab === 'videos' && (
            <>
              {loadingVideos ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  No videos yet.{isAdmin && ' Upload one to get started.'}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id} className="group overflow-hidden hover:shadow-elevated transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="relative aspect-video bg-black overflow-hidden">
                          {video.thumbnailUrl ? (
                            <img src={video.thumbnailUrl} alt={video.name} className="w-full h-full object-cover opacity-80" />
                          ) : (
                            <video src={video.url} className="w-full h-full object-cover opacity-70" preload="metadata" />
                          )}

                          <button
                            onClick={() => setSelectedVideo(video)}
                            className="absolute inset-0 flex items-center justify-center"
                            aria-label={`Play ${video.name}`}
                          >
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                              <Play className="w-6 h-6 text-white fill-white ml-1" />
                            </div>
                          </button>

                          {isAdmin && (
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setThumbTargetFileName(video.fileName);
                                  thumbInputRef.current?.click();
                                }}
                                disabled={uploadThumbMutation.isPending && thumbTargetFileName === video.fileName}
                                className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                                aria-label="Upload thumbnail"
                              >
                                {uploadThumbMutation.isPending && thumbTargetFileName === video.fileName
                                  ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                  : <ImagePlus className="w-3.5 h-3.5 text-white" />}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteVideoMutation.mutate(video.fileName); }}
                                disabled={deleteVideoMutation.isPending}
                                className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                                aria-label="Delete video"
                              >
                                {deleteVideoMutation.isPending
                                  ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                  : <X className="w-3.5 h-3.5 text-white" />}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="px-3 py-3">
                          {isAdmin && editingId === video.fileName ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(video.fileName); if (e.key === 'Escape') setEditingId(null); }}
                                className="h-7 text-sm"
                                autoFocus
                              />
                              <button
                                onClick={() => saveTitle(video.fileName)}
                                disabled={updateTitleMutation.isPending}
                                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0"
                                aria-label="Save title"
                              >
                                {updateTitleMutation.isPending
                                  ? <Loader2 className="w-3.5 h-3.5 text-primary-foreground animate-spin" />
                                  : <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0"
                                aria-label="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium truncate">{video.name}</p>
                              {isAdmin && (
                                <button
                                  onClick={() => startEdit(video)}
                                  className="shrink-0 w-6 h-6 rounded flex items-center justify-center hover:bg-muted transition-colors"
                                  aria-label="Edit title"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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
                  alt={selectedImage.fileName}
                  className="w-full h-full object-cover rounded-t-3xl"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
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
                <h3 className="text-xl font-bold text-white capitalize mb-1">
                  {selectedImage.title}
                </h3>
                <p className="text-sm text-white/50 mb-4">
                  Hikma Class Union — Gallery
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                    </svg>
                    {new Date().toLocaleDateString('en-GB')}
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

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-3xl w-[90vw] p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-5 pb-3">
            <DialogTitle className="text-lg font-semibold">{selectedVideo?.name}</DialogTitle>
            <DialogDescription>Hikma Class Gallery</DialogDescription>
          </DialogHeader>
          <div className="bg-black w-full" style={{ height: '420px' }}>
            {selectedVideo && (
              <video key={selectedVideo.id} src={selectedVideo.url} controls autoPlay className="w-full h-full object-contain" />
            )}
          </div>
          <div className="flex items-center justify-between px-5 py-4 bg-background">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground ml-0.5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{selectedVideo?.name}</p>
                <p className="text-xs text-muted-foreground">Hikma Class Union</p>
              </div>
            </div>
            <Button onClick={() => setSelectedVideo(null)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5">
              Close Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
