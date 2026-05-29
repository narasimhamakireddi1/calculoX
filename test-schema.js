const BASE_URL = "https://www.calculox.in";

function generateOrganizationSchema() {
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

console.log(JSON.stringify(generateOrganizationSchema(), null, 2));
