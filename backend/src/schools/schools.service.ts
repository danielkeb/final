import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DtoSchool } from './dto';

@Injectable()
export class SchoolsService {
  constructor(private prisamService: PrismaService) {}
  async schoolRegistered(dto: DtoSchool) {
    const school = await this.prisamService.school.create({
      data: {
        ...dto,
      },
    });
    return school;
  }
  async schoolUpdate(id: number, dto: DtoSchool) {
    const school = await this.prisamService.school.findUnique({
      where: { id: id },
    });

    const updateSchool = await this.prisamService.school.update({
      where: { id: id },
      data: {
        ...dto,
      },
    });
    return { updateSchool, school };
  }
}
