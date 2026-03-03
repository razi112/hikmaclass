import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsCard } from '@/components/cards/NewsCard';
import { sampleNews } from '@/data/sampleData';
import { AnimateIn } from '@/components/AnimateIn';

export const NewsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimateIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                Latest News
              </h2>
              <p className="text-muted-foreground">
                Stay updated with the latest from our community
              </p>
            </div>
            <Link to="/news" className="mt-4 md:mt-0">
              <Button variant="outline" className="gap-2 transition-transform duration-200 hover:scale-105 active:scale-95">
                View All News
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </AnimateIn>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleNews.map((news, index) => (
            <AnimateIn key={news.id} direction="up" delay={index * 150}>
              <NewsCard news={news} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};
