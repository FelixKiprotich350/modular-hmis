export interface AddressHierarchyLevel {
  id: string;
  name: string;
  levelId: number;
  addressField: string;
  required: boolean;
  parent?: string;
}

export interface AddressHierarchyEntry {
  id: string;
  name: string;
  levelId: string;
  parentId?: string;
  userGeneratedId?: string;
  latitude?: number;
  longitude?: number;
}

export interface PersonAddress {
  id: string;
  personId: string;
  preferred: boolean;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}