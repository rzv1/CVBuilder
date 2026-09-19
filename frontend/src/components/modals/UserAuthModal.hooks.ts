import { useState, useEffect, useCallback } from 'react';
import { UseUserAuthModalParams, UseUserAuthModalReturn } from './UserAuthModal.types';

export function useUserAuthModal({
  currentUser,
  onUserAuth,
  onClose,
  isOpen,
}: UseUserAuthModalParams): UseUserAuthModalReturn {
  const [nameInput, setNameInput] = useState<string>(currentUser?.name || '');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setNameInput(currentUser?.name || '');
    setErrorMsg('');
  }, [currentUser, isOpen]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = nameInput.trim();
      if (!name) {
        setErrorMsg('Vă rugăm să introduceți numele dumneavoastră.');
        return;
      }

      setIsLoading(true);
      setErrorMsg('');

      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });

        const data = await res.json();
        if (data.success && data.user) {
          onUserAuth(data.user);
          onClose();
        } else {
          setErrorMsg(data.error || 'Eroare la înregistrare/autentificare.');
        }
      } catch {
        setErrorMsg('Nu s-a putut conecta la server. Verificați conexiunea.');
      } finally {
        setIsLoading(false);
      }
    },
    [nameInput, onClose, onUserAuth]
  );

  const handleLogout = useCallback(() => {
    onUserAuth(null);
    setNameInput('');
    onClose();
  }, [onClose, onUserAuth]);

  const initialLetter = currentUser?.name
    ? currentUser.name.charAt(0).toUpperCase()
    : 'U';

  return {
    nameInput,
    setNameInput,
    errorMsg,
    isLoading,
    initialLetter,
    handleSubmit,
    handleLogout,
  };
}
