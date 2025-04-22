export interface IUserSession {
  id: string;
  loginId: string;
  type: number;
  inviteCode: string;
  referrerUserId: string;
  name: string;
  email: string;
  isActive: number;
  photoId: string;
  memo: string;
}
