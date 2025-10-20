import { SetMetadata } from '@nestjs/common';

export const API_VERSION_KEY = 'apiVersion';
export const ApiVersion = (version: 'internal' | 'fhir') => SetMetadata(API_VERSION_KEY, version);