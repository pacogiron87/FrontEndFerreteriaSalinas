export interface User {
  id: string;
  userName?: string;
  name?: string;
  password?: string;
  image?: string;
  active: boolean;
  roles?: string; // Añadimos roles al usuario
}

export enum RoleType {
  ADMIN = 'admin',
  MEMBER = 'member',
}