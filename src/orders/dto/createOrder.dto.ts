import {
  IsString,
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, OrderType } from '../order.enum';

export class ProductInOrderDto {
  @ApiProperty({
    description: 'The ID of the product.',
    example: 1,
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'The quantity of this product in the order.',
    example: 5,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'The unique code for the order.',
    example: 'ORD12345',
  })
  @IsString()
  @IsNotEmpty()
  orderCode: string;

  @ApiProperty({
    description: 'The type of the order.',
    enum: OrderType,
    example: OrderType.Standard,
  })
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty({
    description: 'An array of products in the order.',
    type: [ProductInOrderDto],
    example: [
      { productId: 1, quantity: 5 },
      { productId: 2, quantity: 3 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ProductInOrderDto)
  products: ProductInOrderDto[];

  @ApiProperty({
    description: 'The status of the order.',
    enum: OrderStatus,
    example: OrderStatus.Pending,
  })
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}

export default CreateOrderDto;
