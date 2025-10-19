import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { MetadataSharingService } from './services/metadata-sharing.service';
import { MetadataPackage, MetadataSharing } from './models/metadata.model';

@Controller('api/metadata-sharing')
export class MetadataSharingController {
  constructor(private readonly metadataService: MetadataSharingService) {}

  @Get('types')
  async getMetadataTypes() {
    const types = await this.metadataService.getMetadataTypes();
    return { types };
  }

  @Post('export')
  async exportMetadata(@Body() data: { types: string[]; includeRetired?: boolean }) {
    const exportData = await this.metadataService.exportMetadata(data.types, data.includeRetired);
    return { exportData };
  }

  @Post('packages')
  async createPackage(@Body() createPackageDto: Omit<MetadataPackage, 'id' | 'dateCreated'>) {
    const package = await this.metadataService.createPackage(createPackageDto);
    return { message: 'Package created', package };
  }

  @Put('packages/:id/publish')
  async publishPackage(@Param('id') packageId: string) {
    const package = await this.metadataService.publishPackage(packageId);
    return { message: 'Package published', package };
  }

  @Post('import')
  async importPackage(@Body() data: { packageData: any; userId: string }) {
    const validation = await this.metadataService.validatePackage(data.packageData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }
    
    const importResult = await this.metadataService.importPackage(data.packageData, data.userId);
    return { message: 'Package imported', importResult };
  }

  @Post('validate')
  async validatePackage(@Body() data: { packageData: any }) {
    const validation = await this.metadataService.validatePackage(data.packageData);
    return { validation };
  }

  @Get('import-history')
  async getImportHistory() {
    const history = await this.metadataService.getImportHistory();
    return { history };
  }

  @Post('sharing-config')
  async createSharingConfig(@Body() configDto: Omit<MetadataSharing, 'id' | 'createdAt'>) {
    const config = await this.metadataService.createSharingConfiguration(configDto);
    return { message: 'Sharing configuration created', config };
  }

  @Get('sharing-config')
  async getSharingConfigurations() {
    const configurations = await this.metadataService.getSharingConfigurations();
    return { configurations };
  }

  @Post('sync/:configId')
  async syncWithRemote(@Param('configId') configId: string) {
    const result = await this.metadataService.syncWithRemote(configId);
    return { result };
  }

  @Get('packages')
  async listPackages() {
    const packages = await this.metadataService.listPackages();
    return { packages };
  }

  @Get('packages/available')
  async getAvailablePackages() {
    const packages = await this.metadataService.getAvailablePackages();
    return { packages };
  }

  @Get('packages/:id')
  async getPackage(@Param('id') id: string) {
    const package = await this.metadataService.getPackage(id);
    return { package };
  }

  @Put('packages/:id')
  async updatePackage(@Param('id') id: string, @Body() updateData: Partial<MetadataPackage>) {
    const package = await this.metadataService.updatePackage(id, updateData);
    return { message: 'Package updated', package };
  }

  @Delete('packages/:id')
  async deletePackage(@Param('id') id: string) {
    const deleted = await this.metadataService.deletePackage(id);
    return { message: 'Package deleted', deleted };
  }
}