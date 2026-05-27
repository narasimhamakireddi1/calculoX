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
    <div className={`my-8 rounded-2xl p-6 bg-gradient-to-r ${gradient}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Sponsored</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{headline}</h3>
          <p className="text-sm text-white/80 mb-2">{subtext}</p>
          <p className="text-xs text-white/60">{note}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-center transition-all hover:scale-105 ${
                link.primary
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
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
