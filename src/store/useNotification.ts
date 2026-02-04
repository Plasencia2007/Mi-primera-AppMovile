import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationState {
  visible: boolean;
  type: NotificationType;
  title: string;
  message: string;
  showNotification: (params: { type: NotificationType; title: string; message: string }) => void;
  hideNotification: () => void;
}

export const useNotification = create<NotificationState>((set) => ({
  visible: false,
  type: 'info',
  title: '',
  message: '',
  showNotification: ({ type, title, message }) => {
    set({ visible: true, type, title, message });
  },
  hideNotification: () => {
    set({ visible: false });
  },
}));
