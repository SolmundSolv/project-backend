import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Post,
  Query,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('create-payment-intent')
  createPaymentIntent(
    @Body() body: { cartId: string; days: number; orderId: string },
  ) {
    return this.stripeService.createPaymentIntent(
      body.cartId,
      body.days,
      body.orderId,
    );
  }

  @Post('confirm')
  async confirmPayment(
    @Body()
    body: {
      payment_intent: string;
      payment_intent_client_secret: string;
    },
  ) {
    return this.stripeService.confirmPayment(
      body.payment_intent,
      body.payment_intent_client_secret,
    );
    // Use the orderId to retrieve the associated order from your database and display the confirmation page
  }
  @Post('webhook')
  webhook(
    @Req() body: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const raw = body.rawBody;
    return this.stripeService.webhook(raw, sig);
  }

  @Post('payment-sheet')
  paymentSheet(@Body() body: { cartId: string; days: number }) {
    return this.stripeService.paymentSheet(body.cartId, body.days);
  }
}
