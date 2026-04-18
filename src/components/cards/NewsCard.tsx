import { Calendar, Newspaper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type NewsCardData = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image?: string;      // legacy sampleData
  image_url?: string | null;
};

interface NewsCardProps {
  news: NewsCardData;
}

export const NewsCard = ({ news }: NewsCardProps) => {
  const imgSrc = news.image_url || news.image || null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elevated transition-all duration-500 animate-fade-in">
      <CardContent className="p-0">
        <div className="relative h-40 overflow-hidden bg-muted">
          {imgSrc ? (
            <img src={imgSrc} alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Newspaper className="w-10 h-10 text-muted-foreground/40" />
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">{news.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(news.date)}
            </span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {news.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{news.excerpt}</p>
        </div>
      </CardContent>
    </Card>
  );
};
