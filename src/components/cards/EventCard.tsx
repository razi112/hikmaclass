import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type EventCardData = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image_url?: string | null;
  image?: string; // legacy sampleData compat
};

interface EventCardProps {
  event: EventCardData;
}

const categoryColors: Record<string, string> = {
  reunion: 'bg-secondary text-secondary-foreground',
  seminar: 'bg-primary text-primary-foreground',
  social: 'bg-accent text-accent-foreground',
  fundraiser: 'bg-destructive text-destructive-foreground',
};

export const EventCard = ({ event }: EventCardProps) => {
  const imgSrc = event.image_url || event.image || null;
  const colorClass = categoryColors[event.category] ?? 'bg-secondary text-secondary-foreground';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elevated hover:-translate-y-2 transition-all duration-500 hover:scale-[1.02] cursor-pointer">
      <CardContent className="p-0">
        <div className="relative h-48 overflow-hidden bg-muted">
          {imgSrc ? (
            <img src={imgSrc} alt={event.title}
              className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700 ease-out" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-4 left-4 transform group-hover:scale-110 transition-transform duration-300">
            <Badge className={`${colorClass} shadow-lg`}>
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 group-hover:text-foreground transition-colors duration-300">
            {event.description}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>{formatDate(event.date)}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300 delay-75">
                <Clock className="w-4 h-4 text-secondary" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300 delay-100">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
