import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(user: AuthDto) {
    //generate salt to hash password
    const hash = await argon.hash(user.password);
    //create user
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          password: hash,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      return this.signToken(
        newUser.id,
        newUser.email,
        newUser.name,
        newUser.role?.name,
      );
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
    }
  }
  async signin(user: AuthDto) {
    //find user
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!foundUser) {
      throw new ForbiddenException('User not found');
    }
    //compare password
    const isValid = await argon.verify(foundUser.password, user.password);
    if (!isValid) throw new ForbiddenException('Invalid password');
    //generate token
    //return status 200 and token

    return this.signToken(
      foundUser.id,
      foundUser.email,
      foundUser.name,
      foundUser.role?.name,
    );
  }

  async signToken(
    userId: string,
    email: string,
    name: string,
    roleId?: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      name,
      role: roleId,
    };
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '1d',
    });
    return { access_token: token };
  }
}
