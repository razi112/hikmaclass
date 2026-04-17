import { Layout } from '@/components/layout/Layout';

interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  photo: string;
}

const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4a574&color=1e3a5f&size=300&font-size=0.4&bold=true`;

const committeeMembers: CommitteeMember[] = [
  { id: '1', name: 'Yaseen',  position: 'President',         photo: getAvatarUrl('Yaseen') },
  { id: '2', name: 'Ameen',   position: 'Secretary',         photo: getAvatarUrl('Ameen') },
  { id: '3', name: 'Rayyan',  position: 'Treasurer',         photo: getAvatarUrl('Rayyan') },
  { id: '4', name: 'Shehin',  position: 'Vice President',    photo: getAvatarUrl('Shehin') },
  { id: '5', name: 'Razi',    position: 'Joint Secretary',   photo: getAvatarUrl('Razi') },
  { id: '6', name: 'Anas',    position: 'Working Secretary', photo: getAvatarUrl('Anas') },
];

const positionGradient: Record<string, string> = {
  'President':         'from-violet-500 to-purple-600',
  'Vice President':    'from-blue-500 to-indigo-600',
  'Secretary':         'from-cyan-500 to-teal-600',
  'Treasurer':         'from-amber-500 to-orange-500',
  'Joint Secretary':   'from-pink-500 to-rose-600',
  'Working Secretary': 'from-emerald-500 to-green-600',
};

const Committee = () => {
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {committeeMembers.map((member, index) => {
              const grad = positionGradient[member.position] ?? 'from-violet-500 to-purple-600';
              return (
                <div
                  key={member.id}
                  className="group relative rounded-2xl p-[1.5px] transition-all duration-500
                    bg-border hover:bg-gradient-to-br"
                  style={{ animationDelay: `${index * 0.07}s` }}
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
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    <h3 className="font-serif text-xl font-bold text-foreground mb-2
                      group-hover:text-white transition-colors duration-300">
                      {member.name}
                    </h3>

                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold
                      text-white bg-gradient-to-r ${grad}
                      opacity-75 group-hover:opacity-100 group-hover:scale-105
                      transition-all duration-300`}>
                      {member.position}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Committee;
