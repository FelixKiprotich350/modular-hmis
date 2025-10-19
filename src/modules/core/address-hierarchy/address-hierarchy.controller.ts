import { Controller, Get, Post, Body, Param, Put, Query, Inject } from '@nestjs/common';
import { AddressHierarchyService } from './services/address-hierarchy.service';
import { AddressHierarchyLevel, AddressHierarchyEntry, PersonAddress } from './models/address-hierarchy.model';

@Controller({ path: 'address-hierarchy', version: '1' })
export class AddressHierarchyController {
  constructor(@Inject('addressHierarchyService') private readonly addressHierarchyService: AddressHierarchyService) {}

  @Get('levels')
  async getLevels() {
    const levels = await this.addressHierarchyService.getLevels();
    return { levels };
  }

  @Post('levels')
  async createLevel(@Body() createLevelDto: Omit<AddressHierarchyLevel, 'id'>) {
    const level = await this.addressHierarchyService.createLevel(createLevelDto);
    return { message: 'Level created', level };
  }

  @Get('entries/level/:levelId')
  async getEntriesByLevel(@Param('levelId') levelId: string) {
    const entries = await this.addressHierarchyService.getEntriesByLevel(levelId);
    return { entries, levelId };
  }

  @Get('entries/:parentId/children')
  async getChildEntries(@Param('parentId') parentId: string) {
    const children = await this.addressHierarchyService.getChildEntries(parentId);
    return { children, parentId };
  }

  @Get('entries/search')
  async searchEntries(@Query('q') query: string, @Query('level') levelId?: string) {
    const entries = await this.addressHierarchyService.searchEntries(query, levelId);
    return { entries, query, levelId };
  }

  @Get('entries/:id/hierarchy')
  async getFullHierarchy(@Param('id') entryId: string) {
    const hierarchy = await this.addressHierarchyService.getFullHierarchy(entryId);
    return { hierarchy, entryId };
  }

  @Post('entries')
  async createEntry(@Body() createEntryDto: Omit<AddressHierarchyEntry, 'id'>) {
    const entry = await this.addressHierarchyService.createEntry(createEntryDto);
    return { message: 'Entry created', entry };
  }

  @Get('template')
  async getAddressTemplate() {
    const template = await this.addressHierarchyService.getAddressTemplate();
    return { template };
  }

  @Post('addresses')
  async createPersonAddress(@Body() createAddressDto: Omit<PersonAddress, 'id' | 'createdAt'>) {
    const address = await this.addressHierarchyService.createPersonAddress(createAddressDto);
    return { message: 'Address created', address };
  }

  @Get('addresses/person/:personId')
  async getPersonAddresses(@Param('personId') personId: string) {
    const addresses = await this.addressHierarchyService.getPersonAddresses(personId);
    return { addresses, personId };
  }

  @Put('addresses/:id')
  async updatePersonAddress(@Param('id') id: string, @Body() updateData: Partial<PersonAddress>) {
    const address = await this.addressHierarchyService.updatePersonAddress(id, updateData);
    return { message: 'Address updated', address };
  }

  @Post('addresses/validate')
  async validateAddress(@Body() address: Partial<PersonAddress>) {
    const validation = await this.addressHierarchyService.validateAddress(address);
    return { validation };
  }
}