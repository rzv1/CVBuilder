import React from 'react';
import JsonResumeModal from './JsonResumeModal.jsx';
import ImportCvModal from './ImportCvModal.jsx';
import ShareQrModal from './ShareQrModal.jsx';
import UserAuthModal from './UserAuthModal.jsx';

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
  handleUserAuth
}) {
  return (
    <>
      <JsonResumeModal 
        isOpen={isJsonModalOpen} 
        onClose={() => setIsJsonModalOpen(false)} 
        jsonContent={masterCvData}
      />

      <ImportCvModal 
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
