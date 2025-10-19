import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PersonService } from './services/person.service';
import { Person } from './models/person.model';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  async createPerson(@Body() createPersonDto: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.personService.createPerson(createPersonDto);
  }

  @Get(':id')
  async getPerson(@Param('id') id: string) {
    return this.personService.getPerson(id);
  }

  @Post(':id/attributes')
  async addAttribute(@Param('id') personId: string, @Body() data: { attributeTypeId: string; value: string }) {
    return this.personService.addAttribute(personId, data.attributeTypeId, data.value);
  }
}