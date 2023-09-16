import { OmitType, PartialType } from '@nestjs/swagger';
import CreateOrderDto from './createOrder.dto';

export class UpdateOrderDto extends PartialType(
  OmitType(CreateOrderDto, [
    'products',
    'orderCode',
  ] as (keyof CreateOrderDto)[]),
) {}

export default UpdateOrderDto;
