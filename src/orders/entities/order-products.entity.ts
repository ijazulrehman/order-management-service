import Product from 'src/products/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Order from './order.entity';

@Entity({ name: 'order_products' })
class OrderProducts {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public quantity: number;

  @JoinColumn({
    name: 'product_id',
  })
  @ManyToOne(() => Product, (product) => product.orderProducts, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @JoinColumn({
    name: 'order_id',
  })
  @ManyToOne(() => Order, (order) => order.orderProducts, {
    onDelete: 'CASCADE',
  })
  order: Order;
}

export default OrderProducts;
