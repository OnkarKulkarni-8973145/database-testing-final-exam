import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Review from "./review";
import Order from "./order";

@Entity()
export default class Customer {
    @PrimaryGeneratedColumn()
    customer_id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column("date")
    join_date: Date;

    @OneToMany(() => Review, review => review.customer)
    reviews: Review[];

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];
}
