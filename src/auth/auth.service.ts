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
          name: user.name,
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
      const createCustomer = await this.prisma.customer.create({
        data: {
          name: user.name,
          User: {
            connect: {
              id: newUser.id,
            },
          },
          adress: {
            create: {
              street: '',
              city: '',
              zip: '',
              building: '',
            },
          },
        },
      });

      const token = await this.signToken(
        newUser.id,
        newUser.email,
        newUser.name,
        newUser.role?.name,
      );
      return token;
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
    //find if user has active session
    const activeSession = await this.prisma.session.findFirst({
      where: {
        userId: foundUser.id,
      },
    });
    if (activeSession) {
      this.prisma.session.delete({
        where: {
          id: activeSession.id,
        },
      });
    }
    //compare password
    const isValid = await argon.verify(foundUser.password, user.password);
    if (!isValid) throw new ForbiddenException('Invalid password');
    //generate token
    //return status 200 and token

    const token = await this.signToken(
      foundUser.id,
      foundUser.email,
      foundUser.name,
      foundUser.role?.name,
    );
    return token;
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
    //create session in db
    await this.prisma.session.create({
      data: {
        sessionToken: token,
        userId,
        expires: new Date(Date.now() + 86400000),
      },
    });
    console.log(token);
    return { access_token: token };
  }

  async validateToken(token: string) {
    const payload = await this.jwt.verifyAsync(token, {
      secret: this.config.get('JWT_SECRET'),
    });
    return payload;
  }

  async logout(token: string) {
    await this.prisma.session.delete({
      where: {
        sessionToken: token,
      },
    });
  }

  async checkPassword(password: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('User not found');
    const isValid = await argon.verify(user.password, password);
    if (!isValid) throw new ForbiddenException('Invalid password');
    return user;
  }
  async changePassword(password: string, id: string) {
    const hash = await argon.hash(password);

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hash,
      },
    });
    return user;
  }
}
