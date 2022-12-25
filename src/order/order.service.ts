import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  //done and working
  async create(createOrderDto: CreateOrderDto) {
    const products = await this.findAvailableProduct(createOrderDto.items);
    const number = await this.numberOfOrders();
    const res = await this.prisma.order.create({
      data: {
        number: number + 1,
        status: {
          connect: {
            id: 'cl9sfz1xz0003tk2se0jt74m6',
          },
        },
        price: createOrderDto.price,
        products: {
          connect: products.map((item) => {
            return {
              id: item.id,
            };
          }),
        },
        customer: {
          connect: {
            id: createOrderDto.contractor,
          },
        },
        rentDays: createOrderDto.rentDays,
      },
      include: {
        products: true,
        customer: true,
      },
    });
    this.changeProductStatus(
      products.map((item) => item.id),
      'clb3fhehx0002tk748d3ies88', //in use
    );

    return res;
  }

  async numberOfOrders() {
    return await this.prisma.order.count();
  }

  async changeProductStatus(id: string[], status: string) {
    for (let i = 0; i < id.length; i++) {
      await this.prisma.product.update({
        where: {
          id: id[i],
        },
        data: {
          productStatusId: status, //in use
        },
      });
    }
  }

  async findAvailableProduct(id: string[]) {
    let arr = [];
    for (let i = 0; i < id.length; i++) {
      const e = await this.prisma.product.findFirst({
        where: {
          modelId: id[i],
          productStatusId: 'clb3fhehx0000tk74rm7oibs7', //available
        },
        select: {
          id: true,
        },
      });
      if (!e) throw new NotFoundException('Product is not available');
      arr.push(e);
    }
    return arr;
  }

  async findOne(id: string) {
    try {
      const res = await this.prisma.order.findFirst({
        where: {
          id: id,
        },
        include: {
          products: {
            include: {
              Model: {
                include: {
                  category: true,
                },
              },
            },
          },
          status: true,
          customer: {
            include: {
              adress: true,
              User: true,
            },
          },
        },
      });
      if (!res) {
        throw new Error('Order not found');
      }
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findInProgress() {
    const res = await this.prisma.order.findMany({
      where: {
        status: {
          name: 'In Progress',
        },
      },
      select: {
        id: true,
        number: true,
        price: true,
        createdAt: true,
      },
    });

    return res;
  }

  findWaiting() {
    return this.prisma.order.findMany({
      where: {
        status: {
          name: 'Waiting',
        },
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  //get weekly orders for chart
  async getWeeklyOrders() {
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      const res = await this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000).setHours(
                0,
                0,
                0,
                0,
              ),
            ),
            lte: new Date(
              new Date(
                new Date().getTime() - (i - 1) * 24 * 60 * 60 * 1000,
              ).setHours(0, 0, 0, 0),
            ),
          },
        },
      });
      const day = new Date(
        new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000).setHours(
          0,
          0,
          0,
          0,
        ),
      ).getDay();
      days.push({ name: weekdays[day], amt: res });
    }
    return days;
  }

  async deleteProductFromOrder(orderId: string, productId: string) {
    //product price
    const productPrice = await this.prisma.model.findFirst({
      where: {
        id: productId,
      },
      select: {
        price: true,
      },
    });
    //order price
    const orderPrice = await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
      select: {
        price: true,
      },
    });
    //update order price
    const newOrderPrice =
      orderPrice.price.toNumber() - productPrice.price.toNumber();
    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        products: {
          disconnect: {
            id: productId,
          },
        },
        price: newOrderPrice,
      },
    });
  }
  async addProductsToOrder(
    orderId: string,
    productsId: { selectedProducts: { id: string }[] },
    price: { price: number },
  ) {
    //order price
    const orderPrice = await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
      select: {
        price: true,
      },
    });
    //update order price
    const newOrderPrice = orderPrice.price.toNumber() + price.price;

    let arr = [];
    for (let i = 0; i < productsId.selectedProducts.length; i++) {
      arr.push(productsId.selectedProducts[i].id);
    }

    const items = await this.findAvailableProduct(arr);
    this.changeProductStatus(
      items.map((item) => item.id),
      'clb3fhehx0002tk748d3ies88', //in useq
    );

    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        products: {
          connect: items.map((item) => {
            return {
              id: item.id,
            };
          }),
        },
        price: newOrderPrice,
      },
    });
  }

  procideOrder(orderId: string) {
    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        statusId: {
          set: 'clabhe77z0000tk4k47b0obmn', //in progress
        },
        rentStart: new Date(),
      },
    });
  }
  async cancelOrder(orderId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        Order: {
          every: {
            id: orderId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    this.changeProductStatus(
      products.map((item) => item.id),
      'clb3fhehx0000tk74rm7oibs7',
    ); //available

    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        statusId: {
          set: 'clbuzxlk10000tkkwfj6flrs7', //canceled
        },
      },
    });
  }

  async completeOrder(orderId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        Order: {
          every: {
            id: orderId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    this.changeProductStatus(
      products.map((item) => item.id),
      'clb3fhehx0000tk74rm7oibs7',
    ); //available

    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        statusId: {
          set: 'clabhe77z0002tk4kihgswbsl', //ended
        },
        rentEnd: new Date(),
      },
    });
  }
  //TODO: orderes exceded
  async findExceded() {
    const res = await this.prisma.order.findMany({
      where: {
        statusId: {
          equals: 'clabhe77z0000tk4k47b0obmn', //in progress
        },
      },
      select: {
        id: true,
        rentStart: true,
        rentDays: true,
      },
    });
    const exceded = res.filter((item) => {
      const start = new Date(item.rentStart);
      const estimatedEnd = new Date(
        start.getTime() + item.rentDays * 24 * 60 * 60 * 1000,
      );
      const now = new Date();
      return now > estimatedEnd;
    });
    return exceded;
  }
}
