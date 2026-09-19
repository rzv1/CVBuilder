export interface ShareQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostedUrl?: string;
  qrCodeUrl?: string;
}

export interface UseShareQrModalParams {
  hostedUrl?: string;
  qrCodeUrl?: string;
}

export interface UseShareQrModalReturn {
  copied: boolean;
  activeUrl: string;
  activeQrUrl: string;
  handleCopy: () => void;
}
