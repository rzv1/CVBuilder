/**
 * CVBuilder Job Extractor
 * Extracts Job Details from the current page using Schema.org JSON-LD and smart querySelector fallbacks.
 */

export function extractJobFromPage() {
  let jobData = {
    title: '',
    company: '',
    location: '',
    description: '',
    url: window.location.href,
    source: 'web-extension',
    extractedVia: 'LinkedInExtractor',
  };

  // Helper to sanitize and format HTML to plain text with bullet preservation
  function cleanHtml(html) {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Convert list items to formatted bullets
    temp.querySelectorAll('li').forEach((li) => {
      li.textContent = `• ${li.textContent.trim()}\n`;
    });

    // Add newlines to paragraphs and headings
    temp.querySelectorAll('p, h1, h2, h3, h4, h5, h6, br').forEach((el) => {
      el.after('\n\n');
    });

    return temp.textContent
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // 1. ATTEMPT EXTRACTION VIA SCHEMA.ORG JSON-LD (<script type="application/ld+json">)
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of jsonLdScripts) {
    try {
      const parsed = JSON.parse(script.textContent);

      // Handle direct JobPosting or array or @graph collection
      let jobPosting = null;
      if (parsed['@type'] === 'JobPosting') {
        jobPosting = parsed;
      } else if (Array.isArray(parsed)) {
        jobPosting = parsed.find((item) => item['@type'] === 'JobPosting');
      } else if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
        jobPosting = parsed['@graph'].find((item) => item['@type'] === 'JobPosting');
      }

      if (jobPosting) {
        jobData.title = jobPosting.title || jobPosting.name || '';
        
        // Extract company
        if (typeof jobPosting.hiringOrganization === 'object') {
          jobData.company = jobPosting.hiringOrganization.name || '';
        } else if (typeof jobPosting.hiringOrganization === 'string') {
          jobData.company = jobPosting.hiringOrganization;
        }

        // Extract location
        if (jobPosting.jobLocationType === 'TELECOMMUTE' || jobPosting.applicantLocationRequirements) {
          jobData.location = 'Remote';
        } else if (jobPosting.jobLocation) {
          const loc = jobPosting.jobLocation;
          if (loc.address) {
            const parts = [
              loc.address.addressLocality,
              loc.address.addressRegion,
              loc.address.addressCountry,
            ].filter(Boolean);
            jobData.location = parts.join(', ');
          }
        }

        // Extract description
        if (jobPosting.description) {
          jobData.description = cleanHtml(jobPosting.description);
        }

        if (jobPosting.url) {
          jobData.url = jobPosting.url;
        }

        jobData.extractedVia = 'JSON-LD (Schema.org)';
        break;
      }
    } catch (e) {
      // Continue searching
    }
  }

  // 2. QUERYSELECTOR FALLBACK FOR POPULAR PLATFORMS & GENERIC WEBSITES
  const host = window.location.hostname.toLowerCase();

  // Helper selector runner
  const queryFirst = (selectors) => {
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el && el.textContent.trim()) {
        return el.textContent.trim();
      }
    }
    return '';
  };

  const queryHtmlFirst = (selectors) => {
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el && el.innerHTML.trim()) {
        return cleanHtml(el.innerHTML);
      }
    }
    return '';
  };

  // LinkedIn Specific Selectors
  if (host.includes('linkedin.com')) {
    if (!jobData.title) {
      jobData.title = queryFirst([
        '.job-details-jobs-unified-top-card__job-title',
        '.jobs-unified-top-card__job-title',
        'h1.t-24',
        '.jobs-details__main-content h1',
      ]);
    }
    if (!jobData.company) {
      jobData.company = queryFirst([
        '.job-details-jobs-unified-top-card__company-name',
        '.jobs-unified-top-card__company-name',
        '.jobs-details__main-content a[href*="/company/"]',
      ]);
    }
    if (!jobData.location) {
      jobData.location = queryFirst([
        '.job-details-jobs-unified-top-card__bullet',
        '.jobs-unified-top-card__bullet',
        '.jobs-unified-top-card__workplace-type',
      ]);
    }
    if (!jobData.description) {
      jobData.description = queryHtmlFirst([
        '#job-details',
        '.jobs-description__content',
        '.jobs-box__html-content',
      ]);
    }
    if (jobData.title) jobData.extractedVia = 'LinkedIn DOM Selectors';
  }

  // Indeed Specific Selectors
  else if (host.includes('indeed.com')) {
    if (!jobData.title) {
      jobData.title = queryFirst([
        '[data-testid="jobsearch-JobInfoHeader-title"]',
        'h1.jobsearch-JobInfoHeader-title',
        'h1.icl-u-xs-mb--xs',
      ]);
    }
    if (!jobData.company) {
      jobData.company = queryFirst([
        '[data-testid="inlineHeader-companyName"]',
        '[data-company-name="true"]',
        '.jobsearch-InlineCompanyRating-companyHeader',
      ]);
    }
    if (!jobData.location) {
      jobData.location = queryFirst([
        '[data-testid="inlineHeader-companyLocation"]',
        '.jobsearch-JobInfoHeader-companyLocation',
      ]);
    }
    if (!jobData.description) {
      jobData.description = queryHtmlFirst([
        '#jobDescriptionText',
        '.jobsearch-jobDescriptionText',
      ]);
    }
    if (jobData.title) jobData.extractedVia = 'Indeed DOM Selectors';
  }

  // Greenhouse Specific Selectors
  else if (host.includes('greenhouse.io') || document.querySelector('#app_body')) {
    if (!jobData.title) jobData.title = queryFirst(['.app-title', 'h1.title', 'h1']);
    if (!jobData.company) jobData.company = queryFirst(['.company-name', 'header .company', 'span.company-name']);
    if (!jobData.location) jobData.location = queryFirst(['.location', 'div.location']);
    if (!jobData.description) jobData.description = queryHtmlFirst(['#content', '#app_body', '.body']);
    if (jobData.title) jobData.extractedVia = 'Greenhouse DOM Selectors';
  }

  // Lever Specific Selectors
  else if (host.includes('lever.co')) {
    if (!jobData.title) jobData.title = queryFirst(['.posting-headline h2', 'h2.posting-headline']);
    if (!jobData.company) jobData.company = queryFirst(['.main-header-logo img', 'header a']);
    if (!jobData.location) jobData.location = queryFirst(['.posting-categories .location', '.sort-by-time.posting-category']);
    if (!jobData.description) jobData.description = queryHtmlFirst(['.posting-content', '.section-wrapper']);
    if (jobData.title) jobData.extractedVia = 'Lever DOM Selectors';
  }

  // 3. GENERIC SEMANTIC DOM FALLBACK
  if (!jobData.title) {
    jobData.title = queryFirst([
      'h1[class*="title" i]',
      'h1[class*="job" i]',
      'h1',
      'meta[property="og:title"]',
    ]);
  }

  if (!jobData.company) {
    const ogSite = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
    if (ogSite) {
      jobData.company = ogSite.trim();
    } else {
      jobData.company = queryFirst([
        '[class*="company-name" i]',
        '[class*="employer" i]',
        '[class*="company" i]',
      ]) || window.location.hostname.replace('www.', '').split('.')[0];
    }
  }

  if (!jobData.location) {
    jobData.location = queryFirst([
      '[class*="location" i]',
      '[class*="workplace" i]',
      '[data-testid*="location" i]',
    ]) || 'Remote / Unspecified';
  }

  if (!jobData.description) {
    jobData.description = queryHtmlFirst([
      '[class*="job-description" i]',
      '[class*="description" i]',
      'article',
      'main',
      '[role="main"]',
    ]);
  }

  // Capitalize company nicely if fallback
  if (jobData.company) {
    jobData.company = jobData.company.charAt(0).toUpperCase() + jobData.company.slice(1);
  }

  // Fallback defaults
  if (!jobData.title) {
    jobData.title = document.title.split(/[-–|]/)[0]?.trim() || 'Untitled Position';
  }

  if (!jobData.extractedVia || jobData.extractedVia === 'none') {
    jobData.extractedVia = 'Generic Semantic Selectors';
  }

  const iconSeed = jobData.company.replace(/[^a-zA-Z0-9]/g, '') || 'Tech';
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    description: jobData.description || 'Nu s-a putut extrage automat textul descrierii. Puteți introduce manual cerințele job-ului.',
    url: jobData.url,
    iconSeed,
    importedAt: `Extensie Web • Azi la ${timeStr}`,
    extractedVia: jobData.extractedVia,
  };
}
