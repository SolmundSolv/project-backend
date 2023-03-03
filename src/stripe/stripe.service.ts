import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Stripe } from 'stripe';
@Injectable()
export class StripeService {
  private stripe;
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }
  async createPaymentIntent(cartId: string, days: number, orderId: string) {
    console.log('createPaymentIntent', cartId, days, orderId);
    const cart = await this.prisma.cartItem.findMany({
      where: {
        cartId: cartId,
      },
      include: {
        product: true,
      },
    });
    const total = cart.reduce((acc, item) => {
      return acc + item.product.price;
    }, 0);

    return this.stripe.paymentIntents.create({
      amount: total * days * 100,
      currency: 'pln',
      payment_method_types: ['blik', 'card'],
      metadata: {
        orderId: orderId,
        cartId: cartId,
      },
    });
  }
  async confirmPayment(paymentIntentId: string, clientSecret: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
    );
    const orderId = paymentIntent.metadata.orderId;
    const cart = await this.prisma.productHistory.findMany({
      where: {
        orderId: orderId,
      },
      include: {
        Product: {
          include: {
            Model: true,
          },
        },
      },
    });
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    const products = cart.map((item) => {
      return {
        Model: {
          name: item.Product.Model.name,
          price: item.Product.Model.price,
          img: item.Product.Model.img,
        },
      };
    });
    const res = {
      number: order.number,
      rentDays: order.rentDays,
      createdAt: order.createdAt,
      price: order.price,
      products: products,
    };
    console.log('confirmPayment', res);
    return res;
  }
  async handlePaymentIntent(event) {
    const paymentIntentId = event.data.object.id;
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
    );
    const orderId = paymentIntent.metadata.orderId;
    const cartId = paymentIntent.metadata.cartId;
    let paymentStatus;
    switch (event.type) {
      case 'payment_intent.succeeded':
        paymentStatus = 'Paid';
        await this.prisma.cart.delete({
          where: {
            id: cartId,
          },
        });
        break;
      case 'payment_intent.canceled':
        paymentStatus = 'Cancelled';
        break;
      // Handle other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
        return;
    }

    await this.prisma.payment.update({
      where: {
        orderId: orderId,
      },
      data: {
        PaymentStatus: {
          connectOrCreate: {
            where: {
              name: paymentStatus,
            },
            create: {
              name: paymentStatus,
            },
          },
        },
      },
    });
  }

  async webhook(body: Buffer, sig: string) {
    const secret = this.config.get('STRIPE_WEBHOOK_SECRET');
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (secret) {
      // Get the signature sent by Stripe
      try {
        const event = this.stripe.webhooks.constructEvent(body, sig, secret);

        // Handle the event
        switch (event.type) {
          case 'payment_intent.canceled':
          case 'payment_intent.succeeded':
            await this.handlePaymentIntent(event);
            break;
          default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
        }
      } catch (err: any) {
        return { error: `Webhook Error: ${err.message}` };
      }

      return { received: true };
    }
  }
  async paymentSheet(cartId: string, days: number) {
    console.log('cartId,', cartId, 'days,', days);
    const customer = await this.stripe.customers.create();
    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-11-15' },
    );

    const cart = await this.prisma.cartItem.findMany({
      where: {
        cartId: cartId,
      },
      include: {
        product: true,
      },
    });
    const total = cart.reduce((acc, item) => {
      return acc + item.product.price;
    }, 0);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: total * days * 100,
      currency: 'pln',
      customer: customer.id,
      payment_method_types: ['card'],
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        'pk_test_51MejupB3Jsb0yKWKLl6QBVd44qXq41jGKc6OnDU7sE9td8TBhMI15nBfMdOfHdHSwNzUONFBUeEMHbdEfdwxtNnY00QvdhIoVf',
    };
  }
}
