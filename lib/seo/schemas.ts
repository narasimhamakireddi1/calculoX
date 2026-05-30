const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculo-j0blqmgpy-narasimha-project135.vercel.app';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'calculox',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
      width: 512,
      height: 512,
      description: 'calculox Logo - Blue Gradient CX Icon',
    },
    image: `${BASE_URL}/logo.png`,
    description: 'Premium free online calculators for Indian users - Finance, Health & Utility',
    email: 'supportcalculox@gmail.com',
    foundingDate: '2024',
    areaServed: 'IN',
    knowsAbout: ['Financial Calculators', 'SIP', 'EMI', 'BMI', 'Income Tax', 'India Finance'],
    sameAs: [],
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'calculox',
    url: BASE_URL,
    description: 'Premium free online calculators for Indian users',
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateWebApplicationSchema(opts: {
  name: string;
  description: string;
  slug: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    url: `${BASE_URL}/${opts.slug}`,
    description: opts.description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    provider: { '@type': 'Organization', name: 'calculox', url: BASE_URL },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };
}

export function generateArticleSchema(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author || 'calculox Team', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'calculox',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    image: post.image || `${BASE_URL}/og-image.png`,
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
  };
}

export function generateHowToSchema(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    inLanguage: 'en-IN',
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function generateCalculatorSchema(opts: {
  name: string;
  description: string;
  slug: string;
  category: string;
  keywords: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}/${opts.slug}`,
    applicationCategory: opts.category === 'Health' ? 'HealthApplication' : 'FinanceApplication',
    operatingSystem: 'Web',
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '5000',
    },
    author: {
      '@type': 'Organization',
      name: 'calculox',
      url: BASE_URL,
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'calculox',
    description: 'Premium free online calculators for Indian users - Finance, Health & Utility',
    url: BASE_URL,
    email: 'supportcalculox@gmail.com',
    areaServed: 'IN',
    image: `${BASE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India',
    },
    sameAs: [],
  };
}

export function generateProductSchema(opts: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    url: `${BASE_URL}/${opts.slug}`,
    image: `${BASE_URL}/logo.png`,
    brand: {
      '@type': 'Brand',
      name: 'calculox',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '5000',
      bestRating: '5',
      worstRating: '1',
    },
    reviewCount: '5000',
  };
}

