export interface ModalState {
  message: string;
  type: 'alert' | 'confirm' | 'prompt';
  onConfirm?: () => void;
  onCancel?: () => void;
  onPromptSubmit?: (value: string) => void;
  defaultValue?: string;
}
