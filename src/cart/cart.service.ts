import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
  create() {
    return this.prisma.cart.create({
      data: {},
    });
  }
  async findOne(id: string) {
    let cart;
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      cart = await this.prisma.cart.findUnique({
        where: {
          id: id,
        },
        include: {
          CartItem: {
            include: {
              product: true,
            },
          },
        },
      });
    } else {
      cart = await this.prisma.cart.findUnique({
        where: {
          userId: user.id,
        },
        include: {
          CartItem: {
            include: {
              product: true,
            },
          },
        },
      });
    }
    if (!cart) {
      return await this.prisma.cart.create({
        data: {
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
    return cart;
  }
  async addProductToCart(cartId: string, productId: string) {
    //check if cart exists
    const cart = await this.prisma.cart.findUnique({
      where: {
        id: cartId,
      },
    });
    if (!cart) {
      await this.prisma.cart.create({
        data: {
          id: cartId,
        },
      });
    }
    //check if product is already in cart
    const check = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });
    if (check) {
      throw new ForbiddenException('Product already in cart');
    }

    return this.prisma.cartItem.create({
      data: {
        cart: {
          connect: {
            id: cartId,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
      },
      include: {
        product: true,
      },
    });
  }

  async removeProductFromCart(cartId: string, itemId: string) {
    const id = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: itemId,
      },
      select: {
        id: true,
      },
    });
    console.log(id);
    if (!id) {
      throw new ForbiddenException('Product not in cart');
    }

    return this.prisma.cartItem.delete({
      where: {
        id: id.id,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
