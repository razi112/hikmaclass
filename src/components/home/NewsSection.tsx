import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsCard } from '@/components/cards/NewsCard';
import { AnimateIn } from '@/components/AnimateIn';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const NewsSection = () => {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news-preview'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('news').select('*').order('date', { ascending: false }).limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (!isLoading && news.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimateIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Latest News</h2>
              <p className="text-muted-foreground">Stay updated with the latest from our community</p>
            </div>
            <Link to="/news" className="mt-4 md:mt-0">
              <Button variant="outline" className="gap-2 transition-transform duration-200 hover:scale-105 active:scale-95">
                View All News <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </AnimateIn>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item: any, index: number) => (
              <AnimateIn key={item.id} direction="up" delay={index * 150}>
                <NewsCard news={item} />
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
