import { Layout } from '@/components/layout/Layout';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  photo: string;
}

const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4a574&color=1e3a5f&size=300&font-size=0.4&bold=true`;

const positionGradient: Record<string, string> = {
  'President':         'from-violet-500 to-purple-600',
  'Vice President':    'from-blue-500 to-indigo-600',
  'Secretary':         'from-cyan-500 to-teal-600',
  'Treasurer':         'from-amber-500 to-orange-500',
  'Joint Secretary':   'from-pink-500 to-rose-600',
  'Working Secretary': 'from-emerald-500 to-green-600',
};

const Committee = () => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await (supabase as any)
        .from('committee_members').select('*').order('created_at', { ascending: true });
      if (!error && data) setMembers(data);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  return (
    <Layout>
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

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, index) => {
                const grad = positionGradient[member.position] ?? 'from-violet-500 to-purple-600';
                const photo = member.photo || getAvatarUrl(member.name);
                return (
                  <div
                    key={member.id}
                    data-animate="up"
                    data-delay={String(Math.min(index * 100, 500))}
                    className="group relative rounded-2xl p-[1.5px] transition-all duration-500
                      bg-border hover:bg-gradient-to-br"
                  >
                    {/* animated gradient border */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${grad}
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* card body */}
                    <div className="relative rounded-2xl bg-card overflow-hidden text-center p-8
                      transition-transform duration-500 group-hover:-translate-y-1">

                      {/* top glow blob */}
                      <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40
                        rounded-full bg-gradient-to-br ${grad} opacity-0 blur-2xl
                        group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />

                      {/* shimmer sweep */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                        bg-gradient-to-r from-transparent via-white/5 to-transparent
                        transition-transform duration-700 ease-in-out pointer-events-none" />

                      {/* avatar */}
                      <div className={`relative mx-auto mb-5 w-28 h-28 rounded-full p-[3px]
                        bg-gradient-to-br ${grad}
                        shadow-md group-hover:shadow-[0_0_28px_rgba(139,92,246,0.45)]
                        transition-all duration-500 group-hover:scale-110`}>
                        <img
                          src={photo}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = getAvatarUrl(member.name); }}
                        />
                      </div>

                      <h3 className="font-serif text-xl font-bold text-foreground mb-2
                        group-hover:text-white transition-colors duration-500">
                        {member.name}
                      </h3>

                      <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold
                        text-white bg-gradient-to-r ${grad}
                        opacity-75 group-hover:opacity-100 group-hover:scale-105
                        transition-all duration-500`}>
                        {member.position}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Committee;
