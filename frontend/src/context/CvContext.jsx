import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateJsonPatch, validateClientCvData } from '../utils/json/index.js';
import { projectMasterToVariant, mergeVariantToMaster } from '../utils/variantProjection.js';
import { useTRPC, trpcClient } from '../lib/trpc.js';
import { useAuth } from './AuthContext.jsx';

const CvContext = createContext(null);

export function CvProvider({ children }) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { currentUser } = useAuth() || {};

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

  // TanStack Query to fetch CV data via tRPC (only when logged in)
  const cvQuery = useQuery({
    ...trpc.cv.get.queryOptions({ userId: currentUser?.id }),
    enabled: Boolean(currentUser),
  });

  // Reference for last synced RAM snapshot to calculate minimum RFC 6902 patches
  const lastSyncedVariantRAMRef = useRef(null);

  // Derived filtered RAM state for the active variant
  const cvData = useMemo(() => {
    if (!currentUser || !masterCvData) return null;
    return projectMasterToVariant(masterCvData, activeVariant);
  }, [currentUser, masterCvData, activeVariant]);

  useEffect(() => {
    if (cvData) {
      lastSyncedVariantRAMRef.current = cvData;
    }
  }, [activeVariant, cvData]);

  // Clear CV data when user logs out
  useEffect(() => {
    if (!currentUser) {
      setMasterCvData(null);
      setStyleData(null);
      setVariants([]);
      setGitCommits([]);
      setGroupMembers([]);
      setComments([]);
      setAnalyticsEvents([]);
      lastSyncedVariantRAMRef.current = null;
    }
  }, [currentUser]);

  // Sync loaded server data into local state when query completes
  useEffect(() => {
    if (currentUser && cvQuery.data && cvQuery.data.success) {
      const data = cvQuery.data;
      if (data.content) {
        setMasterCvData(data.content);
        lastSyncedVariantRAMRef.current = projectMasterToVariant(data.content, activeVariant);
      }
      if (data.style) setStyleData(data.style);
      if (data.variants && data.variants.length > 0) {
        setVariants(data.variants.map((v) => ({ id: v.variantKey || v.id, label: v.label })));
      }
      if (data.gitCommits) setGitCommits(data.gitCommits);
      if (data.groupMembers) setGroupMembers(data.groupMembers);
      if (data.comments) setComments(data.comments);
      if (data.analyticsEvents) setAnalyticsEvents(data.analyticsEvents);
      if (data.slug) setSlug(data.slug);
    }
  }, [currentUser, cvQuery.data]);

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

      trpcClient.cv.save
        .mutate({
          userId: currentUser?.id,
          variantId,
          patches,
          style: style || styleData,
        })
        .then((data) => {
          if (data && data.success) {
            lastSyncedVariantRAMRef.current = nextVariantRAM;
          }
        })
        .catch(() => {});
    }, 2000);
  };

  // State update callback for active variant RAM content
  const handleUpdateCvData = (updater) => {
    const currentVariantRAM = cvData || {};
    const nextVariantRAM = typeof updater === 'function' ? updater(currentVariantRAM) : updater;
    if (!nextVariantRAM) return;

    // Validate client payload
    const val = validateClientCvData(nextVariantRAM);
    if (!val.isValid) {
      console.error('Invalid CV Data client update:', val.error);
      return;
    }

    setMasterCvData((prevMaster) => mergeVariantToMaster(prevMaster || {}, nextVariantRAM, activeVariant));
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

  // Mutations for relational features via tRPC
  const addGitCommitMutation = useMutation(
    trpc.cv.addCommit.mutationOptions({
      onSuccess: (data) => {
        if (data && data.success && data.commit) {
          setGitCommits((prev) => [data.commit, ...prev]);
        }
      },
    })
  );

  const handleAddGitCommit = async (message, tag) => {
    return addGitCommitMutation.mutateAsync({ message, tag });
  };

  const addGroupCommentMutation = useMutation(
    trpc.cv.addComment.mutationOptions({
      onSuccess: (data) => {
        if (data && data.success && data.comment) {
          setComments((prev) => [data.comment, ...prev]);
        }
      },
    })
  );

  const handleAddGroupComment = async (section, text) => {
    return addGroupCommentMutation.mutateAsync({ section, text });
  };

  const toggleGroupCommentMutation = useMutation(
    trpc.cv.toggleComment.mutationOptions({
      onSuccess: (data, commentId) => {
        if (data && data.success && data.comment) {
          const targetId = typeof commentId === 'string' ? commentId : commentId?.id;
          setComments((prev) => prev.map((c) => (c.id === targetId ? data.comment : c)));
        }
      },
    })
  );

  const handleToggleGroupComment = async (commentId) => {
    return toggleGroupCommentMutation.mutateAsync(commentId);
  };

  const recordAnalyticsMutation = useMutation(
    trpc.cv.recordAnalytics.mutationOptions({
      onSuccess: (data) => {
        if (data && data.success && data.event) {
          setAnalyticsEvents((prev) => [...prev, data.event]);
        }
      },
    })
  );

  const handleRecordAnalytics = async (eventType, referrer, durationSeconds) => {
    return recordAnalyticsMutation.mutateAsync({ eventType, referrer, durationSeconds });
  };

  const value = {
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
    handleRecordAnalytics,
    isLoading: cvQuery.isLoading,
    isError: cvQuery.isError,
    error: cvQuery.error,
    refetchCv: cvQuery.refetch,
  };

  return <CvContext.Provider value={value}>{children}</CvContext.Provider>;
}

export function useCv() {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error('useCv must be used within a CvProvider');
  }
  return context;
}
