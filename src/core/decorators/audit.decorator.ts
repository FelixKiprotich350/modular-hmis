import { SetMetadata } from '@nestjs/common';

export const Audit = (action?: string) => SetMetadata('audit', action || true);