export type { responseInterface } from 'swr';

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  accessToken: string | null;
}
