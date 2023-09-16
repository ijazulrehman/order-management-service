import {
  Injectable,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  getManager,
  In,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import Order from './entities/order.entity';
import CreateOrderDto from './dto/createOrder.dto';
import UpdateOrderDto from './dto/updateOrder.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedOrdersResultDto } from './dto/paginatedOrdersResult.dto';
import { FilteringDto } from './dto/filtering.dto';
import Product from 'src/products/product.entity';
import OrderProducts from './entities/order-products.entity';

@Injectable()
export default class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(OrderProducts)
    private orderProductsRepository: Repository<OrderProducts>,
  ) {}

  private static getFilterQuery(
    filteringDto: FilteringDto,
    ordersQueryBuilder: SelectQueryBuilder<Order>,
  ): SelectQueryBuilder<Order> {
    let ordersFilterQuery = ordersQueryBuilder;

    if (filteringDto.id) {
      ordersFilterQuery = ordersQueryBuilder.where('orders.id = :id', {
        id: filteringDto.id,
      });
    }

    if (filteringDto.orderCode) {
      ordersFilterQuery = ordersFilterQuery.andWhere(
        'orders.orderCode = :orderCode',
        {
          orderCode: filteringDto.orderCode,
        },
      );
    }

    if (filteringDto.orderType) {
      ordersFilterQuery = ordersFilterQuery.andWhere(
        'orders.orderType = :orderType',
        {
          orderType: filteringDto.orderType,
        },
      );
    }

    if (filteringDto.orderStatus) {
      ordersFilterQuery = ordersFilterQuery.andWhere(
        'orders.orderStatus = :orderStatus',
        {
          orderStatus: filteringDto.orderStatus,
        },
      );
    }

    return ordersFilterQuery;
  }

  async getAllOrders(
    paginationDto: PaginationDto,
    filteringDto: FilteringDto,
  ): Promise<PaginatedOrdersResultDto> {
    const report = await this.queryDailyReport('2023-09-15');
    return report;
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const totalCount = await this.ordersRepository.count();
    const ordersQueryBuilder =
      this.ordersRepository.createQueryBuilder('orders');

    const ordersFilterQuery = OrdersService.getFilterQuery(
      filteringDto,
      ordersQueryBuilder,
    );

    const orders = await ordersFilterQuery
      .orderBy('id', 'DESC')
      .offset(skippedItems)
      .limit(paginationDto.limit)
      .getMany();

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: orders,
    };
  }

  async getOrderById(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });
    if (order) {
      return order;
    }
    throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  }

  /**
   * TODO: Use transaction to perform
   * TODO: simplify the function
   *
   * @param order
   * @returns
   */
  async createOrder(order: CreateOrderDto) {
    const orderedProductIds = order.products.map(
      (product) => product.productId,
    );
    const productQuantityKeyPair = order.products.reduce((acc, item) => {
      const { productId, quantity } = item;
      if (acc[productId]) {
        acc[productId] += quantity;
      } else {
        acc[productId] = quantity;
      }
      return acc;
    }, {});

    const foundProducts = await this.productsRepository.find({
      where: {
        id: In(orderedProductIds),
      },
    });

    const productAvailablityError: {
      id: number;
      availableQuantity?: number;
      message: string;
    }[] = [];

    const foundProductsIds = foundProducts.map((product) => product.id);

    orderedProductIds.forEach((productId) => {
      if (!foundProductsIds.includes(productId))
        productAvailablityError.push({
          id: productId,
          message: 'Product not found!',
        });
    });

    foundProducts.forEach((product) => {
      const { quantity: availableQuantity, id } = product;
      if (availableQuantity < productQuantityKeyPair[id]) {
        productAvailablityError.push({
          id,
          availableQuantity,
          message: 'Insufficient Product Availability',
        });
      }
    });

    if (productAvailablityError.length > 0)
      throw new UnprocessableEntityException(productAvailablityError);

    let totalPrice = 0;

    for (const product of foundProducts) {
      this.productsRepository.merge(product, {
        quantity: product.quantity - productQuantityKeyPair[product.id],
      });
      this.productsRepository.save(product);
      totalPrice =
        totalPrice + productQuantityKeyPair[product.id] * product.price;
    }

    const newOrder = await this.ordersRepository.save({
      ...order,
      totalPrice,
    });

    const newOrderProducts = order.products.map((product) =>
      this.orderProductsRepository.create({
        order: { id: newOrder.id },
        product: { id: product.productId },
        quantity: product.quantity,
      }),
    );

    return {
      ...newOrder,
      orderProducts: await this.orderProductsRepository.save(newOrderProducts),
    };
  }

  /**
   * TODO: add support for product quantity
   *
   * @param id
   * @param order
   */
  async updateOrder(id: number, order: UpdateOrderDto) {
    await this.ordersRepository.update(id, order);
    const updatedOrder = await this.ordersRepository.findOne({
      where: { id },
    });
    if (updatedOrder) {
      return updatedOrder;
    }
    throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  }

  async deleteOrder(id: number) {
    const deleteResponse = await this.ordersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  }

  /**
   *
   *
   * @param reportDate
   */
  async queryDailyReport(reportDate: string) {
    const start = `${reportDate} 00:00:00`;
    const end = `${reportDate} 23:59:59`;

    // Get revenue (1) and number of orders (2)
    const ordersReport = await this.ordersRepository
      .createQueryBuilder('orders')
      .select('SUM(orders.totalPrice)', 'revenue')
      .addSelect('COUNT(orders.orderCode)', 'numberOfOrders')
      .where(`orders.updatedAt BETWEEN '${start}' AND '${end}'`)
      .getRawOne();

    return {
      ...ordersReport,
    };
  }
}
