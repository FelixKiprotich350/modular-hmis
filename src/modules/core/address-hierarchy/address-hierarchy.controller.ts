import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { AddressHierarchyService } from './services/address-hierarchy.service';
import { AddressHierarchyLevel, AddressHierarchyEntry, PersonAddress } from './models/address-hierarchy.model';

@Controller('api/address-hierarchy')
export class AddressHierarchyController {
  constructor(private readonly addressService: AddressHierarchyService) {}

  @Get('levels')
  async getLevels() {
    const levels = await this.addressService.getLevels();
    return { levels };
  }

  @Post('levels')
  async createLevel(@Body() createLevelDto: Omit<AddressHierarchyLevel, 'id'>) {
    const level = await this.addressService.createLevel(createLevelDto);
    return { message: 'Level created', level };
  }

  @Get('entries/level/:levelId')
  async getEntriesByLevel(@Param('levelId') levelId: string) {
    const entries = await this.addressService.getEntriesByLevel(levelId);
    return { entries, levelId };
  }

  @Get('entries/:parentId/children')
  async getChildEntries(@Param('parentId') parentId: string) {
    const children = await this.addressService.getChildEntries(parentId);
    return { children, parentId };
  }

  @Get('entries/search')
  async searchEntries(@Query('q') query: string, @Query('level') levelId?: string) {
    const entries = await this.addressService.searchEntries(query, levelId);
    return { entries, query, levelId };
  }

  @Get('entries/:id/hierarchy')
  async getFullHierarchy(@Param('id') entryId: string) {
    const hierarchy = await this.addressService.getFullHierarchy(entryId);
    return { hierarchy, entryId };
  }

  @Post('entries')
  async createEntry(@Body() createEntryDto: Omit<AddressHierarchyEntry, 'id'>) {
    const entry = await this.addressService.createEntry(createEntryDto);
    return { message: 'Entry created', entry };
  }

  @Get('template')
  async getAddressTemplate() {
    const template = await this.addressService.getAddressTemplate();
    return { template };
  }

  @Post('addresses')
  async createPersonAddress(@Body() createAddressDto: Omit<PersonAddress, 'id' | 'createdAt'>) {
    const address = await this.addressService.createPersonAddress(createAddressDto);
    return { message: 'Address created', address };
  }

  @Get('addresses/person/:personId')
  async getPersonAddresses(@Param('personId') personId: string) {
    const addresses = await this.addressService.getPersonAddresses(personId);
    return { addresses, personId };
  }

  @Put('addresses/:id')
  async updatePersonAddress(@Param('id') id: string, @Body() updateData: Partial<PersonAddress>) {
    const address = await this.addressService.updatePersonAddress(id, updateData);
    return { message: 'Address updated', address };
  }

  @Post('addresses/validate')
  async validateAddress(@Body() address: Partial<PersonAddress>) {
    const validation = await this.addressService.validateAddress(address);
    return { validation };
  }
}