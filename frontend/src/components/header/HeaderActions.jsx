import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  UploadCloud, 
  Download, 
  BookOpen,
  User,
  UserRoundIcon,
  Zap,
  LogOut,
  Copy,
  Check,
  UploadIcon,
  FileTextIcon,
  FileIcon,
  XIcon,
  Menu as MenuIcon
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from '../ui/item';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { QrCode, QrCodeFrame, QrCodePattern } from '../ui/qr-code';
import { FileUpload, FileUploadLabel, FileUploadDropzone, FileUploadContext, FileUploadItemGroup, FileUploadItem, FileUploadItemPreview, FileUploadItemName, FileUploadItemSizeText, FileUploadItemDeleteTrigger, FileUploadItemPreviewImage } from '../ui/file-upload';
import { 
  Menu, 
  MenuTrigger, 
  MenuPopup, 
  MenuItem, 
  MenuItemGroup, 
  MenuSeparator 
} from '../ui/menu';
import { useAuth, useUI } from '../../context/index.jsx';
import { cn } from '@/lib/utils';

const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export default function HeaderActions(props = {}) {
  const auth = useAuth();
  const ui = useUI();

  const currentUser = props.currentUser ?? auth.currentUser;
  const userCredits = props.userCredits ?? auth.activeCredits;
  const onUserAuth = props.onUserAuth ?? auth.handleUserAuth;
  const viewMode = props.viewMode ?? ui.viewMode;
  const onOpenBlog = props.onOpenBlog ?? ui.toggleBlogView;
  const onExportPdf = props.onExportPdf ?? ui.handleExportPdf;

  const isAuthOpen = props.isAuthOpen ?? auth.isAuthModalOpen;
  const setIsAuthOpen = props.setIsAuthOpen ?? auth.setIsAuthModalOpen;

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://cvbuilder.dev/cv/live-demo';

  const handleCopyShareUrl = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    setNameInput(currentUser?.name || '');
    setAvatar(currentUser?.avatar || '');
    setErrorMsg('');
  }, [currentUser, isAuthOpen]);

  const handleAvatarChange = (details) => {
    if (details?.acceptedFiles && details.acceptedFiles.length > 0) {
      const file = details.acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result || '');
      };
      reader.readAsDataURL(file);
    } else {
      setAvatar('');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (!name) {
      setErrorMsg('Vă rugăm să introduceți numele dumneavoastră.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const mutation = props.registerMutation ?? auth.registerMutation;
      const data = await mutation.mutateAsync({ name, avatar });
      if (data?.success && data?.user) {
        if (onUserAuth) {
          onUserAuth(data.user);
        }
        setIsAuthOpen(false);
      } else {
        setErrorMsg(data?.error || 'Eroare la înregistrare/autentificare.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Nu s-a putut conecta la server. Verificați conexiunea.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cv_builder_token');
    localStorage.removeItem('cv_builder_user');
    localStorage.removeItem('cv_builder_content');
    if (onUserAuth) {
      onUserAuth(null);
    }
    setNameInput('');
    setAvatar('');
    setIsAuthOpen(false);
  };

  return (
    <div className="flex items-center">
      {/* Single Menu Dropdown encompassing all header actions */}
      <Menu
        positioning={{ placement: "bottom-end", gutter: 8 }}
        onSelect={(details) => {
          switch (details.value) {
            case 'auth':
              setIsAuthOpen(true);
              break;
            case 'export-pdf':
              onExportPdf?.();
              break;
            case 'import':
              setIsImportOpen(true);
              break;
            case 'share':
              setIsShareOpen(true);
              break;
            case 'blog':
              onOpenBlog?.();
              break;
            case 'logout':
              handleLogout();
              break;
            default:
              break;
          }
        }}
      >
        <MenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 h-9 px-3 bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 rounded-lg text-slate-200 transition-colors cursor-pointer"
            title="Meniu Acțiuni"
            aria-label="Deschide meniu acțiuni"
          >
            <MenuIcon className="size-4 text-slate-300" />
            <span className="text-xs font-semibold">Meniu</span>
          </Button>
        </MenuTrigger>

        <MenuPopup 
          positionerClassName="z-[9999]"
          className="w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-slate-200 shadow-2xl shadow-black/80 p-1.5 rounded-xl"
        >
          <MenuItemGroup>
            {/* User Profile / Status */}
            {currentUser ? (
              <div className="px-2.5 py-2 mb-1 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-950 text-indigo-400 border border-indigo-500/30 overflow-hidden">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.name} className="size-full object-cover" />
                      ) : (
                        <User className="size-3.5" />
                      )}
                    </div>
                    <span className="font-semibold text-xs text-slate-100 truncate">
                      {currentUser.name}
                    </span>
                  </div>
                  <Badge variant="warning" className="text-[9.5px] py-0.5 px-1.5 shrink-0 gap-1 font-semibold">
                    <Zap className="size-2.5 fill-amber-400" /> {currentUser.credits ?? userCredits ?? 0}
                  </Badge>
                </div>
              </div>
            ) : null}

            <MenuItem
              value="auth"
              onSelect={() => setIsAuthOpen(true)}
              className="flex items-center justify-between text-xs px-2.5 py-2 rounded-lg cursor-pointer hover:bg-slate-800 text-slate-200 hover:text-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <User className="size-3.5 text-indigo-400" />
                <span className="font-medium">
                  {currentUser ? 'Setări Profil' : 'Autentificare / Înregistrare'}
                </span>
              </div>
              {!currentUser && (
                <Badge variant="warning" className="text-[9px] py-0 px-1 font-semibold">
                  +100 AI
                </Badge>
              )}
            </MenuItem>

            <MenuSeparator className="bg-slate-800 my-1 -mx-1" />

            <MenuItem
              value="export-pdf"
              onSelect={() => onExportPdf?.()}
              className="flex items-center gap-2.5 text-xs px-2.5 py-2 rounded-lg cursor-pointer hover:bg-slate-800 text-slate-200 hover:text-slate-100 transition-colors"
            >
              <Download className="size-3.5 text-emerald-400" />
              <span className="font-medium">Descarcă PDF</span>
            </MenuItem>

            <MenuItem
              value="import"
              onSelect={() => setIsImportOpen(true)}
              className="flex items-center gap-2.5 text-xs px-2.5 py-2 rounded-lg cursor-pointer hover:bg-slate-800 text-slate-200 hover:text-slate-100 transition-colors"
            >
              <UploadCloud className="size-3.5 text-indigo-400" />
              <span className="font-medium">Import CV</span>
            </MenuItem>

            <MenuItem
              value="share"
              onSelect={() => setIsShareOpen(true)}
              className="flex items-center gap-2.5 text-xs px-2.5 py-2 rounded-lg cursor-pointer hover:bg-slate-800 text-slate-200 hover:text-slate-100 transition-colors"
            >
              <Share2 className="size-3.5 text-blue-400" />
              <span className="font-medium">Share & Cod QR</span>
            </MenuItem>


            {currentUser && (
              <>
                <MenuSeparator className="bg-slate-800 my-1 -mx-1" />
                <MenuItem
                  value="logout"
                  onSelect={handleLogout}
                  className="flex items-center gap-2.5 text-xs px-2.5 py-2 rounded-lg cursor-pointer hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="size-3.5" />
                  <span className="font-medium">Deconectare</span>
                </MenuItem>
              </>
            )}
          </MenuItemGroup>
        </MenuPopup>
      </Menu>

      {/* User Auth Modal Dialog */}
      <Dialog open={isAuthOpen} onOpenChange={(details) => setIsAuthOpen(details.open)}>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>
              {currentUser ? 'Profil Utilizator' : 'Autentificare / Înregistrare'}
            </DialogTitle>
            <DialogDescription>
              {currentUser
                ? 'Gestionează-ți contul și creditele AI'
                : 'Conectează-te pentru a primi 100 credite AI cadou'}
            </DialogDescription>
          </DialogHeader>

          <DialogPanel>
            <form onSubmit={handleAuthSubmit} id="user-auth-form" className="flex flex-col gap-4">
              {!currentUser ? (
                <Item>
                  <ItemMedia>
                    <Zap className="size-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Bonus Gratuit: 100 Credite AI</ItemTitle>
                    <ItemDescription>
                      La prima înregistrare cu numele tău, primești automat 100 de credite pentru asistentul Gemini.
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ) : (
                <Item>
                  <ItemMedia>
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="size-5 rounded-full object-cover" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{currentUser.name}</ItemTitle>
                    <ItemDescription>Cont Activ înregistrat</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="warning">
                      <Zap className="size-3" /> {currentUser.credits ?? userCredits ?? 0}
                    </Badge>
                  </ItemActions>
                </Item>
              )}

              {/* Avatar Photo Upload */}
              <div className="flex flex-col items-center justify-center w-full py-1">
                <FileUpload
                  accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
                  className="w-full max-w-xs flex-col items-center gap-4"
                  maxFileSize={AVATAR_MAX_BYTES}
                  maxFiles={1}
                  onFileChange={handleAvatarChange}
                >
                  <FileUploadLabel className="sr-only">Avatar photo</FileUploadLabel>
                  <div className="relative size-40 sm:size-48 shrink-0">
                    <FileUploadContext>
                      {({ acceptedFiles }) => {
                        if (acceptedFiles.length <= 0) {
                          return (
                            <FileUploadDropzone
                              className={cn(
                                "cursor-pointer flex size-40 sm:size-48 flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-input bg-muted/20 p-4 transition-colors relative overflow-hidden group",
                                "hover:bg-muted/35 data-dragging:border-primary data-dragging:bg-primary/5",
                              )}
                            >
                              {avatar ? (
                                <>
                                  <img src={avatar} alt="Avatar" className="size-full object-cover absolute inset-0 rounded-full" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                                    <UserRoundIcon className="size-8 mb-1" />
                                    <span className="text-xs text-center font-medium">Schimbă poza</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <UserRoundIcon className="size-12 text-muted-foreground" />
                                  <span className="px-2 text-center text-muted-foreground text-xs leading-tight">
                                    Tap or drop image
                                  </span>
                                </>
                              )}
                            </FileUploadDropzone>
                          );
                        }

                        return (
                          <FileUploadItemGroup
                            className={cn(
                              "absolute inset-0 m-0 flex items-center justify-center p-0",
                            )}
                          >
                            {acceptedFiles.map((file) => (
                              <FileUploadItem
                                key={`${file.name}-${file.size}`}
                                className="relative size-full max-h-40 sm:max-h-48 max-w-40 sm:max-w-48 border-0 bg-transparent p-0 shadow-none"
                                file={file}
                              >
                                <FileUploadItemPreview
                                  className="size-full overflow-hidden rounded-full border-0"
                                  type="image/*"
                                >
                                  <FileUploadItemPreviewImage className="size-full max-h-none max-w-none border-0 object-cover" />
                                </FileUploadItemPreview>
                                <FileUploadItemDeleteTrigger
                                  aria-label={`Remove ${file.name}`}
                                  className="absolute top-4 right-3 z-10 rounded-full bg-background p-1 hover:bg-muted"
                                >
                                  <XIcon className="stroke-[2.5]" />
                                </FileUploadItemDeleteTrigger>
                              </FileUploadItem>
                            ))}
                          </FileUploadItemGroup>
                        );
                      }}
                    </FileUploadContext>
                  </div>
                  <FileUploadContext>
                    {({ acceptedFiles }) => (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <p className="font-semibold text-base text-foreground leading-tight">
                          {acceptedFiles.length > 0 || avatar ? "Avatar uploaded" : "Add your avatar"}
                        </p>
                        <p className="text-muted-foreground text-sm leading-snug">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                    )}
                  </FileUploadContext>
                </FileUpload>
              </div>

              <div className="flex flex-col gap-2">
                <ItemDescription>
                  {currentUser ? 'Modifică numele contului:' : 'Introduceți numele dumneavoastră:'}
                </ItemDescription>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <User className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="ex: Alex Popescu"
                    required
                  />
                </InputGroup>
              </div>

              {errorMsg && (
                <Badge variant="destructive">
                  {errorMsg}
                </Badge>
              )}
            </form>
          </DialogPanel>

          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" size="sm">
                  Anulează
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form="user-auth-form"
                size="sm"
                disabled={isLoading}
                loading={isLoading}
              >
                {currentUser ? 'Actualizează Cont' : 'Înregistrare / Autentificare'}
              </Button>
            </div>
          </DialogFooter>
        </DialogPopup>
      </Dialog>

      {/* Import CV Dialog */}
      <Dialog open={isImportOpen} onOpenChange={(details) => setIsImportOpen(details.open)}>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Import CV</DialogTitle>
            <DialogDescription>
              Click sau Drag & Drop fișier
            </DialogDescription>
          </DialogHeader>
          <DialogPanel>
            <FileUpload
              accept={{
                "application/pdf": [".pdf"],
                "application/word": [".doc", ".docx"],
                "text/plain": [".txt"],
                "application/json": [".json"]
              }}
              className="max-w-md"
              maxFiles={1}
            >
              <FileUploadDropzone>
                <UploadIcon className="size-6"/>
                <p>Supported formats: PDF, DOCX, TXT, JSON</p>
              </FileUploadDropzone>
              <FileUploadContext>
                {({ rejectedFiles }) =>
                  rejectedFiles.length > 0 ? (
                    <ul className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-destructive text-xs">
                      {rejectedFiles.map((rejectedFile) => (
                        <li key={`${rejectedFile.file.name}-${rejectedFile.file.size}`}>
                          {rejectedFile.file.name}: {rejectedFile.errors.join(", ")}
                        </li>
                      ))}
                    </ul>
                  ) : null
                }
              </FileUploadContext>
              <FileUploadItemGroup>
                <FileUploadContext>
                  {({ acceptedFiles }) =>
                    acceptedFiles.map((file) => (
                      <FileUploadItem key={`${file.name}-${file.size}`} file={file}>
                        <FileUploadItemPreview type="image/*">
                          <FileUploadItemPreviewImage />
                        </FileUploadItemPreview>
                        <FileUploadItemPreview type="application/pdf">
                          <FileTextIcon className="text-rose-600" />
                        </FileUploadItemPreview>
                        <FileUploadItemPreview type=".*">
                          <FileIcon />
                        </FileUploadItemPreview>
                        <FileUploadItemName />
                        <FileUploadItemSizeText />
                        <FileUploadItemDeleteTrigger aria-label={`Remove ${file.name}`}>
                          <XIcon />
                        </FileUploadItemDeleteTrigger>
                      </FileUploadItem>
                    ))
                  }
                </FileUploadContext>
              </FileUploadItemGroup>
            </FileUpload>
          </DialogPanel>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" variant="ghost">
                Anulează
              </Button>
            </DialogClose>
            <Button size="sm" variant="button" onClick={() => setIsImportOpen(false)}>
              Salvează
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>

      {/* Share & QR Dialog */}
      <Dialog open={isShareOpen} onOpenChange={(details) => setIsShareOpen(details.open)}>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Hosted Dynamic CV & QR Code</DialogTitle>
            <DialogDescription>
              Partajează CV-ul tău online prin link sau cod QR
            </DialogDescription>
          </DialogHeader>

          <DialogPanel>
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center p-3">
                <QrCode value={shareUrl} size={160}>
                  <QrCodeFrame>
                    <QrCodePattern />
                  </QrCodeFrame>
                </QrCode>
              </div>

              <Item>
                <ItemContent>
                  <ItemDescription>
                    Scanați codul pentru a vizualiza CV-ul live pe orice dispozitiv mobil
                  </ItemDescription>
                </ItemContent>
              </Item>

              <div className="flex flex-col gap-2 w-full">
                <InputGroup>
                  <InputGroupInput
                    type="text"
                    readOnly
                    value={shareUrl}
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={handleCopyShareUrl}
                    >
                      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      {copied ? 'Copiat' : 'Copiază'}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <Item variant="muted">
                <ItemContent>
                  <ItemDescription>
                    Acest cod QR este automat inclus în antetul superior din dreapta al documentelor PDF descărcate.
                  </ItemDescription>
                </ItemContent>
              </Item>
            </div>
          </DialogPanel>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="default" size="sm">
                Închide
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </div>
  );
}
