import { useState, useCallback } from 'react';
import { UseShareQrModalParams, UseShareQrModalReturn } from './ShareQrModal.types';

const DEFAULT_HOSTED_URL = 'https://cvbuilder.dev/cv/live-demo';

export function useShareQrModal({
  hostedUrl = DEFAULT_HOSTED_URL,
  qrCodeUrl,
}: UseShareQrModalParams = {}): UseShareQrModalReturn {
  const [copied, setCopied] = useState(false);

  const activeUrl = hostedUrl || DEFAULT_HOSTED_URL;
  const activeQrUrl =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(activeUrl)}`;

  const handleCopy = useCallback(() => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(activeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [activeUrl]);

  return {
    copied,
    activeUrl,
    activeQrUrl,
    handleCopy,
  };
}
