import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { wingsData } from '@/data/wingsData';
import { ArrowLeft, CalendarDays, CheckCircle2 } from 'lucide-react';

const getAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a5f&color=fff&size=200&bold=true`;

const WingDetail = () => {
  const { wingId } = useParams<{ wingId: string }>();
  const wing = wingsData.find(w => w.id.toLowerCase() === wingId?.toLowerCase());

  if (!wing) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-2xl font-serif text-foreground">Wing not found</p>
          <Link to="/wings" className="text-sm text-primary hover:underline">← Back to Wings</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* hero */}
      <section className={`bg-gradient-to-br ${wing.color} py-16 md:py-20 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-4 relative">
          <Link to="/wings"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Wings
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30
              flex items-center justify-center shadow-xl">
              <wing.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">{wing.name} Wing</h1>
              <p className="text-white/80 mt-1">{wing.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">

            {/* left — about + members */}
            <div className="space-y-8">
              {/* about */}
              <div className="rounded-2xl bg-card border border-border/60 p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-3">About</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{wing.about}</p>
              </div>

              {/* members */}
              <div className="rounded-2xl bg-card border border-border/60 p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-4">Members</h2>
                <div className="space-y-4">
                  {wing.members.map((member, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className={`relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-br ${wing.color}
                        shadow-md transition-transform duration-500 group-hover:scale-105`}>
                        <img
                          src={getAvatarUrl(member.name)}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* back link */}
              <Link to="/wings"
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl
                  bg-gradient-to-r ${wing.color} text-white hover:opacity-90 transition-opacity`}>
                <ArrowLeft className="w-4 h-4" /> Back to All Wings
              </Link>
            </div>

            {/* right — plans */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Wing Plans</h2>
              <div className="space-y-4">
                {wing.plans.map((plan, i) => (
                  <div key={i}
                    data-animate="up"
                    data-delay={String(i * 80)}
                    className="group relative rounded-2xl bg-card border border-border/60 p-5
                      hover:border-transparent transition-all duration-500 overflow-hidden
                      hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]">

                    {/* hover gradient border */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${wing.color}
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                    <div className="absolute inset-[1px] rounded-2xl bg-card -z-10" />

                    {/* shimmer */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                      bg-gradient-to-r from-transparent via-white/4 to-transparent
                      transition-transform duration-700 pointer-events-none" />

                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${wing.color}
                        flex items-center justify-center shrink-0 shadow-md mt-0.5
                        transition-transform duration-500 group-hover:scale-110`}>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <h3 className="font-semibold text-foreground text-base">{plan.title}</h3>
                          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1
                            rounded-full bg-muted text-muted-foreground shrink-0">
                            <CalendarDays className="w-3 h-3" />
                            {plan.timeline}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                          {plan.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WingDetail;
