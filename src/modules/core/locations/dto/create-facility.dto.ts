import { ApiProperty } from '@nestjs/swagger';

export class CreateFacilityDto {
  @ApiProperty({ example: 'General Hospital' })
  name: string;

  @ApiProperty({ required: false, example: 'Main healthcare facility' })
  description?: string;

  @ApiProperty({ required: false, example: '123 Health Street' })
  address?: string;

  @ApiProperty({ required: false, example: 'Springfield' })
  cityVillage?: string;

  @ApiProperty({ required: false, example: 'Illinois' })
  stateProvince?: string;

  @ApiProperty({ required: false, example: 'USA' })
  country?: string;

  @ApiProperty({ required: false, example: '62701' })
  postalCode?: string;

  @ApiProperty({ required: false, example: '+1-555-0100' })
  phone?: string;
}

export class CreateDepartmentDto {
  @ApiProperty({ example: 'facility-uuid' })
  facilityId: string;

  @ApiProperty({ example: 'Emergency Department' })
  name: string;

  @ApiProperty({ required: false, example: 'Emergency and trauma care' })
  description?: string;
}

export class CreateLocationDto {
  @ApiProperty({ example: 'facility-uuid' })
  facilityId: string;

  @ApiProperty({ example: 'Building A' })
  name: string;

  @ApiProperty({ required: false, example: 'Main building' })
  description?: string;

  @ApiProperty({ enum: ['facility', 'location', 'service_point'], example: 'location' })
  locationLevel: string;

  @ApiProperty({ required: false, example: 'parent-location-uuid' })
  parentLocationId?: string;
}

export class CreateServicePointDto {
  @ApiProperty({ example: 'location-uuid' })
  locationId: string;

  @ApiProperty({ example: 'Consultation Room 1' })
  name: string;

  @ApiProperty({ required: false, example: 'Primary consultation room' })
  description?: string;

  @ApiProperty({ enum: ['consultation', 'pharmacy', 'lab', 'radiology', 'procedure'], example: 'consultation' })
  serviceType: string;
}