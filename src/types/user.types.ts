export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: any | null;
  points: number;
  role: 'admin' | 'customer'; // Nuevo
  phone?: string;
  dni?: string;
  province?: string;
  district?: string;
}

export interface UserState {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateAvatar: (avatar: any) => void;
  updateName: (name: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getInitials: () => string;
}
