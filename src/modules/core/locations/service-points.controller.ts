import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Inject,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LocationService } from "./services/locations.service";
import { CreateServicePointDto } from "./dto/create-facility.dto";
import { UpdateServicePointDto } from "./dto/update-department.dto";

@ApiTags("Service Points")
@Controller("api/service-points")
export class ServicePointsController {
  constructor(
    @Inject("locationService") private readonly locationService: LocationService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new service point" })
  @ApiResponse({
    status: 201,
    description: "Service point created successfully",
  })
  async createServicePoint(
    @Body() createServicePointDto: CreateServicePointDto
  ) {
    return await this.locationService.createServicePoint(createServicePointDto);
  }

  @Get("location/:locationId")
  @ApiOperation({ summary: "Get service points by location" })
  @ApiResponse({ status: 200, description: "List of service points" })
  async getServicePointsByLocation(@Param("locationId") locationId: string) {
    return await this.locationService.getLocationServicePoints(locationId);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update service point" })
  @ApiResponse({
    status: 200,
    description: "Service point updated successfully",
  })
  async updateServicePoint(
    @Param("id") id: string,
    @Body() updateServicePointDto: UpdateServicePointDto
  ) {
    return await this.locationService.updateServicePoint(
      id,
      updateServicePointDto
    );
  }

  @Post(":id/services/:serviceId")
  @ApiOperation({ summary: "Add service to service point" })
  @ApiResponse({
    status: 201,
    description: "Service added to service point successfully",
  })
  async addServiceToServicePoint(
    @Param("id") servicePointId: string,
    @Param("serviceId") serviceId: string
  ) {
    return await this.locationService.addServiceToServicePoint(
      servicePointId,
      serviceId
    );
  }

  @Delete(":id/services/:serviceId")
  @ApiOperation({ summary: "Remove service from service point" })
  @ApiResponse({
    status: 200,
    description: "Service removed from service point successfully",
  })
  async removeServiceFromServicePoint(
    @Param("id") servicePointId: string,
    @Param("serviceId") serviceId: string
  ) {
    return await this.locationService.removeServiceFromServicePoint(
      servicePointId,
      serviceId
    );
  }

  @Get(":id/services")
  @ApiOperation({ summary: "Get services for service point" })
  @ApiResponse({
    status: 200,
    description: "List of services for service point",
  })
  async getServicePointServices(@Param("id") servicePointId: string) {
    return await this.locationService.getServicePointServices(servicePointId);
  }
}
