import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users, Calendar, Newspaper, LogOut, GraduationCap,
  Upload, Trash2, Loader2,
  X, Pencil, Check, Plus, Save, UserCog,
  Sparkles, ImageIcon, Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { addStudent, getRegisteredStudents, type Student } from '@/data/sampleData';

const IMAGE_BUCKET = 'gallery-images';
const VIDEO_BUCKET = 'gallery-videos';
const THUMB_BUCKET = 'gallery-thumbnails';
const STUDENT_PHOTO_BUCKET = 'student-photos';

type ImageItem = { id: string; name: string; url: string; fileName: string };
type VideoItem = { id: string; name: string; url: string; fileName: string; thumbnailUrl: string | null };
type EventItem = { id: string; title: string; description: string; date: string; time: string; location: string; category: string; image_url: string | null };
type NewsItem  = { id: string; title: string; excerpt: string; date: string; author: string; category: string };

const emptyEvent: Omit<EventItem,'id'> = { title:'', description:'', date:'', time:'', location:'', category:'social', image_url: null };
const emptyNews:  Omit<NewsItem,'id'>  = { title:'', excerpt:'', date:'', author:'Admin', category:'' };
const emptyStudent: Omit<Student,'id'> = { name:'', email:'', phone:'', photo:'', classYear:'', graduationYear: 2026, department:'Hikma Class Union', bio:'' };

