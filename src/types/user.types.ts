export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: any | null;
  points: number;
}

export interface UserState {
  profile: UserProfile;
  updateAvatar: (avatar: any) => void;
  updateName: (name: string) => void;
  getInitials: () => string;
}
