import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { RolesSection } from '@/components/home/RolesSection';
import { GallerySection } from '@/components/home/GallerySection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <RolesSection />
      <GallerySection />
      <CTASection />
    </Layout>
  );
};

export default Index;
