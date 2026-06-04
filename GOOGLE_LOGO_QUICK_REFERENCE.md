# Google Search Logo - Quick Reference

## In 5 Minutes

### 1️⃣ Add Your Logo File
```
Create: public/logo.svg
Size: 1200x630px (or 512x512px)
Test: Open https://www.calculox.in/logo.svg in browser
```

### 2️⃣ Add Schema to Layout
**File:** `app/layout.tsx`

```typescript
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "calculox",
  "url": "https://www.calculox.in",
  "logo": "https://www.calculox.in/logo.svg"
};

// In <head>:
<script type="application/ld+json">
  {JSON.stringify(organizationSchema)}
</script>
```

### 3️⃣ Test It
- https://search.google.com/test/rich-results
- Enter: `https://www.calculox.in`
- Look for: Organization schema with logo ✓

### 4️⃣ Add to Google Search Console
- https://search.google.com/search-console
- Verify ownership (HTML file, meta tag, or DNS)
- Submit sitemap: `https://www.calculox.in/sitemap.xml`
- Request indexing for homepage

### 5️⃣ Wait & Monitor
- **Timeline:** 2-4 weeks for search results
- **Check:** Search `site:calculox.in` on Google
- **Monitor:** Search Console for errors

---

## Logo Requirements

| Requirement | Details |
|-------------|---------|
| **Format** | JPG, PNG, SVG, WebP |
| **Minimum Size** | 160x90px |
| **Recommended Size** | 1200x630px (or 512x512px) |
| **Quality** | High resolution, clear |
| **File Size** | < 500KB |
| **Aspect Ratio** | Any (square, rectangle, wide) |
| **Background** | Transparent or white |

---

## Schema Markup Minimum

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "calculox",
  "url": "https://www.calculox.in",
  "logo": "https://www.calculox.in/logo.svg"
}
```

---

## Full Schema (Recommended)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "calculox",
  "url": "https://www.calculox.in",
  "logo": "https://www.calculox.in/logo.svg",
  "description": "14 Free Calculators",
  "email": "narasimha.makireddi1@gmail.com",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "narasimha.makireddi1@gmail.com"
  },
  "sameAs": [
    "https://twitter.com/yourhandle",
    "https://www.facebook.com/yourpage"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  }
}
```

---

## Tools You'll Need

| Tool | URL | Purpose |
|------|-----|---------|
| **Rich Results Test** | https://search.google.com/test/rich-results | Validate schema |
| **Search Console** | https://search.google.com/search-console | Submit sitemap, verify site |
| **JSON Validator** | https://jsonlint.com | Check schema syntax |
| **PageSpeed** | https://pagespeed.web.dev | Check performance |

---

## Google Search Console Steps

### Add Website
1. Go: https://search.google.com/search-console
2. Click: "+ Create property"
3. Choose: "URL prefix"
4. Enter: `https://www.calculox.in`
5. Click: "Continue"

### Verify Ownership
**Choose one:**
- ✅ **HTML File:** Download & upload to `/public/`
- ✅ **Meta Tag:** Add to `<head>` tag
- ✅ **DNS Record:** Add TXT record in domain settings

### Submit Sitemap
1. Left menu → "Sitemaps"
2. Add: `https://www.calculox.in/sitemap.xml`
3. Click: "Submit"

### Request Indexing
1. Top search bar → "URL Inspection"
2. Enter: `https://www.calculox.in`
3. Click: "Request indexing"

---

## Timeline

```
Day 1      → Deploy schema to production
Days 2-7   → Google crawls and reads schema
Days 7-14  → Pages indexed in Google Search
Weeks 2-4  → Logo appears in search results (maybe)
Weeks 4-8  → Logo more visible/consistent
Weeks 8+   → Knowledge Panel appears (if authority is high)
```

---

## Check If It's Working

### Google Search
```
Search: "calculox" or "site:calculox.in"
Look for: Your logo in search results
```

### Rich Results Test
```
URL: https://search.google.com/test/rich-results
Enter: https://www.calculox.in
Check: Organization schema appears
```

### Search Console
```
Go: https://search.google.com/search-console
Check: Coverage report for errors
Monitor: Logo enhancements (if available)
```

---

## What Could Go Wrong

| Issue | Fix |
|-------|-----|
| Logo not appearing | Wait 4-8 weeks, check domain authority |
| Schema not validating | Verify JSON syntax, test with validator |
| Logo URL returns 404 | Check file exists at public/logo.svg |
| Website not indexed | Submit sitemap, request indexing manually |
| Authority too low | Get backlinks, publish content, build presence |

---

## Next Steps for CalculoX

1. ✅ **Logo Design** - Create professional brand logo (1-2 hours)
2. ✅ **Add to Public Folder** - Save as `/public/logo.svg` (5 minutes)
3. ✅ **Add Schema** - Copy schema code to `app/layout.tsx` (15 minutes)
4. ✅ **Test Locally** - Run `npm run dev` and verify (10 minutes)
5. ✅ **Deploy** - Push to production (5 minutes)
6. ✅ **Add to Search Console** - Verify and submit sitemap (30 minutes)
7. ⏳ **Monitor** - Check Search Console weekly (ongoing)

---

## Estimated Timeline
- **Setup:** 2-3 hours (one-time)
- **Results:** 2-4 weeks
- **Maintenance:** 15 minutes weekly

---

## Resources

- **Full Guide:** See `GOOGLE_SEARCH_LOGO_GUIDE.md`
- **Implementation:** See `GOOGLE_SEARCH_LOGO_IMPLEMENTATION.md`
- **Google Docs:** https://developers.google.com/search
- **Schema.org:** https://schema.org

---

## Key Takeaway

✅ **Add schema markup** → Google knows your logo  
✅ **Submit to Search Console** → Google indexes your site  
✅ **Wait & build authority** → Logo appears in results  
✅ **Monitor progress** → Track in Search Console  

**Success Rate:** ~80% (if domain authority > 20-30)

---

**Last Updated:** 2026-06-04  
**Setup Time:** ~2-3 hours  
**Result Timeline:** 2-4 weeks  
**Cost:** Free (Google Tools)
