import { Controller, Get, Post, Body, Param, Put, Delete, Query, Inject } from '@nestjs/common';
import { FormService } from './services/form.service';
import { Form } from './models/form.model';

@Controller('api/forms')
export class FormController {
  constructor(@Inject('formService') private readonly formService: FormService) {}

  @Post()
  async createForm(@Body() createFormDto: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>) {
    const form = await this.formService.createForm(createFormDto);
    return { message: 'Form created', form };
  }

  @Get('search')
  async searchForms(@Query('q') query: string) {
    const forms = await this.formService.searchForms(query);
    return { forms, query };
  }

  @Get('by-encounter/:encounterType')
  async getFormsByEncounterType(@Param('encounterType') encounterType: string) {
    const forms = await this.formService.getFormsByEncounterType(encounterType);
    return { forms, encounterType };
  }

  @Get(':id/structure')
  async getFormStructure(@Param('id') formId: string) {
    const structure = await this.formService.getFormStructure(formId);
    return { structure };
  }

  @Get(':id/fields')
  async getFormFields(@Param('id') formId: string) {
    const fields = await this.formService.getFormFields(formId);
    return { fields, formId };
  }

  @Post(':id/fields')
  async addField(@Param('id') formId: string, @Body() data: { conceptId: string; fieldNumber: number; required?: boolean }) {
    const field = await this.formService.addFieldToForm(formId, data.conceptId, data.fieldNumber, data.required);
    return { message: 'Field added', field };
  }

  @Delete(':id/fields/:fieldId')
  async removeField(@Param('id') formId: string, @Param('fieldId') fieldId: string) {
    const removed = await this.formService.removeFieldFromForm(formId, fieldId);
    return { message: 'Field removed', removed };
  }

  @Put(':id/publish')
  async publishForm(@Param('id') formId: string) {
    const form = await this.formService.publishForm(formId);
    return { message: 'Form published', form };
  }

  @Get()
  async listForms() {
    const forms = await this.formService.listForms();
    return { forms };
  }

  @Get(':id')
  async getForm(@Param('id') id: string) {
    const form = await this.formService.getForm(id);
    return { form };
  }

  @Put(':id')
  async updateForm(@Param('id') id: string, @Body() updateData: Partial<Form>) {
    const form = await this.formService.updateForm(id, updateData);
    return { message: 'Form updated', form };
  }

  @Delete(':id')
  async deleteForm(@Param('id') id: string) {
    const deleted = await this.formService.deleteForm(id);
    return { message: 'Form deleted', deleted };
  }
}