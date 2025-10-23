import { Controller, Get, Post, Body, Param, Put } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LocationService } from "./services/locations.service";
import { CreateDepartmentDto } from "./dto/create-facility.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { Inject } from "@nestjs/common";

@ApiTags("Departments")
@Controller("departments")
export class DepartmentsController {
  constructor(@Inject('locationService') private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: "Create a new department" })
  @ApiResponse({ status: 201, description: "Department created successfully" })
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return await this.locationService.createDepartment(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all departments" })
  @ApiResponse({ status: 200, description: "List of all departments" })
  async getAllDepartments() {
    return await this.locationService.getAllDepartments();
  }

  @Get("facility/:facilityId")
  @ApiOperation({ summary: "Get departments by facility" })
  @ApiResponse({ status: 200, description: "List of departments" })
  async getDepartmentsByFacility(@Param("facilityId") facilityId: string) {
    return await this.locationService.getFacilityDepartments(facilityId);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update department" })
  @ApiResponse({ status: 200, description: "Department updated successfully" })
  async updateDepartment(@Param("id") id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return await this.locationService.updateDepartment(id, updateDepartmentDto);
  }
}
