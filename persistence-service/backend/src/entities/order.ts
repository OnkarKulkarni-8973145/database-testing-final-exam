import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import Customer from "./customer";
import OrderItem from "./orderItem";

@Entity()
export default class Order {
    @PrimaryGeneratedColumn()
    order_id: number;

    @ManyToOne(() => Customer, customer => customer.orders)
    customer: Customer;

    @Column("date")
    order_date: Date;

    @Column("decimal")
    total_amount: number;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];
}
