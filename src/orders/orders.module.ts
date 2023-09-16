import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrdersController from './orders.controller';
import OrdersService from './orders.service';
import Order from './entities/order.entity';
import Product from '../products/product.entity';
import OrderProducts from './entities/order-products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, OrderProducts])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
