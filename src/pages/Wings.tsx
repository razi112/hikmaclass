import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { wingsData } from '@/data/wingsData';
import { ArrowRight } from 'lucide-react';

const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a5f&color=fff&size=200&bold=true`;

const Wings = () => (
  <Layout>
    <section className="hero-gradient py-16 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
          Wings
        </h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          Specialized wings driving creativity, culture, and knowledge in Hikma Class 2026
        </p>
      </div>
    </section>

    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wingsData.map((wing, index) => (
            <div
              key={wing.id}
              data-animate="up"
              data-delay={String(Math.min(index * 80, 400))}
              className="group relative rounded-2xl p-[1.5px] transition-all duration-500 bg-border"
            >
              {/* gradient border on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${wing.color}
                opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative rounded-2xl bg-card overflow-hidden p-6
                transition-transform duration-500 group-hover:-translate-y-1">

                {/* glow blob */}
                <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40
                  rounded-full bg-gradient-to-br ${wing.color} opacity-0 blur-2xl
                  group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />

                {/* shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                  bg-gradient-to-r from-transparent via-white/5 to-transparent
                  transition-transform duration-700 pointer-events-none" />

                {/* header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${wing.color}
                    flex items-center justify-center shadow-lg
                    transition-transform duration-500 group-hover:scale-110`}>
                    <wing.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground
                      group-hover:text-white transition-colors duration-500">
                      {wing.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{wing.plans.length} Plans · 2 Members</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {wing.tagline}
                </p>

                {/* divider */}
                <div className={`h-px w-full bg-gradient-to-r ${wing.color} opacity-20
                  group-hover:opacity-50 transition-opacity duration-500 mb-4`} />

                {/* members */}
                <div className="flex items-center gap-2 mb-5">
                  {wing.members.map((member, i) => (
                    <img
                      key={i}
                      src={getAvatarUrl(member.name)}
                      alt={member.name}
                      title={`${member.name} — ${member.role}`}
                      className={`w-8 h-8 rounded-full border-2 border-card object-cover
                        ${i > 0 ? '-ml-2' : ''}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {wing.members.map(m => m.name).join(' & ')}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  to={`/wings/${wing.id}`}
                  className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl
                    bg-gradient-to-r ${wing.color} text-white hover:opacity-90 transition-opacity`}
                >
                  View Plans <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Wings;
