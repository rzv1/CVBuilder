import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC, trpcClient } from '../lib/trpc.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize currentUser from localStorage (reads token and cached user)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cv_builder_user');
      if (saved) return JSON.parse(saved);
      const token = localStorage.getItem('cv_builder_token');
      return token ? { id: token, name: '' } : null;
    } catch {
      return null;
    }
  });

  const activeToken = currentUser?.id || (typeof window !== 'undefined' ? (localStorage.getItem('cv_builder_token') || '') : '');

  // Query to refresh user details & credits from server via tRPC using token ID
  const { data: userData } = useQuery({
    ...trpc.users.getById.queryOptions(activeToken),
    enabled: Boolean(activeToken),
  });

  // Sync refreshed server data to currentUser and localStorage token
  useEffect(() => {
    if (userData?.success && userData?.user) {
      setCurrentUser(userData.user);
      localStorage.setItem('cv_builder_token', userData.user.id);
      localStorage.setItem('cv_builder_user', JSON.stringify(userData.user));
    }
  }, [userData]);

  // Mutation for unified user login / registration via tRPC
  const registerMutation = useMutation(
    trpc.users.auth.mutationOptions({
      onSuccess: (data) => {
        const user = data?.user || data;
        if (user) {
          handleUserAuth(user);
          setIsAuthModalOpen(false);
        }
      },
    })
  );

  const handleUserAuth = (user) => {
    setCurrentUser(user);
    if (user && user.id) {
      localStorage.setItem('cv_builder_token', user.id);
      localStorage.setItem('cv_builder_user', JSON.stringify(user));
      queryClient.setQueryData(['user', user.id], { success: true, user });
    } else {
      localStorage.removeItem('cv_builder_token');
      localStorage.removeItem('cv_builder_user');
      localStorage.removeItem('cv_builder_content');
      queryClient.clear();
    }
  };

  const handleLogout = () => {
    handleUserAuth(null);
  };

  const deductCredit = (amount = 1) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        credits: Math.max(0, (prev.credits ?? 0) - amount),
      };
      localStorage.setItem('cv_builder_user', JSON.stringify(updated));
      return updated;
    });
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const activeCredits = currentUser ? (currentUser.credits ?? 0) : 0;

  const value = {
    currentUser,
    setCurrentUser,
    activeCredits,
    isAuthModalOpen,
    setIsAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    handleUserAuth,
    handleLogout,
    deductCredit,
    registerMutation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
