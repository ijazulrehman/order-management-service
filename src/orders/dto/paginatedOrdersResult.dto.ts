import Order from '../entities/order.entity';

export class PaginatedOrdersResultDto {
  data: Order[];
  page: number;
  limit: number;
  totalCount: number;
}
