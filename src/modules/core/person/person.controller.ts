import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Inject,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PersonService } from "./services/person.service";
import { Person } from "./models/person.model";

@ApiTags("Person")
@Controller({ path: "person", version: "1" })
export class PersonController {
  constructor(
    @Inject("personService") private readonly personService: PersonService
  ) {}

  @Post()
  async createPerson(
    @Body() createPersonDto: Omit<Person, "id" | "createdAt" | "updatedAt">
  ) {
    const person = await this.personService.createPerson(createPersonDto);
    return person;
  }

  @Get(":id/addresses")
  async getPersonAddresses(@Param("id") personId: string) {
    const addresses = await this.personService.getPersonAddresses(personId);
    return { addresses, personId };
  }

  @Post(":id/addresses")
  async addPersonAddress(
    @Param("id") personId: string,
    @Body() addressData: any
  ) {
    const address = await this.personService.addPersonAddress(
      personId,
      addressData
    );
    return address;
  }

  @Get(":id/attributes")
  async getPersonAttributes(@Param("id") personId: string) {
    const attributes = await this.personService.getPersonAttributes(personId);
    return { attributes, personId };
  }

  @Post(":id/attributes")
  async addAttribute(
    @Param("id") personId: string,
    @Body() data: { attributeTypeId: string; value: string }
  ) {
    const attribute = await this.personService.addAttribute(
      personId,
      data.attributeTypeId,
      data.value
    );
    return attribute;
  }

  @Get()
  async listPersons() {
    const persons = await this.personService.listPersons();
    return { persons };
  }

  @Get(":id")
  async getPerson(@Param("id") id: string) {
    const person = await this.personService.getPerson(id);
    return { person };
  }

  @Put(":id")
  async updatePerson(
    @Param("id") id: string,
    @Body() updateData: Partial<Person>
  ) {
    const person = await this.personService.updatePerson(id, updateData);
    return person;
  }

  @Delete(":id")
  async deletePerson(@Param("id") id: string) {
    const deleted = await this.personService.deletePerson(id);
    return deleted;
  }
}
