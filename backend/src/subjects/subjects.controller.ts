import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { AddSubjectsDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { UpdateSubjectDto } from './dto/update.subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private subjectsService: SubjectsService) {}

  @Post('add/:id')
  addSubjects(
    @Body() dto: AddSubjectsDto,
    @Param('id', ParseIntPipe) teacherId: number,
  ) {
    return this.subjectsService.addSubjects(dto, teacherId);
  }

  @Patch('update/:id')
  updateSubjects(
    @Body() dto: UpdateSubjectDto,
    @Param('id', ParseIntPipe) subId: number,
  ) {
    return this.subjectsService.updateSubjects(dto, subId);
  }
}
