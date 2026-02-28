export interface User {
  id: string;
  userName?: string;
  username?: string; // Add alias for consistency
  name?: string;
  password?: string;
  email?: string;
  image?: string;
  active: boolean;
  roles?: string;
  role?: string; // Add alias for consistency
}

export enum RoleType {
  ADMIN = 'admin',
  MEMBER = 'member',
}
