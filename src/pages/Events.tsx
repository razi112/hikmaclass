import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/cards/EventCard';
import { sampleEvents } from '@/data/sampleData';
import { Calendar } from 'lucide-react';

const Events = () => {
  return (
    <Layout>
      {/* Header */}
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

      {/* Events Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Calendar className="w-5 h-5 text-secondary" />
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Upcoming Events
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">
            Past Events
          </h2>
          
          <div className="text-center py-8 text-muted-foreground">
            <p>Past events archive coming soon...</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
