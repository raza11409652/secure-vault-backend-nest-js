export interface AuthSessionPayload {
  id: string;
  email: string;
  issuer: 'SYS_VAULT' | string;
  role: 'ADMIN' | 'USER';
  t?: string;
}
