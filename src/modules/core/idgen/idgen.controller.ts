import { Controller, Get, Post, Body, Param, Query, Put, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdgenService } from './services/idgen.service';
import { IdentifierSource, IdentifierType } from './models/idgen.model';

@ApiTags('ID Generation')
@Controller('idgen')
export class IdgenController {
  constructor(@Inject('idgenService') private readonly idgenService: IdgenService) {}

  @Post('types')
  async createIdentifierType(@Body() createTypeDto: Omit<IdentifierType, 'id'>) {
    return this.idgenService.createIdentifierType(createTypeDto);
  }

  @Get('types')
  async getIdentifierTypes() {
    return this.idgenService.getIdentifierTypes();
  }

  @Post('sources')
  async createSource(@Body() createSourceDto: Omit<IdentifierSource, 'id' | 'createdAt'>) {
    return this.idgenService.createIdentifierSource(createSourceDto);
  }

  @Get('sources')
  async getSources() {
    return this.idgenService.getIdentifierSources();
  }

  @Get('generate/:sourceId')
  async generateIdentifier(@Param('sourceId') sourceId: string) {
    const identifier = await this.idgenService.getNextIdentifier(sourceId);
    await this.idgenService.markAsUsed(identifier);
    return { identifier };
  }

  @Post('reserve/:sourceId')
  async reserveIdentifiers(@Param('sourceId') sourceId: string, @Body() data: { count: number }) {
    const identifiers = await this.idgenService.reserveIdentifiers(sourceId, data.count);
    return { identifiers, count: identifiers.length };
  }

  @Get('validate')
  async validateIdentifier(@Query('identifier') identifier: string, @Query('type') typeId: string) {
    const valid = await this.idgenService.validateIdentifier(identifier, typeId);
    return { identifier, valid };
  }

  @Put('pool/:sourceId')
  async addToPool(@Param('sourceId') sourceId: string, @Body() data: { identifiers: string[] }) {
    const results = [];
    for (const identifier of data.identifiers) {
      const pooled = await this.idgenService.addToPool(sourceId, identifier);
      results.push(pooled);
    }
    return { added: results.length, identifiers: results };
  }
}