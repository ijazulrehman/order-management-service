import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import OrdersService from './orders.service';
import CreateOrderDto from './dto/createOrder.dto';
import UpdateOrderDto from './dto/updateOrder.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedOrdersResultDto } from './dto/paginatedOrdersResult.dto';
import { FilteringDto } from './dto/filtering.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import Product from 'src/products/product.entity';

@ApiTags('orders')
@Controller('orders')
@ApiBearerAuth()
export default class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders(
    @Query() paginationDto: PaginationDto,
    @Query() filteringDto: FilteringDto,
  ): Promise<PaginatedOrdersResultDto> {
    paginationDto.page = paginationDto.page ? Number(paginationDto.page) : 1;
    paginationDto.limit = paginationDto.limit
      ? Number(paginationDto.limit)
      : 10;

    return this.ordersService.getAllOrders(
      {
        ...paginationDto,
        limit: paginationDto.limit > 10 ? 10 : paginationDto.limit,
      },
      filteringDto,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: Product,
  })
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(Number(id));
  }

  @Post()
  @ApiOkResponse({
    type: Product,
  })
  async createOrder(@Body() order: CreateOrderDto) {
    return this.ordersService.createOrder(order);
  }

  @Put(':id')
  @ApiOkResponse({
    type: Product,
  })
  async replaceOrder(@Param('id') id: string, @Body() order: UpdateOrderDto) {
    return this.ordersService.updateOrder(Number(id), order);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(Number(id));
  }
}
