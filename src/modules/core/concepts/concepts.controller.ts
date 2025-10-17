import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';


class CreateConceptDto {
  name: string;
  datatype: string;
  conceptClass: string;
  description?: string;
  units?: string;
}

class UpdateConceptDto {
  name?: string;
  datatype?: string;
  conceptClass?: string;
  description?: string;
  units?: string;
}

@ApiTags('Concepts')
@Controller('api/concepts')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class ConceptsController {
  @Post()
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Create concept' })
  @ApiResponse({ status: 201, description: 'Concept created' })
  @ApiBody({ type: CreateConceptDto })
  create(@Body() createDto: CreateConceptDto) {
    return { message: 'Concept created', data: createDto };
  }

  @Get()
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Get all concepts' })
  @ApiResponse({ status: 200, description: 'List of concepts' })
  findAll() {
    return { message: 'Concepts API', data: [] };
  }

  @Get(':id')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Get concept by ID' })
  findOne(@Param('id') id: string) {
    return { message: `Concept ${id}`, data: null };
  }

  @Patch(':id')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Update concept' })
  @ApiBody({ type: UpdateConceptDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateConceptDto) {
    return { message: `Concept ${id} updated`, data: updateDto };
  }

  @Delete(':id')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Delete concept' })
  remove(@Param('id') id: string) {
    return { message: `Concept ${id} deleted` };
  }
}