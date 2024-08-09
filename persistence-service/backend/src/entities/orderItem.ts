import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Order from "./order";

@Entity()
export default class OrderItem {
    @PrimaryGeneratedColumn()
    order_item_id: number;

    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;

    @Column()
    quantity: number;

    @Column("decimal")
    unit_price: number;
}
