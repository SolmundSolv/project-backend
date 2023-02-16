import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
  create(createCartDto: CreateCartDto) {
    return this.prisma.cart.create({
      data: {},
    });
  }
  findOne(id: string) {
    return this.prisma.cart.findUnique({
      where: {
        id: id,
      },
      include: {
        CartItem: {
          where: {
            cartId: id,
          },
          include: {
            product: true,
          },
        },
      },
    });
  }
  async addProductToCart(cartId: string, productId: string) {
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
