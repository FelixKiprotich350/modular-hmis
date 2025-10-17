import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateLaboratorDto {
  name: string;
  description?: string;
}

class UpdateLaboratorDto {
  name?: string;
  description?: string;
}

@ApiTags('Laboratory')
@Controller('api/laboratory')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class LaboratoryController {
  @Post()
  @Privileges('create_lab_orders')
  @ApiOperation({ summary: 'Create laboratory order' })
  @ApiResponse({ status: 201, description: 'Laboratory order created' })
  @ApiBody({ type: CreateLaboratorDto })
  create(@Body() createDto: CreateLaboratorDto) {
    return { message: 'Laboratory created', data: createDto };
  }

  @Get()
  @Privileges('view_lab_results')
  @ApiOperation({ summary: 'Get all laboratory' })
  @ApiResponse({ status: 200, description: 'List of laboratory' })
  findAll() {
    return { message: 'Laboratory API', data: [] };
  }

  @Get(':id')
  @Privileges('view_lab_results')
  @ApiOperation({ summary: 'Get laboratory by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Laboratory ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('create_lab_orders')
  @ApiOperation({ summary: 'Update laboratory order' })
  @ApiBody({ type: UpdateLaboratorDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateLaboratorDto) {
    return { message: `Laboratory ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('create_lab_orders')
  @ApiOperation({ summary: 'Delete laboratory order' })
  remove(@Param('id') id: string) {
    return { message: `Laboratory ${id} deleted` };
  }
}