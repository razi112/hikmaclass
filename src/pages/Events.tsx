import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/cards/EventCard';
import { Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

type DBEvent = {
  id: string; title: string; description: string; date: string;
  time: string; location: string; category: string; image_url: string | null;
};

const Events = () => {
  const { data: events = [], isLoading } = useQuery<DBEvent[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('events').select('*').order('date', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <Layout>
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Events & Activities
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Join us at our upcoming events and create lasting memories with fellow alumni
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Calendar className="w-5 h-5 text-secondary" />
            <h2 className="font-serif text-2xl font-semibold text-foreground">Upcoming Events</h2>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No events yet. Check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