const Field = ({ label, value, onChange, placeholder, type='text' }: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string; type?:string }) => (
  <div>
    <label className="text-xs text-white/50 mb-1 block">{label}</label>
    <Input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className="bg-zinc-800 border-white/10 text-white placeholder:text-white/30 h-8 text-sm" />
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const eventImageRef = useRef<HTMLInputElement>(null);
  const newStudentPhotoRef = useRef<HTMLInputElement>(null);
  const studentPhotoRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // gallery state
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editImageTitle, setEditImageTitle] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editVideoTitle, setEditVideoTitle] = useState('');
  const [thumbTargetFileName, setThumbTargetFileName] = useState<string | null>(null);

  // students state
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<Student,'id'>>(emptyStudent);
  const [savingStudent, setSavingStudent] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string|null>(null);
  const [uploadingNewStudentPhoto, setUploadingNewStudentPhoto] = useState(false);
  const [uploadingPhotoForId, setUploadingPhotoForId] = useState<string|null>(null);
  const [editingStudent, setEditingStudent] = useState<Student|null>(null);

  // events state
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<EventItem,'id'>>(emptyEvent);
  const [editingEvent, setEditingEvent] = useState<EventItem|null>(null);
  const [savingEvent, setSavingEvent] = useState(false);
  const [uploadingEventImage, setUploadingEventImage] = useState(false);

  // news state
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [showAddNews, setShowAddNews] = useState(false);
  const [newNews, setNewNews] = useState<Omit<NewsItem,'id'>>(emptyNews);
  const [editingNews, setEditingNews] = useState<NewsItem|null>(null);
  const [savingNews, setSavingNews] = useState(false);

  // committee state
  type CommitteeMember = { id: string; name: string; position: string; photo: string };
  const emptyMember: Omit<CommitteeMember,'id'> = { name:'', position:'', photo:'' };
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [loadingCommittee, setLoadingCommittee] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Omit<CommitteeMember,'id'>>(emptyMember);
  const [editingMember, setEditingMember] = useState<CommitteeMember|null>(null);
  const [savingMember, setSavingMember] = useState(false);
  const [uploadingMemberPhotoId, setUploadingMemberPhotoId] = useState<string|null>(null);
  const [uploadingNewMemberPhoto, setUploadingNewMemberPhoto] = useState(false);
  const newMemberPhotoRef = useRef<HTMLInputElement>(null);
  const memberPhotoRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── fetch helpers ──────────────────────────────────────────────────────────
  const fetchStudents = async () => {
    setLoadingStudents(true);
    const data = await getRegisteredStudents();
    setStudents(data);
    setLoadingStudents(false);
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    const { data, error } = await (supabase as any).from('events').select('*').order('date', { ascending: true });
    if (!error && data) setEvents(data.map((e:any) => ({ id:e.id, title:e.title, description:e.description??'', date:e.date, time:e.time??'', location:e.location??'', category:e.category??'social', image_url: e.image_url??null })));
    setLoadingEvents(false);
  };

  const fetchNews = async () => {
    setLoadingNews(true);
    const { data, error } = await (supabase as any).from('news').select('*').order('date', { ascending: false });
    if (!error && data) setNews(data.map((n:any) => ({ id:n.id, title:n.title, excerpt:n.excerpt??'', date:n.date, author:n.author??'Admin', category:n.category??'' })));
    setLoadingNews(false);
  };

  const fetchCommittee = async () => {
    setLoadingCommittee(true);
    const { data, error } = await (supabase as any).from('committee_members').select('*').order('created_at', { ascending: true });
    if (!error && data) setCommittee(data.map((m:any) => ({ id:m.id, name:m.name, position:m.position, photo:m.photo??'' })));
    setLoadingCommittee(false);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) { navigate('/admin'); return; }
    fetchStudents();
    fetchEvents();
    fetchNews();
    fetchCommittee();
  }, [navigate]);

  // ── student mutations ──────────────────────────────────────────────────────
  const handleAddStudent = async () => {
    if (!newStudent.name.trim()) { toast({ title:'Name is required', variant:'destructive' }); return; }
    setSavingStudent(true);
    const result = await addStudent(newStudent);
    setSavingStudent(false);
    if (result.success) {
      toast({ title:'Student added' });
      setShowAddStudent(false);
      setNewStudent(emptyStudent);
      fetchStudents();
    } else {
      toast({ title:'Failed to add student', description: result.error, variant:'destructive' });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    setDeletingStudentId(id);
    const { error } = await (supabase as any).from('students').delete().eq('id', id);
    setDeletingStudentId(null);
    if (error) { toast({ title:'Delete failed', description: error.message, variant:'destructive' }); return; }
    toast({ title:'Student deleted' });
    fetchStudents();
  };

  const uploadStudentPhoto = async (file: File): Promise<string | null> => {
    // Ensure bucket exists (creates it if missing)
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.id === STUDENT_PHOTO_BUCKET)) {
      await supabase.storage.createBucket(STUDENT_PHOTO_BUCKET, { public: true });
    }
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { error } = await supabase.storage.from(STUDENT_PHOTO_BUCKET).upload(fileName, file, { contentType: file.type, upsert: false });
    if (error) { toast({ title: 'Photo upload failed', description: error.message, variant: 'destructive' }); return null; }
    return supabase.storage.from(STUDENT_PHOTO_BUCKET).getPublicUrl(fileName).data.publicUrl;
  };

  const handleNewStudentPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { toast({ title: 'Only image files allowed', variant: 'destructive' }); return; }
    setUploadingNewStudentPhoto(true);
    const url = await uploadStudentPhoto(file);
    setUploadingNewStudentPhoto(false);
    if (url) setNewStudent(s => ({ ...s, photo: url }));
    e.target.value = '';
  };

  const handleStudentPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>, studentId: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { toast({ title: 'Only image files allowed', variant: 'destructive' }); return; }
    setUploadingPhotoForId(studentId);
    const url = await uploadStudentPhoto(file);
    if (url) {
      const { error } = await (supabase as any).from('students').update({ photo: url }).eq('id', studentId);
      if (error) { toast({ title: 'Failed to update photo', description: error.message, variant: 'destructive' }); }
      else { toast({ title: 'Photo updated' }); fetchStudents(); }
    }
    setUploadingPhotoForId(null);
    e.target.value = '';
  };

  const handleRemoveStudentPhoto = async (studentId: string) => {
    const { error } = await (supabase as any).from('students').update({ photo: '' }).eq('id', studentId);
    if (error) { toast({ title: 'Failed to remove photo', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Photo removed' });
    fetchStudents();
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;
    if (!editingStudent.name.trim()) { toast({ title: 'Name is required', variant: 'destructive' }); return; }
    setSavingStudent(true);
    const { error } = await (supabase as any).from('students').update({
      name: editingStudent.name,
      email: editingStudent.email,
      phone: editingStudent.phone ?? '',
      class_year: editingStudent.classYear,
      graduation_year: editingStudent.graduationYear,
      bio: editingStudent.bio ?? '',
      photo: editingStudent.photo ?? '',
      role: editingStudent.role ?? '',
    }).eq('id', editingStudent.id);
    setSavingStudent(false);
    if (error) { toast({ title: 'Update failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Student updated' });
    setEditingStudent(null);
    fetchStudents();
  };

  // ── event mutations ────────────────────────────────────────────────────────
  const handleSaveEvent = async () => {
    const payload = editingEvent ?? newEvent;
    if (!payload.title.trim()) { toast({ title:'Title is required', variant:'destructive' }); return; }
    setSavingEvent(true);
    if (editingEvent) {
      const { error } = await (supabase as any).from('events').update({ title:editingEvent.title, description:editingEvent.description, date:editingEvent.date, time:editingEvent.time, location:editingEvent.location, category:editingEvent.category, image_url:editingEvent.image_url }).eq('id', editingEvent.id);
      setSavingEvent(false);
      if (error) { toast({ title:'Update failed', description:error.message, variant:'destructive' }); return; }
      toast({ title:'Event updated' });
      setEditingEvent(null);
    } else {
      const { error } = await (supabase as any).from('events').insert([{ title:newEvent.title, description:newEvent.description, date:newEvent.date, time:newEvent.time, location:newEvent.location, category:newEvent.category, image_url:newEvent.image_url }]);
      setSavingEvent(false);
      if (error) { toast({ title:'Failed to add event', description:error.message, variant:'destructive' }); return; }
      toast({ title:'Event added' });
      setShowAddEvent(false);
      setNewEvent(emptyEvent);
    }
    fetchEvents();
  };

  const handleDeleteEvent = async (id: string) => {
    const { error } = await (supabase as any).from('events').delete().eq('id', id);
    if (error) { toast({ title:'Delete failed', description:error.message, variant:'destructive' }); return; }
    toast({ title:'Event deleted' });
    fetchEvents();
  };

  // ── news mutations ─────────────────────────────────────────────────────────
  const handleSaveNews = async () => {
    const payload = editingNews ?? newNews;
    if (!payload.title.trim()) { toast({ title:'Title is required', variant:'destructive' }); return; }
    setSavingNews(true);
    if (editingNews) {
      const { error } = await (supabase as any).from('news').update({ title:editingNews.title, excerpt:editingNews.excerpt, date:editingNews.date, author:editingNews.author, category:editingNews.category }).eq('id', editingNews.id);
      setSavingNews(false);
      if (error) { toast({ title:'Update failed', description:error.message, variant:'destructive' }); return; }
      toast({ title:'News updated' });
      setEditingNews(null);
    } else {
      const { error } = await (supabase as any).from('news').insert([{ title:newNews.title, excerpt:newNews.excerpt, date:newNews.date, author:newNews.author, category:newNews.category }]);
      setSavingNews(false);
      if (error) { toast({ title:'Failed to add news', description:error.message, variant:'destructive' }); return; }
      toast({ title:'News added' });
      setShowAddNews(false);
      setNewNews(emptyNews);
    }
    fetchNews();
  };

  const handleDeleteNews = async (id: string) => {
    const { error } = await (supabase as any).from('news').delete().eq('id', id);
    if (error) { toast({ title:'Delete failed', description:error.message, variant:'destructive' }); return; }
    toast({ title:'News deleted' });
    fetchNews();
  };

  // ── committee mutations ────────────────────────────────────────────────────
  const COMMITTEE_PHOTO_BUCKET = 'committee-photos';

  const uploadMemberPhoto = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { error } = await supabase.storage
      .from(COMMITTEE_PHOTO_BUCKET)
      .upload(fileName, file, { contentType: file.type, upsert: false });
    if (error) {
      toast({ title: 'Photo upload failed', description: error.message, variant: 'destructive' });
      return null;
    }
    return supabase.storage.from(COMMITTEE_PHOTO_BUCKET).getPublicUrl(fileName).data.publicUrl;
  };

  const handleNewMemberPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingNewMemberPhoto(true);
    const url = await uploadMemberPhoto(file);
    setUploadingNewMemberPhoto(false);
    if (url) setNewMember(m => ({ ...m, photo: url }));
    e.target.value = '';
  };

  const handleMemberPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>, memberId: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingMemberPhotoId(memberId);
    const url = await uploadMemberPhoto(file);
    if (url) {
      const { error } = await (supabase as any).from('committee_members').update({ photo: url }).eq('id', memberId);
      if (error) toast({ title: 'Failed to update photo', variant: 'destructive' });
      else { toast({ title: 'Photo updated' }); fetchCommittee(); }
    }
    setUploadingMemberPhotoId(null);
    e.target.value = '';
  };

  const handleRemoveMemberPhoto = async (memberId: string) => {
    const { error } = await (supabase as any).from('committee_members').update({ photo: '' }).eq('id', memberId);
    if (error) { toast({ title: 'Failed to remove photo', variant: 'destructive' }); return; }
    toast({ title: 'Photo removed' });
    fetchCommittee();
  };

  const handleSaveMember = async () => {
    const payload = editingMember ?? newMember;
    if (!payload.name.trim()) { toast({ title: 'Name is required', variant: 'destructive' }); return; }
    setSavingMember(true);
    if (editingMember) {
      const { error } = await (supabase as any).from('committee_members').update({ name: editingMember.name, position: editingMember.position, photo: editingMember.photo }).eq('id', editingMember.id);
      setSavingMember(false);
      if (error) { toast({ title: 'Update failed', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Member updated' });
      setEditingMember(null);
    } else {
      const { error } = await (supabase as any).from('committee_members').insert([{ name: newMember.name, position: newMember.position, photo: newMember.photo }]);
      setSavingMember(false);
      if (error) { toast({ title: 'Add failed', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Member added' });
      setNewMember(emptyMember);
      setShowAddMember(false);
    }
    fetchCommittee();
  };

  const handleDeleteMember = async (id: string) => {
    const { error } = await (supabase as any).from('committee_members').delete().eq('id', id);
    if (error) { toast({ title: 'Delete failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Member removed' });
    fetchCommittee();
  };

  // ── gallery queries ────────────────────────────────────────────────────────
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
      return (storageRes.data || []).filter(f => f.name !== '.emptyFolderPlaceholder').map(f => ({
        id: f.id ?? f.name, fileName: f.name,
        name: metaMap[f.name] ?? f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '),
        url: supabase.storage.from(IMAGE_BUCKET).getPublicUrl(f.name).data.publicUrl,
      }));
    },
  });

  const { data: videos = [], isLoading: loadingVideos } = useQuery<VideoItem[]>({
    queryKey: ['gallery-videos'],
    queryFn: async () => {
      const [storageRes, metaRes] = await Promise.all([
        supabase.storage.from(VIDEO_BUCKET).list('', { sortBy: { column: 'created_at', order: 'desc' } }),
        supabase.from('video_metadata').select('file_name, title, thumbnail_url'),
      ]);
      if (storageRes.error) throw storageRes.error;
      const metaMap: Record<string, { title: string; thumbnail_url: string | null }> = {};
      (metaRes.data ?? []).forEach((m) => { metaMap[m.file_name] = { title: m.title, thumbnail_url: m.thumbnail_url }; });
      return (storageRes.data || []).filter(f => f.name !== '.emptyFolderPlaceholder').map(f => ({
        id: f.id ?? f.name, fileName: f.name,
        name: metaMap[f.name]?.title ?? f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '),
        thumbnailUrl: metaMap[f.name]?.thumbnail_url ?? null,
        url: supabase.storage.from(VIDEO_BUCKET).getPublicUrl(f.name).data.publicUrl,
      }));
    },
  });

  // gallery mutations
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(fileName, file, { contentType: file.type, upsert: false });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery-images'] }); toast({ title: 'Image uploaded' }); },
    onError: (err: Error) => toast({ title: 'Upload failed', description: err.message, variant: 'destructive' }),
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (fileName: string) => { const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([fileName]); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery-images'] }); toast({ title: 'Image deleted' }); },
    onError: (err: Error) => toast({ title: 'Delete failed', description: err.message, variant: 'destructive' }),
  });

  const updateImageTitleMutation = useMutation({
    mutationFn: async ({ fileName, title }: { fileName: string; title: string }) => {
      const { error } = await supabase.from('image_metadata').upsert({ file_name: fileName, title }); if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery-images'] }); setEditingImageId(null); toast({ title: 'Title updated' }); },
    onError: (err: Error) => toast({ title: 'Update failed', description: err.message, variant: 'destructive' }),
  });

  const uploadVideoMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(fileName, file, { contentType: file.type, upsert: false });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery-videos'] }); toast({ title: 'Video uploaded' }); },
    onError: (err: Error) => toast({ title: 'Upload failed', description: err.message, variant: 'destructive' }),
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (fileName: string) => {
      const { error } = await supabase.storage.from(VIDEO_BUCKET).remove([fileName]);
      if (error) throw error;
      // also clean up metadata row (ignore error if not found)
      await supabase.from('video_metadata').delete().eq('file_name', fileName);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery-videos'] }); toast({ title: 'Video deleted' }); },
    onError: (err: Error) => toast({ title: 'Delete failed', description: err.message, variant: 'destructive' }),
  });

  const updateVideoTitleMutation = useMutation({
    mutationFn: async ({ fileName, title }: { fileName: string; title: string }) => {
      const existing = videos.find(v => v.fileName === fileName);
      const { error } = await supabase.from('video_metadata').upsert({ file_name: fileName, title, thumbnail_url: existing?.thumbnailUrl ?? null });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery-videos'] }); setEditingVideoId(null); toast({ title: 'Title updated' }); },
    onError: (err: Error) => toast({ title: 'Update failed', description: err.message, variant: 'destructive' }),
  });

  const uploadThumbMutation = useMutation({
    mutationFn: async ({ file, fileName }: { file: File; fileName: string }) => {
      const ext = file.name.split('.').pop();
      const thumbName = `thumb_${fileName.replace(/\.[^.]+$/, '')}.${ext}`;
      const { error: upErr } = await supabase.storage.from(THUMB_BUCKET).upload(thumbName, file, { contentType: file.type, upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(THUMB_BUCKET).getPublicUrl(thumbName);
      const thumbUrl = data.publicUrl;
      const existing = videos.find(v => v.fileName === fileName);
      const title = existing?.name ?? fileName.replace(/\.[^.]+$/, '').replace(/_/g, ' ');
      // check if row exists first, then insert or update
      const { data: existingRow } = await supabase.from('video_metadata').select('file_name').eq('file_name', fileName).maybeSingle();
      if (existingRow) {
        const { error } = await supabase.from('video_metadata').update({ thumbnail_url: thumbUrl }).eq('file_name', fileName);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('video_metadata').insert({ file_name: fileName, title, thumbnail_url: thumbUrl });
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery-videos'] }); setThumbTargetFileName(null); toast({ title: 'Thumbnail updated' }); },
    onError: (err: Error) => toast({ title: 'Thumbnail upload failed', description: err.message, variant: 'destructive' }),
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { toast({ title: 'Only image files allowed', variant: 'destructive' }); return; }
    uploadImageMutation.mutate(file); e.target.value = '';
  };
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('video/')) { toast({ title: 'Only video files allowed', variant: 'destructive' }); return; }
    uploadVideoMutation.mutate(file); e.target.value = '';
  };
  const handleThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !thumbTargetFileName) return;
    if (!file.type.startsWith('image/')) { toast({ title: 'Only image files allowed for thumbnails', variant: 'destructive' }); return; }
    uploadThumbMutation.mutate({ file, fileName: thumbTargetFileName }); e.target.value = '';
  };

  const handleEventImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { toast({ title: 'Only image files allowed', variant: 'destructive' }); return; }
    setUploadingEventImage(true);
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { error } = await supabase.storage.from('event-images').upload(fileName, file, { contentType: file.type, upsert: false });
    if (error) { toast({ title: 'Image upload failed', description: error.message, variant: 'destructive' }); setUploadingEventImage(false); return; }
    const { data } = supabase.storage.from('event-images').getPublicUrl(fileName);
    if (editingEvent) setEditingEvent(ev => ev && ({ ...ev, image_url: data.publicUrl }));
    else setNewEvent(ev => ({ ...ev, image_url: data.publicUrl }));
    setUploadingEventImage(false);
    toast({ title: 'Image uploaded' });
    e.target.value = '';
  };

  const handleLogout = () => { localStorage.removeItem('adminLoggedIn'); navigate('/admin'); };

  const stats = [
    { icon: Users,      label: 'Total Students',   value: loadingStudents ? '...' : students.length, color: 'bg-violet-500/20 text-violet-400' },
    { icon: Calendar,   label: 'Events',            value: loadingEvents   ? '...' : events.length,   color: 'bg-cyan-500/20 text-cyan-400' },
    { icon: Newspaper,  label: 'News Articles',     value: loadingNews     ? '...' : news.length,     color: 'bg-amber-500/20 text-amber-400' },
    { icon: ImageIcon,  label: 'Gallery Images',    value: images.length,                             color: 'bg-green-500/20 text-green-400' },
  ];

  // ── shared form field helper ───────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-serif font-bold text-lg text-white">Admin Panel</span>
                <p className="text-xs text-white/50">Dashboard</p>
              </div>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-white/20 text-white/80 bg-transparent hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50">
              <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative space-y-8">
        {/* Title */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-4xl font-bold text-white">Dashboard</h1>
            <Sparkles className="w-6 h-6 text-white/60 animate-pulse" />
          </div>
          <p className="text-white/50">Welcome back! Manage your union from here.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}>
              <Card className="border-white/10 bg-zinc-900 hover:scale-105 transition-all duration-300">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/50 mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ── STUDENTS ─────────────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-zinc-900">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-3 text-white font-serif text-2xl">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center"><Users className="w-5 h-5 text-violet-400" /></div>
                Students
              </CardTitle>
              <Button size="sm" onClick={() => setShowAddStudent(v=>!v)} className="gap-2 bg-white text-black hover:bg-white/90">
                <Plus className="w-4 h-4" />{showAddStudent ? 'Cancel' : 'Add Student'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add form */}
            {showAddStudent && (
              <div className="mb-6 p-4 rounded-xl bg-zinc-800 border border-white/10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Field label="Name *" value={newStudent.name} onChange={v=>setNewStudent(s=>({...s,name:v}))} placeholder="Full name" />
                <Field label="Email" value={newStudent.email} onChange={v=>setNewStudent(s=>({...s,email:v}))} placeholder="email@example.com" type="email" />
                <Field label="Phone" value={newStudent.phone??''} onChange={v=>setNewStudent(s=>({...s,phone:v}))} placeholder="+91 ..." />
                <Field label="Class Year" value={newStudent.classYear} onChange={v=>setNewStudent(s=>({...s,classYear:v}))} placeholder="2026" />
                <Field label="Bio" value={newStudent.bio??''} onChange={v=>setNewStudent(s=>({...s,bio:v}))} placeholder="Short bio..." />
                <Field label="Role (badge)" value={newStudent.role??''} onChange={v=>setNewStudent(s=>({...s,role:v}))} placeholder="Secretary / President ..." />
                {/* Photo upload */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs text-white/50 mb-1 block">Profile Photo</label>
                  <div className="flex items-center gap-3">
                    {newStudent.photo ? (
                      <img src={newStudent.photo} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 text-violet-300 font-bold text-lg">
                        {newStudent.name ? newStudent.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                    <input ref={newStudentPhotoRef} type="file" accept="image/*" className="hidden" onChange={handleNewStudentPhotoChange} />
                    <Button type="button" size="sm" variant="outline" onClick={() => newStudentPhotoRef.current?.click()}
                      disabled={uploadingNewStudentPhoto}
                      className="gap-2 border-white/20 text-white/70 bg-transparent hover:bg-white/10">
                      {uploadingNewStudentPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {uploadingNewStudentPhoto ? 'Uploading...' : newStudent.photo ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                    {newStudent.photo && (
                      <button type="button" onClick={() => setNewStudent(s => ({ ...s, photo: '' }))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                  <Button size="sm" onClick={handleAddStudent} disabled={savingStudent} className="gap-2 bg-violet-600 hover:bg-violet-500 text-white">
                    {savingStudent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Student
                  </Button>
                </div>
              </div>
            )}
            {/* Edit form */}
            {editingStudent && (
              <div className="mb-6 p-4 rounded-xl bg-zinc-800 border border-violet-500/30 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-2 mb-1">
                  <Pencil className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-violet-300">Editing: {editingStudent.name}</span>
                </div>
                <Field label="Name *" value={editingStudent.name} onChange={v=>setEditingStudent(s=>s&&({...s,name:v}))} placeholder="Full name" />
                <Field label="Email" value={editingStudent.email} onChange={v=>setEditingStudent(s=>s&&({...s,email:v}))} placeholder="email@example.com" type="email" />
                <Field label="Phone" value={editingStudent.phone??''} onChange={v=>setEditingStudent(s=>s&&({...s,phone:v}))} placeholder="+91 ..." />
                <Field label="Class Year" value={editingStudent.classYear} onChange={v=>setEditingStudent(s=>s&&({...s,classYear:v}))} placeholder="2026" />
                <Field label="Bio" value={editingStudent.bio??''} onChange={v=>setEditingStudent(s=>s&&({...s,bio:v}))} placeholder="Short bio..." />
                <Field label="Role (badge)" value={editingStudent.role??''} onChange={v=>setEditingStudent(s=>s&&({...s,role:v}))} placeholder="Secretary / President ..." />
                <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingStudent(null)} className="text-white/50 hover:text-white">Cancel</Button>
                  <Button size="sm" onClick={handleUpdateStudent} disabled={savingStudent} className="gap-2 bg-violet-600 hover:bg-violet-500 text-white">
                    {savingStudent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update Student
                  </Button>
                </div>
              </div>
            )}
            {loadingStudents ? (
              <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-white/40" /></div>
            ) : students.length === 0 ? (
              <p className="text-center text-white/40 py-10">No students yet. Add one above.</p>
            ) : (
              <div className="space-y-2">
                {students.map(s => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="relative group/photo shrink-0">
                      {s.photo ? (
                        <img src={s.photo} alt={s.name} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-300">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {/* hover overlay for photo actions */}
                      <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => studentPhotoRefs.current[s.id]?.click()}
                          disabled={uploadingPhotoForId === s.id}
                          className="text-white"
                          aria-label="Upload photo"
                          title="Upload photo"
                        >
                          {uploadingPhotoForId === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <input
                        type="file" accept="image/*" className="hidden"
                        ref={el => { studentPhotoRefs.current[s.id] = el; }}
                        onChange={e => handleStudentPhotoChange(e, s.id)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{s.name}</p>
                      <p className="text-xs text-white/40 truncate">{s.email} {s.classYear ? `· ${s.classYear}` : ''}</p>
                    </div>
                    {s.photo && (
                      <button
                        onClick={() => handleRemoveStudentPhoto(s.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-orange-400 hover:bg-orange-500/20 transition-colors shrink-0"
                        aria-label="Remove photo"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => { setEditingStudent(s); setShowAddStudent(false); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-violet-400 hover:bg-violet-500/20 transition-colors shrink-0"
                      aria-label="Edit student"
                      title="Edit student"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(s.id)}
                      disabled={deletingStudentId === s.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
                      aria-label="Delete student"
                    >
                      {deletingStudentId === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── EVENTS ───────────────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-zinc-900">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-3 text-white font-serif text-2xl">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center"><Calendar className="w-5 h-5 text-cyan-400" /></div>
                Events
              </CardTitle>
              <Button size="sm" onClick={() => { setShowAddEvent(v=>!v); setEditingEvent(null); }} className="gap-2 bg-white text-black hover:bg-white/90">
                <Plus className="w-4 h-4" />{showAddEvent ? 'Cancel' : 'Add Event'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add / Edit form */}
            {(showAddEvent || editingEvent) && (
              <div className="mb-6 p-4 rounded-xl bg-zinc-800 border border-white/10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Field label="Title *" value={editingEvent ? editingEvent.title : newEvent.title}
                  onChange={v => editingEvent ? setEditingEvent(e=>e&&({...e,title:v})) : setNewEvent(e=>({...e,title:v}))} placeholder="Event title" />
                <Field label="Date" value={editingEvent ? editingEvent.date : newEvent.date} type="date"
                  onChange={v => editingEvent ? setEditingEvent(e=>e&&({...e,date:v})) : setNewEvent(e=>({...e,date:v}))} />
                <Field label="Time" value={editingEvent ? editingEvent.time : newEvent.time}
                  onChange={v => editingEvent ? setEditingEvent(e=>e&&({...e,time:v})) : setNewEvent(e=>({...e,time:v}))} placeholder="4:00 PM" />
                <Field label="Location" value={editingEvent ? editingEvent.location : newEvent.location}
                  onChange={v => editingEvent ? setEditingEvent(e=>e&&({...e,location:v})) : setNewEvent(e=>({...e,location:v}))} placeholder="Venue" />
                <Field label="Category" value={editingEvent ? editingEvent.category : newEvent.category}
                  onChange={v => editingEvent ? setEditingEvent(e=>e&&({...e,category:v})) : setNewEvent(e=>({...e,category:v}))} placeholder="social / seminar / reunion" />
                <Field label="Description" value={editingEvent ? editingEvent.description : newEvent.description}
                  onChange={v => editingEvent ? setEditingEvent(e=>e&&({...e,description:v})) : setNewEvent(e=>({...e,description:v}))} placeholder="Short description" />
                {/* Image upload */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs text-white/50 mb-1 block">Event Image</label>
                  <div className="flex items-center gap-3">
                    {(editingEvent?.image_url || newEvent.image_url) && (
                      <img src={editingEvent?.image_url ?? newEvent.image_url ?? ''} alt="Event"
                        className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0" />
                    )}
                    <input ref={eventImageRef} type="file" accept="image/*" className="hidden" onChange={handleEventImageChange} />
                    <Button type="button" size="sm" variant="outline" onClick={() => eventImageRef.current?.click()}
                      disabled={uploadingEventImage}
                      className="gap-2 border-white/20 text-white/70 bg-transparent hover:bg-white/10">
                      {uploadingEventImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {uploadingEventImage ? 'Uploading...' : (editingEvent?.image_url || newEvent.image_url) ? 'Change Image' : 'Upload Image'}
                    </Button>
                    {(editingEvent?.image_url || newEvent.image_url) && (
                      <button type="button" onClick={() => editingEvent ? setEditingEvent(e=>e&&({...e,image_url:null})) : setNewEvent(e=>({...e,image_url:null}))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
                  {editingEvent && <Button size="sm" variant="ghost" onClick={() => setEditingEvent(null)} className="text-white/50 hover:text-white">Cancel</Button>}
                  <Button size="sm" onClick={handleSaveEvent} disabled={savingEvent} className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white">
                    {savingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingEvent ? 'Update Event' : 'Save Event'}
                  </Button>
                </div>
              </div>
            )}
            {loadingEvents ? (
              <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-white/40" /></div>
            ) : events.length === 0 ? (
              <p className="text-center text-white/40 py-10">No events yet. Add one above.</p>
            ) : (
              <div className="space-y-2">
                {events.map(ev => (
                  <div key={ev.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 border border-white/5 hover:border-white/10 transition-colors">
                    {ev.image_url
                      ? <img src={ev.image_url} alt={ev.title} className="w-12 h-10 object-cover rounded-lg shrink-0 border border-white/10" />
                      : <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0"><Calendar className="w-4 h-4 text-cyan-400" /></div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{ev.title}</p>
                      <p className="text-xs text-white/40">{ev.date} {ev.time ? `· ${ev.time}` : ''} {ev.location ? `· ${ev.location}` : ''}</p>
                    </div>
                    <button onClick={() => { setEditingEvent(ev); setShowAddEvent(false); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors shrink-0" aria-label="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteEvent(ev.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-colors shrink-0" aria-label="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── NEWS ─────────────────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-zinc-900">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-3 text-white font-serif text-2xl">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center"><Newspaper className="w-5 h-5 text-amber-400" /></div>
                News
              </CardTitle>
              <Button size="sm" onClick={() => { setShowAddNews(v=>!v); setEditingNews(null); }} className="gap-2 bg-white text-black hover:bg-white/90">
                <Plus className="w-4 h-4" />{showAddNews ? 'Cancel' : 'Add News'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(showAddNews || editingNews) && (
              <div className="mb-6 p-4 rounded-xl bg-zinc-800 border border-white/10 grid sm:grid-cols-2 gap-3">
                <Field label="Title *" value={editingNews ? editingNews.title : newNews.title}
                  onChange={v => editingNews ? setEditingNews(n=>n&&({...n,title:v})) : setNewNews(n=>({...n,title:v}))} placeholder="News title" />
                <Field label="Date" value={editingNews ? editingNews.date : newNews.date} type="date"
                  onChange={v => editingNews ? setEditingNews(n=>n&&({...n,date:v})) : setNewNews(n=>({...n,date:v}))} />
                <Field label="Author" value={editingNews ? editingNews.author : newNews.author}
                  onChange={v => editingNews ? setEditingNews(n=>n&&({...n,author:v})) : setNewNews(n=>({...n,author:v}))} placeholder="Author name" />
                <Field label="Category" value={editingNews ? editingNews.category : newNews.category}
                  onChange={v => editingNews ? setEditingNews(n=>n&&({...n,category:v})) : setNewNews(n=>({...n,category:v}))} placeholder="Achievement / Announcement" />
                <div className="sm:col-span-2">
                  <Field label="Excerpt" value={editingNews ? editingNews.excerpt : newNews.excerpt}
                    onChange={v => editingNews ? setEditingNews(n=>n&&({...n,excerpt:v})) : setNewNews(n=>({...n,excerpt:v}))} placeholder="Short summary..." />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2">
                  {editingNews && <Button size="sm" variant="ghost" onClick={() => setEditingNews(null)} className="text-white/50 hover:text-white">Cancel</Button>}
                  <Button size="sm" onClick={handleSaveNews} disabled={savingNews} className="gap-2 bg-amber-600 hover:bg-amber-500 text-white">
                    {savingNews ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingNews ? 'Update News' : 'Save News'}
                  </Button>
                </div>
              </div>
            )}
            {loadingNews ? (
              <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-white/40" /></div>
            ) : news.length === 0 ? (
              <p className="text-center text-white/40 py-10">No news yet. Add one above.</p>
            ) : (
              <div className="space-y-2">
                {news.map(n => (
                  <div key={n.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Newspaper className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{n.title}</p>
                      <p className="text-xs text-white/40">{n.date} {n.category ? `· ${n.category}` : ''} · {n.author}</p>
                    </div>
                    <button onClick={() => { setEditingNews(n); setShowAddNews(false); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors shrink-0" aria-label="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteNews(n.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-colors shrink-0" aria-label="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── GALLERY IMAGES ───────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-zinc-900">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-3 text-white font-serif text-2xl">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-white" /></div>
                Gallery Images
              </CardTitle>
              <div>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                <Button size="sm" onClick={() => imageInputRef.current?.click()} disabled={uploadImageMutation.isPending} className="gap-2 bg-white text-black hover:bg-white/90">
                  {uploadImageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploadImageMutation.isPending ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingImages ? <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-white/40" /></div>
            : images.length === 0 ? <p className="text-center text-white/40 py-10">No images yet.</p>
            : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {images.map((image, idx) => (
                  <motion.div key={image.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: idx*0.04 }}
                    className="group rounded-xl overflow-hidden border border-white/10 bg-zinc-800">
                    <div className="aspect-square relative overflow-hidden cursor-pointer" onClick={() => setSelectedImage(image)}>
                      <img src={image.url} alt={image.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                    <div className="px-3 py-2 bg-zinc-800">
                      {editingImageId === image.fileName ? (
                        <div className="flex items-center gap-1.5">
                          <Input value={editImageTitle} onChange={e=>setEditImageTitle(e.target.value)}
                            onKeyDown={e=>{ if(e.key==='Enter') updateImageTitleMutation.mutate({fileName:image.fileName,title:editImageTitle.trim()}); if(e.key==='Escape') setEditingImageId(null); }}
                            className="h-6 text-xs bg-zinc-700 border-white/20 text-white px-2" autoFocus />
                          <button onClick={()=>updateImageTitleMutation.mutate({fileName:image.fileName,title:editImageTitle.trim()})} disabled={updateImageTitleMutation.isPending}
                            className="w-6 h-6 rounded bg-green-600 flex items-center justify-center shrink-0 hover:bg-green-500">
                            {updateImageTitleMutation.isPending ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Check className="w-3 h-3 text-white" />}
                          </button>
                          <button onClick={()=>setEditingImageId(null)} className="w-6 h-6 rounded bg-zinc-600 flex items-center justify-center shrink-0 hover:bg-zinc-500">
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-medium truncate flex-1 text-white/70">{image.name}</p>
                          <button onClick={()=>{setEditingImageId(image.fileName);setEditImageTitle(image.name);}}
                            className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors shrink-0">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={()=>deleteImageMutation.mutate(image.fileName)} disabled={deleteImageMutation.isPending}
                            className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-colors shrink-0">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── COMMITTEE ────────────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-zinc-900">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-3 text-white font-serif text-2xl">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center"><UserCog className="w-5 h-5 text-teal-400" /></div>
                Committee Members
              </CardTitle>
              <Button size="sm" onClick={() => setShowAddMember(v=>!v)} className="gap-2 bg-white text-black hover:bg-white/90">
                <Plus className="w-4 h-4" />{showAddMember ? 'Cancel' : 'Add Member'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add form */}
            {showAddMember && (
              <div className="mb-6 p-4 rounded-xl bg-zinc-800 border border-white/10 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Name *" value={newMember.name} onChange={v=>setNewMember(m=>({...m,name:v}))} placeholder="Full name" />
                  <Field label="Position *" value={newMember.position} onChange={v=>setNewMember(m=>({...m,position:v}))} placeholder="e.g. President" />
                </div>
                {/* photo upload for new member */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Profile Photo</label>
                  <div className="flex items-center gap-3">
                    {newMember.photo
                      ? <img src={newMember.photo} alt="preview" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                      : <div className="w-12 h-12 rounded-full bg-zinc-700 border border-white/10 flex items-center justify-center text-white/30 text-xs">No photo</div>
                    }
                    <input ref={newMemberPhotoRef} type="file" accept="image/*" className="hidden" onChange={handleNewMemberPhotoChange} />
                    <Button size="sm" variant="outline" onClick={() => newMemberPhotoRef.current?.click()}
                      disabled={uploadingNewMemberPhoto} className="gap-2 border-white/20 text-white/70 bg-transparent hover:bg-white/10">
                      {uploadingNewMemberPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {uploadingNewMemberPhoto ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                    {newMember.photo && (
                      <Button size="sm" variant="outline" onClick={() => setNewMember(m=>({...m,photo:''}))}
                        className="gap-2 border-red-500/30 text-red-400 bg-transparent hover:bg-red-500/20">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
                <Button size="sm" onClick={handleSaveMember} disabled={savingMember} className="gap-2 bg-teal-600 hover:bg-teal-500 text-white">
                  {savingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {savingMember ? 'Saving...' : 'Add Member'}
                </Button>
              </div>
            )}

            {/* Edit form */}
            {editingMember && (
              <div className="mb-6 p-4 rounded-xl bg-zinc-800 border border-teal-500/30 space-y-3">
                <p className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Editing: {editingMember.name}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Name *" value={editingMember.name} onChange={v=>setEditingMember(m=>m&&({...m,name:v}))} placeholder="Full name" />
                  <Field label="Position *" value={editingMember.position} onChange={v=>setEditingMember(m=>m&&({...m,position:v}))} placeholder="e.g. President" />
                </div>
                <div className="flex items-center gap-3">
                  {editingMember.photo
                    ? <img src={editingMember.photo} alt="preview" className="w-12 h-12 rounded-full object-cover border border-white/20" />
                    : <div className="w-12 h-12 rounded-full bg-zinc-700 border border-white/10 flex items-center justify-center text-white/30 text-xs">No photo</div>
                  }
                  <input ref={el => { memberPhotoRefs.current[editingMember.id] = el; }} type="file" accept="image/*" className="hidden"
                    onChange={e => handleMemberPhotoChange(e, editingMember.id)} />
                  <Button size="sm" variant="outline" onClick={() => memberPhotoRefs.current[editingMember.id]?.click()}
                    disabled={uploadingMemberPhotoId === editingMember.id} className="gap-2 border-white/20 text-white/70 bg-transparent hover:bg-white/10">
                    {uploadingMemberPhotoId === editingMember.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploadingMemberPhotoId === editingMember.id ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  {editingMember.photo && (
                    <Button size="sm" variant="outline" onClick={() => handleRemoveMemberPhoto(editingMember.id)}
                      className="gap-2 border-red-500/30 text-red-400 bg-transparent hover:bg-red-500/20">
                      <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveMember} disabled={savingMember} className="gap-2 bg-teal-600 hover:bg-teal-500 text-white">
                    {savingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {savingMember ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingMember(null)} className="border-white/20 text-white/70 bg-transparent hover:bg-white/10">
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
              </div>
            )}

            {loadingCommittee
              ? <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-white/40" /></div>
              : committee.length === 0
              ? <p className="text-center text-white/40 py-10">No committee members yet.</p>
              : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {committee.map((member) => (
                    <div key={member.id} className="group flex items-center gap-3 p-3 rounded-xl bg-zinc-800 border border-white/10
                      hover:border-teal-500/40 transition-all duration-200">
                      {/* avatar */}
                      <div className="relative shrink-0">
                        {member.photo
                          ? <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/40" />
                          : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                              {member.name.slice(0,2).toUpperCase()}
                            </div>
                        }
                        {/* photo hover actions */}
                        <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity
                          flex items-center justify-center gap-0.5">
                          <input ref={el => { memberPhotoRefs.current[member.id] = el; }} type="file" accept="image/*" className="hidden"
                            onChange={e => handleMemberPhotoChange(e, member.id)} />
                          <button onClick={() => memberPhotoRefs.current[member.id]?.click()}
                            disabled={uploadingMemberPhotoId === member.id}
                            className="w-5 h-5 rounded flex items-center justify-center text-white hover:text-teal-300 transition-colors"
                            title="Upload photo">
                            {uploadingMemberPhotoId === member.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          </button>
                          {member.photo && (
                            <button onClick={() => handleRemoveMemberPhoto(member.id)}
                              className="w-5 h-5 rounded flex items-center justify-center text-white hover:text-red-400 transition-colors"
                              title="Remove photo">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                        <p className="text-xs text-teal-400 truncate">{member.position}</p>
                      </div>
                      {/* actions */}
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingMember(member)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteMember(member.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </CardContent>
        </Card>

        {/* ── GALLERY VIDEOS ───────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-zinc-900">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-3 text-white font-serif text-2xl">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Video className="w-5 h-5 text-white" /></div>
                Gallery Videos
              </CardTitle>
              <div className="flex gap-2">
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFileChange} />
                <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbFileChange} />
                <Button size="sm" onClick={() => videoInputRef.current?.click()} disabled={uploadVideoMutation.isPending} className="gap-2 bg-white text-black hover:bg-white/90">
                  {uploadVideoMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploadVideoMutation.isPending ? 'Uploading...' : 'Upload Video'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingVideos ? <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-white/40" /></div>
            : videos.length === 0 ? <p className="text-center text-white/40 py-10">No videos yet.</p>
            : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((video, idx) => (
                  <motion.div key={video.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: idx*0.07 }}
                    className="group rounded-xl overflow-hidden border border-white/10 bg-zinc-800">
                    <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                      {video.thumbnailUrl
                        ? <img src={video.thumbnailUrl} alt={video.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <video src={video.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" preload="metadata" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button onClick={()=>{setThumbTargetFileName(video.fileName);thumbInputRef.current?.click();}}
                        disabled={uploadThumbMutation.isPending && thumbTargetFileName===video.fileName}
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 hover:bg-blue-600 text-white text-xs font-medium">
                        {uploadThumbMutation.isPending && thumbTargetFileName===video.fileName ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                        Thumbnail
                      </button>
                    </div>
                    <div className="px-3 py-2.5 bg-zinc-800">
                      {editingVideoId === video.fileName ? (
                        <div className="flex items-center gap-1.5">
                          <Input value={editVideoTitle} onChange={e=>setEditVideoTitle(e.target.value)}
                            onKeyDown={e=>{ if(e.key==='Enter') updateVideoTitleMutation.mutate({fileName:video.fileName,title:editVideoTitle.trim()}); if(e.key==='Escape') setEditingVideoId(null); }}
                            className="h-6 text-xs bg-zinc-700 border-white/20 text-white px-2" autoFocus />
                          <button onClick={()=>updateVideoTitleMutation.mutate({fileName:video.fileName,title:editVideoTitle.trim()})} disabled={updateVideoTitleMutation.isPending}
                            className="w-6 h-6 rounded bg-green-600 flex items-center justify-center shrink-0 hover:bg-green-500">
                            {updateVideoTitleMutation.isPending ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Check className="w-3 h-3 text-white" />}
                          </button>
                          <button onClick={()=>setEditingVideoId(null)} className="w-6 h-6 rounded bg-zinc-600 flex items-center justify-center shrink-0 hover:bg-zinc-500">
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-medium truncate flex-1 text-white/80">{video.name}</p>
                          <button onClick={()=>{setEditingVideoId(video.fileName);setEditVideoTitle(video.name);}}
                            className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors shrink-0">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={()=>deleteVideoMutation.mutate(video.fileName)}
                            disabled={deleteVideoMutation.isPending}
                            className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
                            aria-label="Delete video">
                            {deleteVideoMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image lightbox */}
        {selectedImage && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={()=>setSelectedImage(null)}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', damping:20, stiffness:300 }}
              className="relative z-10 w-full max-w-3xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h3 className="font-semibold text-white capitalize">{selectedImage.name}</h3>
                <button onClick={()=>setSelectedImage(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="bg-black"><img src={selectedImage.url} alt={selectedImage.name} className="w-full max-h-[60vh] object-contain" /></div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
