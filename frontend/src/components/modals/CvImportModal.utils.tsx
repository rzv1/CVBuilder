import React from 'react';
import { Badge } from '@/components/ui/badge';

/**
 * Format raw byte size into human readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' Bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

/**
 * Generate a Badge component based on file extension
 */
export const getFileExtensionBadge = (filename: string): React.ReactNode => {
  const ext = (filename.split('.').pop() || '').toUpperCase();
  if (ext === 'JSON') return <Badge variant="purple">{ext}</Badge>;
  if (ext === 'PDF') return <Badge variant="destructive">{ext}</Badge>;
  if (ext === 'DOC' || ext === 'DOCX') return <Badge variant="blue">{ext}</Badge>;
  return <Badge variant="secondary">{ext}</Badge>;
};
