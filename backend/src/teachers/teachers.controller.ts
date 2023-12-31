import {
  Controller,
  UseGuards,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UpdateAdminTeacherDto, UpdateTeacherDto } from './dto';
import { TeachersService } from './teachers.service';

@UseGuards(JwtGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private teacherService: TeachersService) {}

  @Patch('update/:id')
  updateTeacher(@GetUser('id') userId: number, @Body() dto: UpdateTeacherDto) {
    return this.teacherService.updateTeacher(userId, dto);
  }

  @Patch('adminUpdate/:id')
  updateAdminTeacher(
    @GetUser('id') adminId: number,
    @Body() dto: UpdateAdminTeacherDto,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.teacherService.updateAdminTeacher(adminId, dto, userId);
  }
}
