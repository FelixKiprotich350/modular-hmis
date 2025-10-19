export interface Role {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Privilege {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePrivilege {
  roleId: string;
  privilegeId: string;
}