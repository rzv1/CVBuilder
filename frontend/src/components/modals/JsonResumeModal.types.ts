export interface ValidationErrorItem {
  path: string;
  message: string;
}

export interface JsonValidationResult {
  isValid: boolean;
  syntaxError: boolean;
  errors: ValidationErrorItem[];
}

export interface JsonResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonContent: any;
}

export interface UseJsonResumeModalParams {
  jsonContent: any;
  isOpen: boolean;
}

export interface UseJsonResumeModalReturn {
  jsonText: string;
  copied: boolean;
  validationResult: JsonValidationResult;
  handleCopy: () => void;
  handleJsonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
