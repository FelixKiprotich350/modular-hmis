import { Controller, Get, Post, Body, Param, Put, Delete, Query, Inject } from '@nestjs/common';
import { MetadataSharingService } from './services/metadata-sharing.service';
import { MetadataPackage, MetadataSharing } from './models/metadata.model';

@Controller({ path: 'metadata-sharing', version: '1' })
export class MetadataSharingController {
  constructor(@Inject('metadataSharingService') private readonly metadataSharingService: MetadataSharingService) {}

  @Get('types')
  async getMetadataTypes() {
    const types = await this.metadataSharingService.getMetadataTypes();
    return { types };
  }

  @Post('export')
  async exportMetadata(@Body() data: { types: string[]; includeRetired?: boolean }) {
    const exportData = await this.metadataSharingService.exportMetadata(data.types, data.includeRetired);
    return { exportData };
  }

  @Post('packages')
  async createPackage(@Body() createPackageDto: Omit<MetadataPackage, 'id' | 'dateCreated'>) {
    const metadataPackage = await this.metadataSharingService.createPackage(createPackageDto);
    return { message: 'Package created', package: metadataPackage };
  }

  @Put('packages/:id/publish')
  async publishPackage(@Param('id') packageId: string) {
    const metadataPackage = await this.metadataSharingService.publishPackage(packageId);
    return { message: 'Package published', package: metadataPackage };
  }

  @Post('import')
  async importPackage(@Body() data: { packageData: any; userId: string }) {
    const validation = await this.metadataSharingService.validatePackage(data.packageData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }
    
    const importResult = await this.metadataSharingService.importPackage(data.packageData, data.userId);
    return { message: 'Package imported', importResult };
  }

  @Post('validate')
  async validatePackage(@Body() data: { packageData: any }) {
    const validation = await this.metadataSharingService.validatePackage(data.packageData);
    return { validation };
  }

  @Get('import-history')
  async getImportHistory() {
    const history = await this.metadataSharingService.getImportHistory();
    return { history };
  }

  @Post('sharing-config')
  async createSharingConfig(@Body() configDto: Omit<MetadataSharing, 'id' | 'createdAt'>) {
    const config = await this.metadataSharingService.createSharingConfiguration(configDto);
    return { message: 'Sharing configuration created', config };
  }

  @Get('sharing-config')
  async getSharingConfigurations() {
    const configurations = await this.metadataSharingService.getSharingConfigurations();
    return { configurations };
  }

  @Post('sync/:configId')
  async syncWithRemote(@Param('configId') configId: string) {
    const result = await this.metadataSharingService.syncWithRemote(configId);
    return { result };
  }

  @Get('packages')
  async listPackages() {
    const packages = await this.metadataSharingService.listPackages();
    return { packages };
  }

  @Get('packages/available')
  async getAvailablePackages() {
    const packages = await this.metadataSharingService.getAvailablePackages();
    return { packages };
  }

  @Get('packages/:id')
  async getPackage(@Param('id') id: string) {
    const metadataPackage = await this.metadataSharingService.getPackage(id);
    return { package: metadataPackage };
  }

  @Put('packages/:id')
  async updatePackage(@Param('id') id: string, @Body() updateData: Partial<MetadataPackage>) {
    const metadataPackage = await this.metadataSharingService.updatePackage(id, updateData);
    return { message: 'Package updated', package: metadataPackage };
  }

  @Delete('packages/:id')
  async deletePackage(@Param('id') id: string) {
    const deleted = await this.metadataSharingService.deletePackage(id);
    return { message: 'Package deleted', deleted };
  }
}