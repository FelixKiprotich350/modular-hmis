import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LocationService } from "./services/locations.service";
import { CreateLocationDto } from "./dto/create-facility.dto";

@ApiTags("Locations")
@Controller("api/locations")
export class LocationsController {
  constructor(
    @Inject("locationService") private readonly locationService: LocationService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new location" })
  @ApiResponse({ status: 201, description: "Location created successfully" })
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.createLocation(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all locations" })
  @ApiResponse({ status: 200, description: "List of locations" })
  async getLocations() {
    return await this.locationService.listLocations();
  }

  @Get("search")
  @ApiOperation({ summary: "Search locations" })
  @ApiResponse({ status: 200, description: "Search results" })
  async searchLocations(@Query("q") query: string) {
    return await this.locationService.searchLocations(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get location by ID" })
  @ApiResponse({ status: 200, description: "Location details" })
  async getLocation(@Param("id") id: string) {
    return await this.locationService.getLocation(id);
  }

  @Get(":id/hierarchy")
  @ApiOperation({ summary: "Get location hierarchy" })
  @ApiResponse({ status: 200, description: "Location hierarchy" })
  async getLocationHierarchy(@Param("id") id: string) {
    return await this.locationService.getLocationHierarchy(id);
  }

  @Get(":id/children")
  @ApiOperation({ summary: "Get child locations" })
  @ApiResponse({ status: 200, description: "Child locations" })
  async getChildLocations(@Param("id") parentId: string) {
    return await this.locationService.getChildLocations(parentId);
  }

  @Get(":id/service-points")
  @ApiOperation({ summary: "Get location service points" })
  @ApiResponse({ status: 200, description: "List of service points" })
  async getLocationServicePoints(@Param("id") locationId: string) {
    return await this.locationService.getLocationServicePoints(locationId);
  }
}
