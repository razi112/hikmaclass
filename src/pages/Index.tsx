import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { RolesSection } from '@/components/home/RolesSection';
import { NewsSection } from '@/components/home/NewsSection';
import { EventsPreview } from '@/components/home/EventsPreview';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <RolesSection />
      <NewsSection />
      <EventsPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
