import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Book from "./book";
import Customer from "./customer";

@Entity()
export default class Review {
    @PrimaryGeneratedColumn()
    review_id: number;

    @ManyToOne(() => Book, book => book.reviews)
    book: Book;

    @ManyToOne(() => Customer, customer => customer.reviews)
    customer: Customer;

    @Column("date")
    review_date: Date;

    @Column()
    rating: number;

    @Column("text")
    comment: string;

    book_id: number;
    customer_id: number;
}
