export interface IUser {
  user_id: string;
  email?: string;
  profile_name: string;
  user_name?: string | null;
  bio?: string | null;
  country?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  dob?: string | null;
  gender?: string | null;
  profile_img?: string | null;
}

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
