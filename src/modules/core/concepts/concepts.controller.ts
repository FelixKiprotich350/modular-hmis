import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { PrivilegeGuard } from '../../../core/guards/privilege.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { ConceptService } from './services/concepts.service';
import { Concept } from './models/concept.model';

class CreateConceptDto {
  name: string;
  datatype: 'Text' | 'Numeric' | 'Coded' | 'Date' | 'Boolean' | 'Complex';
  conceptClass?: string;
  description?: string;
  units?: string;
  retired?: boolean;
}

class UpdateConceptDto {
  name?: string;
  datatype?: 'Text' | 'Numeric' | 'Coded' | 'Date' | 'Boolean' | 'Complex';
  conceptClass?: string;
  description?: string;
  units?: string;
  retired?: boolean;
}

@ApiTags('Concepts')
@Controller('api/concepts')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class ConceptsController {
  constructor(@Inject('conceptsService') private readonly conceptsService: ConceptService) {}

  @Post()
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Create concept' })
  @ApiResponse({ status: 201, description: 'Concept created' })
  @ApiBody({ type: CreateConceptDto })
  async create(@Body() createDto: CreateConceptDto) {
    const concept = await this.conceptsService.createConcept({ ...createDto, retired: false });
    return { message: 'Concept created', concept };
  }

  @Get('search')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Search concepts' })
  async search(@Query('q') query: string, @Query('datatype') datatype?: string) {
    const concepts = await this.conceptsService.searchConcepts(query, datatype);
    return { concepts, query };
  }

  @Get('by-class/:class')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Get concepts by class' })
  async getByClass(@Param('class') conceptClass: string) {
    const concepts = await this.conceptsService.getConceptsByClass(conceptClass);
    return { concepts, conceptClass };
  }

  @Get('by-datatype/:datatype')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Get concepts by datatype' })
  async getByDatatype(@Param('datatype') datatype: string) {
    const concepts = await this.conceptsService.getConceptsByDatatype(datatype);
    return { concepts, datatype };
  }

  @Get(':id/answers')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Get concept answers' })
  async getAnswers(@Param('id') conceptId: string) {
    const answers = await this.conceptsService.getConceptAnswers(conceptId);
    return { answers, conceptId };
  }

  @Post(':id/answers')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Add concept answer' })
  async addAnswer(@Param('id') conceptId: string, @Body() data: { answerConceptId: string; sortWeight?: number }) {
    const answer = await this.conceptsService.addConceptAnswer(conceptId, data.answerConceptId, data.sortWeight);
    return { message: 'Answer added', answer };
  }

  @Get()
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Get all concepts' })
  @ApiResponse({ status: 200, description: 'List of concepts' })
  async findAll() {
    const concepts = await this.conceptsService.listConcepts();
    return { concepts };
  }

  @Get(':id')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Get concept by ID' })
  async findOne(@Param('id') id: string) {
    const concept = await this.conceptsService.getConcept(id);
    return { concept };
  }

  @Patch(':id')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Update concept' })
  @ApiBody({ type: UpdateConceptDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateConceptDto) {
    const concept = await this.conceptsService.updateConcept(id, updateDto);
    return { message: 'Concept updated', concept };
  }

  @Delete(':id')
  @Privileges('manage_concepts')
  @ApiOperation({ summary: 'Delete concept' })
  async remove(@Param('id') id: string) {
    const deleted = await this.conceptsService.deleteConcept(id);
    return { message: 'Concept deleted', deleted };
  }
}