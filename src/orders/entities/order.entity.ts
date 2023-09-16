import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { OrderStatus, OrderType } from '../order.enum';
import OrderProducts from './order-products.entity';
@Entity({ name: 'orders' })
class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'order_code', unique: true })
  public orderCode: string;

  @Column({ name: 'order_type', type: 'enum', enum: OrderType })
  public orderType: OrderType;

  @Column({
    name: 'order_status',
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Processing,
  })
  public orderStatus: OrderStatus;

  @Column({ name: 'total_price' })
  public totalPrice: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  public updatedAt: Date;

  @OneToMany(() => OrderProducts, (orderProduct) => orderProduct.order)
  orderProducts: OrderProducts[];
}

export default Order;
