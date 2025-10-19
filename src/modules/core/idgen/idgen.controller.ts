import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IdgenService } from './services/idgen.service';
import { IdentifierSource } from './models/idgen.model';

@Controller('idgen')
export class IdgenController {
  constructor(private readonly idgenService: IdgenService) {}

  @Post('sources')
  async createSource(@Body() createSourceDto: Omit<IdentifierSource, 'id' | 'createdAt'>) {
    return this.idgenService.createIdentifierSource(createSourceDto);
  }

  @Get('generate/:sourceId')
  async generateIdentifier(@Param('sourceId') sourceId: string) {
    const identifier = await this.idgenService.getNextIdentifier(sourceId);
    return { identifier };
  }

  @Post('reserve/:sourceId')
  async reserveIdentifiers(@Param('sourceId') sourceId: string, @Body() data: { count: number }) {
    const identifiers = await this.idgenService.reserveIdentifiers(sourceId, data.count);
    return { identifiers };
  }

  @Get('validate')
  async validateIdentifier(@Query('identifier') identifier: string, @Query('type') typeId: string) {
    const valid = await this.idgenService.validateIdentifier(identifier, typeId);
    return { valid };
  }
}