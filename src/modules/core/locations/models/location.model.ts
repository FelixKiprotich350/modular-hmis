export interface Location {
  id: string;
  name: string;
  description?: string;
  address?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  parentLocationId?: string;
  tags?: LocationTag[];
  attributes?: LocationAttribute[];
  retired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationTag {
  id: string;
  name: string;
  description?: string;
  retired: boolean;
}

export interface LocationAttribute {
  id: string;
  locationId: string;
  attributeTypeId: string;
  value: string;
  createdAt: Date;
}

export interface LocationAttributeType {
  id: string;
  name: string;
  description?: string;
  datatype: string;
  minOccurs: number;
  maxOccurs?: number;
  retired: boolean;
}