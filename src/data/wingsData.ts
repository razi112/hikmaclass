import { Globe, BookOpen, Languages, Newspaper, Heart, Tv } from 'lucide-react';

export interface WingPlan {
  title: string;
  description: string;
  timeline: string;
}

export interface WingMember {
  name: string;
  role: string;
}

export interface Wing {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  tagline: string;
  about: string;
  members: WingMember[];
  plans: WingPlan[];
}

export const wingsData: Wing[] = [
  {
    id: 'English',
    name: 'English',
    icon: Globe,
    color: 'from-blue-500 to-indigo-600',
    glow: 'rgba(99,102,241,0.4)',
    tagline: 'Empowering expression through the English language',
    about:
      'The English Wing focuses on developing strong communication, writing, and public speaking skills among students. Through workshops, debates, and literary events, we nurture confident English communicators.',
    members: [
      { name: 'Nihal ', role: 'Wing Lead' },
      { name: 'Hisham', role: 'Co-Lead' },
    ],
    plans: [
      { title: 'Weekly Debate Sessions', description: 'Structured debates on current affairs and academic topics to sharpen argumentation and fluency.', timeline: 'Every Friday' },
      { title: 'Essay Writing Competition', description: 'Annual competition encouraging creative and analytical writing among all class members.', timeline: 'Term 2' },
      { title: 'English Speaking Club', description: 'Informal weekly meetups to practice conversational English in a relaxed environment.', timeline: 'Ongoing' },
      { title: 'Guest Lecture Series', description: 'Invite English language professionals and authors to share insights and inspire students.', timeline: 'Monthly' },
    ],
  },
  {
    id: 'Media',
    name: 'Media',
    icon: Tv,
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.4)',
    tagline: 'Capturing stories, shaping narratives',
    about:
      'The Media Wing handles all visual and digital content for Hikma Class 2026. From photography and videography to social media management, we document and broadcast the class journey.',
    members: [
      { name: 'Midlaj', role: 'Wing Lead' },
      { name: 'Nahash', role: 'Co-Lead' },
    ],
    plans: [
      { title: 'Class Documentary', description: 'A full-length documentary capturing the academic year — events, milestones, and memories.', timeline: 'End of Year' },
      { title: 'Social Media Campaign', description: 'Regular posts, reels, and stories showcasing class activities across platforms.', timeline: 'Ongoing' },
      { title: 'Photography Workshop', description: 'Hands-on training in photography and video editing for interested students.', timeline: 'Term 1' },
      { title: 'Event Coverage', description: 'Professional coverage of all class events, ceremonies, and gatherings.', timeline: 'All Events' },
    ],
  },
  {
    id: 'Malayalam',
    name: 'Malayalam',
    icon: Languages,
    color: 'from-green-500 to-emerald-600',
    glow: 'rgba(16,185,129,0.4)',
    tagline: 'Celebrating the richness of Malayalam language and culture',
    about:
      'The Malayalam Wing promotes the beauty of the Malayalam language through literature, poetry, and cultural programs. We celebrate Kerala\'s rich heritage while nurturing local talent.',
    members: [
      { name: 'Ziyad', role: 'Wing Lead' },
      { name: 'Bishr', role: 'Co-Lead' },
    ],
    plans: [
      { title: 'Poetry Recitation Event', description: 'A platform for students to recite and appreciate classical and modern Malayalam poetry.', timeline: 'Term 1' },
      { title: 'Short Story Competition', description: 'Encouraging creative writing in Malayalam with themes rooted in Islamic values and Kerala culture.', timeline: 'Term 2' },
      { title: 'Malayalam Debate', description: 'Formal debates in Malayalam on relevant social and academic topics.', timeline: 'Monthly' },
      { title: 'Cultural Evening', description: 'An evening celebrating Malayalam arts, music, and literature with student performances.', timeline: 'Annual' },
    ],
  },
  {
    id: 'Urdu',
    name: 'Urdu',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.4)',
    tagline: 'Preserving the elegance of Urdu literature and poetry',
    about:
      'The Urdu Wing is dedicated to the promotion of Urdu language, poetry, and classical literature. We organize mushairas, calligraphy sessions, and literary discussions to keep this beautiful language alive.',
    members: [
      { name: 'Nadih', role: 'Wing Lead' },
      { name: 'Ashkar', role: 'Co-Lead' },
    ],
    plans: [
      { title: 'Mushaira (Poetry Gathering)', description: 'A traditional Urdu poetry recitation event open to all students and faculty.', timeline: 'Term 1' },
      { title: 'Urdu Calligraphy Workshop', description: 'Hands-on sessions teaching the art of Urdu calligraphy and script writing.', timeline: 'Term 2' },
      { title: 'Classical Literature Study Circle', description: 'Weekly discussions on Urdu classics by Iqbal, Ghalib, and other masters.', timeline: 'Weekly' },
      { title: 'Urdu Speech Competition', description: 'Formal speech competition to develop oratory skills in Urdu.', timeline: 'Annual' },
    ],
  },
  {
    id: 'Magazine',
    name: 'Magazine',
    icon: Newspaper,
    color: 'from-rose-500 to-pink-600',
    glow: 'rgba(244,63,94,0.4)',
    tagline: 'Publishing the voice of Hikma Class 2026',
    about:
      'The Magazine Wing produces the official class publication — a curated collection of articles, poetry, artwork, and news from students. It serves as a permanent record of our class year.',
    members: [
      { name: 'Aman', role: 'Editor-in-Chief' },
      { name: 'Fawaz', role: 'Co-Editor' },
    ],
    plans: [
      { title: 'Quarterly Newsletter', description: 'A digital newsletter covering class news, achievements, and upcoming events every quarter.', timeline: 'Quarterly' },
      { title: 'Annual Magazine Publication', description: 'The flagship annual magazine featuring student writing, photography, and artwork.', timeline: 'End of Year' },
      { title: 'Article Submission Drive', description: 'Open call for student contributions — articles, poems, illustrations, and opinion pieces.', timeline: 'Ongoing' },
      { title: 'Editorial Workshop', description: 'Training sessions on writing, editing, and layout design for aspiring contributors.', timeline: 'Term 1' },
    ],
  },
  {
    id: 'Tharbiya',
    name: 'Tharbiya',
    icon: Heart,
    color: 'from-cyan-500 to-teal-600',
    glow: 'rgba(6,182,212,0.4)',
    tagline: 'Nurturing character, values, and spiritual growth',
    about:
      'The Tharbiya Wing focuses on the moral and spiritual development of students. Through Islamic reminders, character-building programs, and community service, we strive to cultivate well-rounded individuals.',
    members: [
      { name: 'Khaleel', role: 'Wing Lead' },
      { name: 'Munfis', role: 'Co-Lead' },
    ],
    plans: [
      { title: 'Weekly Islamic Reminder', description: 'Short motivational talks and reminders based on Quran and Sunnah every week.', timeline: 'Weekly' },
      { title: 'Character Building Retreat', description: 'A one-day retreat focused on self-reflection, goal-setting, and Islamic values.', timeline: 'Term 1' },
      { title: 'Community Service Initiative', description: 'Organized volunteer activities to serve the local community and develop empathy.', timeline: 'Monthly' },
      { title: 'Mentorship Program', description: 'Pairing students with mentors for personal and academic guidance throughout the year.', timeline: 'Ongoing' },
    ],
  },
  {
    id: 'Arabic',
    name: 'Arabic',
    icon: BookOpen,
    color: 'from-emerald-500 to-green-600',
    glow: 'rgba(16,185,129,0.4)',
    tagline: 'Mastering the language of the Quran and classical scholarship',
    about:
      'The Arabic Wing is dedicated to strengthening Arabic language skills — from classical Quranic Arabic to modern standard Arabic. Through grammar sessions, literature circles, and speaking practice, we deepen students\' connection to the Arabic language.',
    members: [
      { name: 'Shadi', role: 'Wing Lead' },
      { name: 'Anzil', role: 'Co-Lead' },
    ],
    plans: [
      { title: 'Arabic Grammar Workshop', description: 'Structured sessions covering Nahw and Sarf to strengthen classical Arabic grammar foundations.', timeline: 'Weekly' },
      { title: 'Quranic Arabic Study Circle', description: 'Deep-dive into the linguistic beauty of Quranic verses and their grammatical structures.', timeline: 'Weekly' },
      { title: 'Arabic Speech Competition', description: 'A formal competition encouraging students to deliver speeches and presentations in Arabic.', timeline: 'Term 2' },
      { title: 'Classical Literature Reading', description: 'Guided reading of classical Arabic texts and poetry to build vocabulary and appreciation.', timeline: 'Monthly' },
    ],
  },
];
