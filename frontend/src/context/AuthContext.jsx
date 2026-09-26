import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC, trpcClient } from '../lib/trpc.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize currentUser from localStorage (reads token, cached user, and cached avatar)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cv_builder_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id && !parsed.avatar) {
          const cachedAvatar = localStorage.getItem(`cv_builder_avatar_${parsed.id}`);
          if (cachedAvatar) parsed.avatar = cachedAvatar;
        }
        return parsed;
      }
      const token = localStorage.getItem('cv_builder_token');
      if (token) {
        const cachedAvatar = localStorage.getItem(`cv_builder_avatar_${token}`);
        return { id: token, name: '', avatar: cachedAvatar || null };
      }
      return null;
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
      const updatedUser = { ...userData.user };
      if (!updatedUser.avatar && updatedUser.id) {
        try {
          const cachedAvatar = localStorage.getItem(`cv_builder_avatar_${updatedUser.id}`);
          if (cachedAvatar) updatedUser.avatar = cachedAvatar;
        } catch (_) {}
      }
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('cv_builder_token', updatedUser.id);
        localStorage.setItem('cv_builder_user', JSON.stringify(updatedUser));
        if (updatedUser.avatar) {
          localStorage.setItem(`cv_builder_avatar_${updatedUser.id}`, updatedUser.avatar);
        }
      } catch (err) {
        console.warn('Eroare la salvarea în localStorage:', err);
      }
    }
  }, [userData]);

  // Mutation for user registration / auth via tRPC
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

  // Mutation for user login via tRPC
  const loginMutation = useMutation(
    trpc.users.login.mutationOptions({
      onSuccess: (data) => {
        const user = data?.user || data;
        if (user) {
          handleUserAuth(user);
          setIsAuthModalOpen(false);
        }
      },
    })
  );

  // Mutation for updating current user profile via tRPC
  const updateMutation = useMutation(
    trpc.users.update.mutationOptions({
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
      try {
        localStorage.setItem('cv_builder_token', user.id);
        localStorage.setItem('cv_builder_user', JSON.stringify(user));
        if (user.avatar) {
          localStorage.setItem(`cv_builder_avatar_${user.id}`, user.avatar);
        } else {
          localStorage.removeItem(`cv_builder_avatar_${user.id}`);
        }
      } catch (err) {
        console.warn('Eroare salvare sesiune utilizator:', err);
      }
      queryClient.setQueryData(['user', user.id], { success: true, user });
      try {
        queryClient.setQueryData(trpc.users.getById.queryKey(user.id), { success: true, user });
      } catch (_) {}
      queryClient.invalidateQueries(trpc.users.getById.queryFilter());
    } else {
      try {
        if (currentUser?.id) {
          localStorage.removeItem(`cv_builder_avatar_${currentUser.id}`);
        }
        localStorage.removeItem('cv_builder_token');
        localStorage.removeItem('cv_builder_user');
        localStorage.removeItem('cv_builder_content');
      } catch (_) {}
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
    loginMutation,
    registerMutation,
    authMutation: registerMutation,
    updateMutation,
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
