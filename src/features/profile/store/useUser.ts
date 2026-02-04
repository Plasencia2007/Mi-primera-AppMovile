import { create } from 'zustand';
import { USER_MOCKS } from '../../../data/mocks/user.mocks';
import { UserState, UserProfile } from '../../../types/user.types';

export const useUser = create<UserState>((set, get) => ({
  profile: {
    id: '',
    name: '',
    email: '',
    avatar: null,
    points: 0,
  },
  
  setProfile: (profile: UserProfile) => {
    set({ profile });
  },
  
  updateAvatar: (avatar: any) => {
    set((state) => ({
      profile: { ...state.profile, avatar }
    }));
  },

  updateName: (name: string) => {
    set((state) => ({
      profile: { ...state.profile, name }
    }));
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    set((state) => ({
      profile: { ...state.profile, ...updates }
    }));
  },

  getInitials: () => {
    const name = get().profile.name;
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}));
