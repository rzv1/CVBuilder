import { useState, useEffect, useRef, useMemo } from 'react';
import { generateJsonPatch, validateClientCvData } from '../utils/json/index.js';
import { projectMasterToVariant, mergeVariantToMaster } from '../utils/variantProjection.js';

export function useCvState() {
  const [masterCvData, setMasterCvData] = useState(null);
  const [styleData, setStyleData] = useState(null);
  const [activeVariant, setActiveVariant] = useState('all');
  const [variants, setVariants] = useState([]);

  // Relational Entities State
  const [gitCommits, setGitCommits] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [analyticsEvents, setAnalyticsEvents] = useState([]);
  const [slug, setSlug] = useState('');

  // Derived filtered RAM state for the active variant
  const cvData = useMemo(() => {
    if (!masterCvData) return null;
    return projectMasterToVariant(masterCvData, activeVariant);
  }, [masterCvData, activeVariant]);

  // Keep track of the variant RAM snapshot at last sync for minimum bandwidth patch calculation
  const lastSyncedVariantRAMRef = useRef(null);

  useEffect(() => {
    if (cvData) {
      lastSyncedVariantRAMRef.current = cvData;
    }
  }, [activeVariant, cvData]);

  // Load latest Master data from backend Prisma DB on boot
  useEffect(() => {
    fetch('/api/cv')
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          if (data.content) {
            setMasterCvData(data.content);
            lastSyncedVariantRAMRef.current = projectMasterToVariant(data.content, activeVariant);
          }
          if (data.style) setStyleData(data.style);
          if (data.variants && data.variants.length > 0) {
            setVariants(data.variants.map(v => ({ id: v.variantKey || v.id, label: v.label })));
          }
          if (data.gitCommits) setGitCommits(data.gitCommits);
          if (data.groupMembers) setGroupMembers(data.groupMembers);
          if (data.comments) setComments(data.comments);
          if (data.analyticsEvents) setAnalyticsEvents(data.analyticsEvents);
          if (data.slug) setSlug(data.slug);
        }
      })
      .catch((err) => {
        console.warn('Eroare la preluarea CV-ului de pe server:', err.message);
        // Do NOT populate disk fallbacks
      });
  }, []);

  // Debounced API persist handle using RFC 6902 JSON Patches
  const saveTimerRef = useRef(null);

  const triggerDebouncedPersist = (variantId, nextVariantRAM, style) => {
    if (!nextVariantRAM) return;
    const clientVal = validateClientCvData(nextVariantRAM);
    if (!clientVal.isValid) {
      console.warn('Client validation blocked invalid CV update:', clientVal.error);
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const baseRAM = lastSyncedVariantRAMRef.current || {};
      const patches = generateJsonPatch(baseRAM, nextVariantRAM);

      if (patches.length === 0 && !style) return;

      fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          patches,
          style: style || styleData
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          lastSyncedVariantRAMRef.current = nextVariantRAM;
        }
      })
      .catch(() => {});
    }, 2000);
  };

  // State update callback for active variant RAM content
  const handleUpdateCvData = (updater) => {
    if (!cvData) return;
    const currentVariantRAM = cvData;
    const nextVariantRAM = typeof updater === 'function' ? updater(currentVariantRAM) : updater;
    
    // Validate client payload
    const val = validateClientCvData(nextVariantRAM);
    if (!val.isValid) {
      console.error('Invalid CV Data client update:', val.error);
      return;
    }

    setMasterCvData(prevMaster => mergeVariantToMaster(prevMaster || {}, nextVariantRAM, activeVariant));
    triggerDebouncedPersist(activeVariant, nextVariantRAM, styleData);
  };

  // State update callback for style data
  const handleUpdateStyleData = (updater) => {
    const nextStyle = typeof updater === 'function' ? updater(styleData || {}) : updater;
    setStyleData(nextStyle);
    if (cvData) {
      triggerDebouncedPersist(activeVariant, cvData, nextStyle);
    }
  };

  // API Call Handlers for Relational Features
  const handleAddGitCommit = async (message, tag) => {
    try {
      const res = await fetch('/api/cv/commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, tag })
      });
      const data = await res.json();
      if (data && data.success && data.commit) {
        setGitCommits(prev => [data.commit, ...prev]);
      }
    } catch (e) {
      console.error('Error adding commit:', e);
    }
  };

  const handleAddGroupComment = async (section, text) => {
    try {
      const res = await fetch('/api/cv/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, text })
      });
      const data = await res.json();
      if (data && data.success && data.comment) {
        setComments(prev => [data.comment, ...prev]);
      }
    } catch (e) {
      console.error('Error adding comment:', e);
    }
  };

  const handleToggleGroupComment = async (commentId) => {
    try {
      const res = await fetch(`/api/cv/comments/${commentId}`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data && data.success && data.comment) {
        setComments(prev => prev.map(c => c.id === commentId ? data.comment : c));
      }
    } catch (e) {
      console.error('Error toggling comment:', e);
    }
  };

  const handleRecordAnalytics = async (eventType, referrer, durationSeconds) => {
    try {
      const res = await fetch('/api/cv/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, referrer, durationSeconds })
      });
      const data = await res.json();
      if (data && data.success && data.event) {
        setAnalyticsEvents(prev => [...prev, data.event]);
      }
    } catch (e) {
      console.error('Error recording analytics event:', e);
    }
  };

  return {
    masterCvData,
    setMasterCvData,
    styleData,
    setStyleData,
    activeVariant,
    setActiveVariant,
    variants,
    setVariants,
    cvData,
    handleUpdateCvData,
    handleUpdateStyleData,
    gitCommits,
    groupMembers,
    comments,
    analyticsEvents,
    slug,
    handleAddGitCommit,
    handleAddGroupComment,
    handleToggleGroupComment,
    handleRecordAnalytics
  };
}
