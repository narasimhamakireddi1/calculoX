'use client';

interface AffiliateLink {
  label: string;
  href: string;
  primary?: boolean;
}

interface AffiliateBannerProps {
  icon: string;
  headline: string;
  subtext: string;
  note: string;
  links: AffiliateLink[];
  gradient: string;
}

export function AffiliateBanner({ icon, headline, subtext, note, links, gradient }: AffiliateBannerProps) {
  return (
    <div className={`my-12 rounded-2xl p-8 bg-gradient-to-br ${gradient} shadow-xl border border-white/20 overflow-hidden relative`}>
      {/* Decorative background element */}
      <div aria-hidden="true" className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }}></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl" aria-hidden="true">{icon}</span>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-white/70 bg-white/10 px-3 py-1 rounded-full">Sponsored</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{headline}</h3>
          <p className="text-sm text-white/90 mb-2 leading-relaxed">{subtext}</p>
          <p className="text-xs text-white/60">{note}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-label={`${link.label} (opens in new tab)`}
              className={`px-6 py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                link.primary
                  ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl'
                  : 'bg-white/20 text-white border-2 border-white/40 hover:bg-white/30 hover:border-white/60'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
