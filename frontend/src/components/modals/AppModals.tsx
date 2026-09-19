import React from 'react';
import JsonResumeModal from './JsonResumeModal';
import CvImportModal from './CvImportModal';
import ShareQrModal from './ShareQrModal';
import UserAuthModal from './UserAuthModal';

export interface AppModalsProps {
  isJsonModalOpen: boolean;
  setIsJsonModalOpen: (open: boolean) => void;
  masterCvData: any;

  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  currentUser?: any;
  setMasterCvData: (data: any) => void;

  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  handleUserAuth: (user: any) => void;
}

export default function AppModals({
  isJsonModalOpen,
  setIsJsonModalOpen,
  masterCvData,

  isImportModalOpen,
  setIsImportModalOpen,
  currentUser,
  setMasterCvData,

  isShareModalOpen,
  setIsShareModalOpen,

  isAuthModalOpen,
  setIsAuthModalOpen,
  handleUserAuth,
}: AppModalsProps): React.ReactNode {
  return (
    <>
      <JsonResumeModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        jsonContent={masterCvData}
      />

      <CvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        currentUser={currentUser}
        onImportCv={(data) => {
          if (data && typeof data === 'object') {
            setMasterCvData(data);
          }
        }}
      />

      <ShareQrModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        hostedUrl="https://cvbuilder.dev/cv/live-demo"
        qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://cvbuilder.dev/cv/live-demo"
      />

      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserAuth={handleUserAuth}
      />
    </>
  );
}
