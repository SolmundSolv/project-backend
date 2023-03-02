import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create() {
    return this.cartService.create();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }
  @Post(':cartId')
  addProductToCart(
    @Param('cartId') cartId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartService.addProductToCart(cartId, productId);
  }
  @Delete(':cartId/:itemId')
  removeProductFromCart(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeProductFromCart(cartId, itemId);
  }
}
