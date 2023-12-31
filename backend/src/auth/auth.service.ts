import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  HttpException, HttpStatus 
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DtoSignin, DtoStudent } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt/dist';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  // async signUp(school_id: number, dto: CreateUserDto) {
  //   const hash = await argon.hash(dto.password);
  //   const findUser = await this.prismaService.user.findUnique({
  //     where: {
  //       email: dto.email,
  //     },
  //   });
  //   if (findUser) {
  //     throw new NotAcceptableException('user already exist');
  //   }
  //   const addUser = await this.prismaService.user.create({
  //     data: {
  //       school_Id: school_id,
  //       ...dto,
  //       password: hash,
  //     },
  //   });
  //   if (addUser) {
  //     return addUser;
  //   } else {
  //     throw new ExceptionsHandler();
  //   }
  // }

  async signUpStudent(school_id: number, dto: DtoStudent) {
    const hash = await argon.hash(dto.password);
    const findUser = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (findUser) {
      throw new NotAcceptableException('user already exist');
    }
    const addUser = await this.prismaService.user.create({
      data: {
        school_Id: school_id,
        frist_name: dto.frist_name,
        middle_name: dto.middle_name,
        email: dto.email,
        last_name: dto.last_name,
        role: dto.role,
        address: dto.address,
        username: dto.username,
        phone: dto.phone,
        password: hash,
      },
    });

    if (dto.role === 'student') {
  
      const student = await this.prismaService.student.create({
        data: {
          user_Id: addUser.id,
          enrollment_date: dto.enrollment_date,
          careof_contact1: dto.careOf_contact1,
          careof_contact2: dto.careOf_contact2,
          gradeId: dto.gradeId,
        },
      });
      const quickSelect= await this.prismaService.student.findUnique({where:{user_Id:addUser.id},include:{user:true, }})
      return { msg:"student registered", data:quickSelect };
    } else if (dto.role === 'teacher') {
      const teacher = await this.prismaService.teacher.create({
        data: {
          user_Id: addUser.id,
          education_level: dto.education_level,
        },
      });
      return { addUser, teacher };
    }

    if (addUser) {
      return addUser;
    } else {
      throw new ExceptionsHandler();
    }
  }

  async signIn(dto: DtoSignin) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Username or password Incorrect!');
      
      // return {
      //   statusCode: HttpStatus.FORBIDDEN,
      //   message: 'Username or password incorrect. Please try again.',
      // };
    }

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Username or password Incorrect!');
    }
    const token = await this.signToken(user.email, user.id, user.role);
    
    return this.signToken(user.email, user.id, user.role);
  }

  async signToken(
    email: string,
    id: number,
    role: string,
  ): Promise<{ token_access: string , user:string}> {
    const payLoad = {
      sub: id,
      email,
      role,
    };

    const user={
      id,email,role
    }
    const hide = this.config.get('JWT_SECRET');

    //  ,{
    //   expiresIn:"15m",
    //   secret:hide
    //  }

    const token = await this.jwt.signAsync(payLoad, {
      expiresIn: '40m',
      secret: hide,
    });

    return {
      token_access: token,
      user:email

    };
  }

 
}
