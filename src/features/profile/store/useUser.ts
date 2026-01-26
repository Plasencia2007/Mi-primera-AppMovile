import { create } from 'zustand';
import { USER_MOCKS } from '../../../data/mocks/user.mocks';
import { UserState } from '../../../types/user.types';

export const useUser = create<UserState>((set, get) => ({
  profile: USER_MOCKS.profile,
  
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

  getInitials: () => {
    const name = get().profile.name;
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}));
