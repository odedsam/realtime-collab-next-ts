import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, options?: Parameters<typeof sonnerToast.success>[1]) => {
    return sonnerToast.success(message, options);
  },

  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) => {
    return sonnerToast.error(message, options);
  },

  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) => {
    return sonnerToast.info(message, options);
  },

  warning: (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) => {
    return sonnerToast.warning(message, options);
  },

  loading: (message: string, options?: Parameters<typeof sonnerToast.loading>[1]) => {
    return sonnerToast.loading(message, options);
  },

  message: (message: string, options?: Parameters<typeof sonnerToast.message>[1]) => {
    return sonnerToast.message(message, options);
  },

  dismiss: (id: string | number) => {
    sonnerToast.dismiss(id);
  },
};
