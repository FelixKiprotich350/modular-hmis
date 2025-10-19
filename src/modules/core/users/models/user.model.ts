export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  userId: string;
  roleId: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  privileges: RolePrivilege[];
}

export interface RolePrivilege {
  roleId: string;
  privilegeId: string;
  privilege: Privilege;
}

export interface Privilege {
  id: string;
  name: string;
}