/**
 * Helper to transform standard JSON Resume spec to local CVBuilder schema
 */
export function mapJsonResumeToAppSchema(jsonResume) {
  const basics = jsonResume.basics || {};

  return {
    personal: {
      name: basics.name || '',
      title: basics.label || basics.headline || '',
      email: basics.email || '',
      phone: basics.phone || '',
      address: basics.location ? [basics.location.city, basics.location.countryCode || basics.location.country].filter(Boolean).join(', ') : '',
      website: basics.url || basics.website || '',
      github: (basics.profiles || []).find(p => p.network?.toLowerCase().includes('github'))?.url || '',
      linkedin: (basics.profiles || []).find(p => p.network?.toLowerCase().includes('linkedin'))?.url || '',
      summary: basics.summary || '',
      avatar: basics.picture || basics.image || ''
    },
    experience: (jsonResume.work || []).map((w, idx) => ({
      id: `exp-${idx + 1}`,
      role: w.position || w.role || '',
      company: w.name || w.company || '',
      location: w.location || '',
      start: w.startDate || w.start || '',
      end: w.endDate || w.end || 'Present',
      description: w.summary || w.description || '',
      bullets: Array.isArray(w.highlights) ? w.highlights : (w.bullets || []),
      variants: ["all"]
    })),
    education: (jsonResume.education || []).map((e, idx) => ({
      id: `edu-${idx + 1}`,
      degree: [e.studyType || e.degree, e.area].filter(Boolean).join(' in ') || e.institution || '',
      institution: e.institution || '',
      location: e.location || '',
      start: e.startDate || e.start || '',
      end: e.endDate || e.end || '',
      description: e.summary || e.description || '',
      variants: ["all"]
    })),
    skills: (jsonResume.skills || []).map((s, idx) => ({
      id: `sk-${idx + 1}`,
      category: s.name || s.category || 'Skills',
      items: Array.isArray(s.keywords) ? s.keywords : (s.items || []),
      variants: ["all"]
    })),
    languages: (jsonResume.languages || []).map((l, idx) => ({
      id: `lang-${idx + 1}`,
      name: l.language || l.name || '',
      level: l.fluency || l.level || '',
      variants: ["all"]
    })),
    awards: (jsonResume.awards || []).map((a, idx) => ({
      id: `aw-${idx + 1}`,
      title: a.title || '',
      issuer: a.awarder || a.issuer || '',
      date: a.date || '',
      description: a.summary || a.description || '',
      variants: ["all"]
    })),
    customSections: (jsonResume.projects || []).length > 0 ? [
      {
        id: "sec-1",
        title: "Projects",
        items: jsonResume.projects.map((p, idx) => ({
          id: `csi-${idx + 1}`,
          heading: p.name || '',
          subheading: p.entity || p.role || '',
          start: p.startDate || '',
          end: p.endDate || '',
          detail: p.description || p.summary || p.url || '',
          variants: ["all"]
        }))
      }
    ] : []
  };
}
