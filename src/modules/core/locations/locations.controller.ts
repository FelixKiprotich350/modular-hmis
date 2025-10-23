import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Inject,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import { LocationService } from "./services/locations.service";
import { Location } from "./models/location.model";
import { CreateFacilityDto, CreateDepartmentDto, CreateLocationDto, CreateServicePointDto } from "./dto/create-facility.dto";

@ApiTags("Locations")
@Controller({ path: "locations", version: "1" })
export class LocationsController {
  constructor(
    @Inject("locationService")
    private readonly locationsService: LocationService
  ) {}

  // Facility Management
  @Post("facilities")
  @ApiOperation({ summary: "Create facility" })
  @ApiBody({ type: CreateFacilityDto })
  async createFacility(@Body() createDto: CreateFacilityDto) {
    const facility = await this.locationsService.createFacility(createDto);
    return facility;
  }

  @Get("facilities")
  @ApiOperation({ summary: "List all facilities" })
  async listFacilities() {
    const facilities = await this.locationsService.listFacilities();
    return facilities;
  }

  @Get("facilities/:id")
  @ApiOperation({ summary: "Get facility by ID" })
  async getFacility(@Param("id") id: string) {
    const facility = await this.locationsService.getFacility(id);
    return facility;
  }

  // Department Management
  @Post("departments")
  @ApiOperation({ summary: "Create department" })
  @ApiBody({ type: CreateDepartmentDto })
  async createDepartment(@Body() createDto: CreateDepartmentDto) {
    const department = await this.locationsService.createDepartment(createDto);
    return department;
  }

  @Get("facilities/:facilityId/departments")
  @ApiOperation({ summary: "Get facility departments" })
  async getFacilityDepartments(@Param("facilityId") facilityId: string) {
    const departments = await this.locationsService.getFacilityDepartments(facilityId);
    return departments;
  }

  // Service Point Management
  @Post("service-points")
  @ApiOperation({ summary: "Create service point" })
  @ApiBody({ type: CreateServicePointDto })
  async createServicePoint(@Body() createDto: CreateServicePointDto) {
    const servicePoint = await this.locationsService.createServicePoint(createDto);
    return servicePoint;
  }

  @Get("locations/:locationId/service-points")
  @ApiOperation({ summary: "Get location service points" })
  async getLocationServicePoints(@Param("locationId") locationId: string) {
    const servicePoints = await this.locationsService.getLocationServicePoints(locationId);
    return servicePoints;
  }

  @Get("facilities/:facilityId/locations")
  @ApiOperation({ summary: "Get facility locations" })
  async getFacilityLocations(@Param("facilityId") facilityId: string) {
    const locations = await this.locationsService.getFacilityLocations(facilityId);
    return locations;
  }

  @Post()
  @ApiOperation({ summary: "Create location" })
  @ApiBody({ type: CreateLocationDto })
  async createLocation(@Body() createDto: CreateLocationDto) {
    const location = await this.locationsService.createLocation(createDto);
    return location;
  }

  @Get("search")
  async searchLocations(@Query("q") query: string) {
    const locations = await this.locationsService.searchLocations(query);
    return { locations, query };
  }

  @Get("tags")
  async getLocationTags() {
    const tags = await this.locationsService.getLocationTags();
    return { tags };
  }

  @Get("by-tag/:tagId")
  async getLocationsByTag(@Param("tagId") tagId: string) {
    const locations = await this.locationsService.getLocationsByTag(tagId);
    return { locations, tagId };
  }

  @Get(":id/hierarchy")
  async getLocationHierarchy(@Param("id") id: string) {
    const hierarchy = await this.locationsService.getLocationHierarchy(id);
    return id;
  }

  @Get(":id/children")
  async getChildLocations(@Param("id") parentId: string) {
    const children = await this.locationsService.getChildLocations(parentId);
    return { children, parentId };
  }

  @Get(":id/attributes")
  async getLocationAttributes(@Param("id") locationId: string) {
    const attributes = await this.locationsService.getLocationAttributes(
      locationId
    );
    return { attributes, locationId };
  }

  @Post(":id/attributes")
  async addLocationAttribute(
    @Param("id") locationId: string,
    @Body() data: { attributeTypeId: string; value: string }
  ) {
    const attribute = await this.locationsService.addLocationAttribute(
      locationId,
      data.attributeTypeId,
      data.value
    );
    return attribute;
  }

  @Put(":id/retire")
  async retireLocation(
    @Param("id") locationId: string,
    @Body() data: { reason?: string }
  ) {
    const location = await this.locationsService.retireLocation(
      locationId,
      data.reason
    );
    return location;
  }

  @Get()
  async listLocations() {
    const locations = await this.locationsService.listLocations();
    return locations;
  }

  @Get(":id")
  async getLocation(@Param("id") id: string) {
    const location = await this.locationsService.getLocation(id);
    return location;
  }

  @Put(":id")
  async updateLocation(
    @Param("id") id: string,
    @Body() updateData: Partial<Location>
  ) {
    const location = await this.locationsService.updateLocation(id, updateData);
    return location;
  }

  @Delete(":id")
  async deleteLocation(@Param("id") id: string) {
    const deleted = await this.locationsService.deleteLocation(id);
    return deleted;
  }
}
