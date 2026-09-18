import { useState, useEffect } from 'react';

export function useUserAuth() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cv_builder_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Sync user state with localStorage and backend Prisma DB on boot
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem('cv_builder_user', JSON.stringify(currentUser));
      fetch(`/api/users/${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('cv_builder_user', JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    } else {
      localStorage.removeItem('cv_builder_user');
    }
  }, [currentUser?.id]);

  const handleUserAuth = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('cv_builder_user', JSON.stringify(user));
    }
  };

  return {
    currentUser,
    setCurrentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleUserAuth
  };
}
