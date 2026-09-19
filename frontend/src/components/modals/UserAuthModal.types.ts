export interface CurrentUser {
  name: string;
  credits?: number;
  [key: string]: any;
}

export interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: CurrentUser | null;
  onUserAuth: (user: CurrentUser | null) => void;
}

export interface UseUserAuthModalParams {
  currentUser?: CurrentUser | null;
  onUserAuth: (user: CurrentUser | null) => void;
  onClose: () => void;
  isOpen: boolean;
}

export interface UseUserAuthModalReturn {
  nameInput: string;
  setNameInput: (val: string) => void;
  errorMsg: string;
  isLoading: boolean;
  initialLetter: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => void;
}
