import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';

interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  email?: string;
  phone?: string;
}

const getAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4a574&color=1e3a5f&size=300&font-size=0.4&bold=true`;
};

const committeeMembers: CommitteeMember[] = [
  { id: '1', name: 'Aman', position: 'President', photo: getAvatarUrl('Aman'), email: 'president@hikma.edu' },
  { id: '2', name: 'Nihal', position: 'Vice President', photo: getAvatarUrl('Nihal'), email: 'vp@hikma.edu' },
  { id: '3', name: 'Rayyan', position: 'Secretary', photo: getAvatarUrl('Rayyan'), email: 'secretary@hikma.edu' },
  { id: '4', name: 'Yaseen', position: 'Treasurer', photo: getAvatarUrl('Yaseen'), email: 'treasurer@hikma.edu' },
  { id: '5', name: 'Nahash', position: 'Event Coordinator', photo: getAvatarUrl('Nahash') },
  { id: '6', name: 'Nadih', position: 'Public Relations', photo: getAvatarUrl('Nadih') },
  { id: '7', name: 'Shadi', position: 'Media Head', photo: getAvatarUrl('Shadi') },
  { id: '8', name: 'Anas', position: 'Sports Coordinator', photo: getAvatarUrl('Anas') },
];

const Committee = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Executive Committee
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Meet the dedicated team leading Hikma Class Union
          </p>
        </div>
      </section>

      {/* Committee Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {committeeMembers.map((member, index) => (
              <Card 
                key={member.id} 
                className="group overflow-hidden hover:shadow-elevated transition-all duration-300 animate-slide-up text-center"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover ring-4 ring-secondary/30 group-hover:ring-secondary transition-all duration-300"
                    />
                  </div>
                  
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-secondary mb-3">
                    {member.position}
                  </p>
                  
                  {(member.email || member.phone) && (
                    <div className="flex items-center justify-center gap-2 pt-3 border-t border-border">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Email"
                        >
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Phone"
                        >
                          <Phone className="w-4 h-4 text-muted-foreground" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Committee;
