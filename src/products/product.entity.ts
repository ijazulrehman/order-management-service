import OrderProducts from '../orders/entities/order-products.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'product_code', unique: true })
  public productCode: string;

  @Column({ name: 'product_name' })
  public productName: string;

  @Column()
  public price: number;

  @Column({ default: 0 })
  public quantity: number;

  @OneToMany(() => OrderProducts, (orderProduct) => orderProduct.product)
  orderProducts: OrderProducts[];
}

export default Product;
