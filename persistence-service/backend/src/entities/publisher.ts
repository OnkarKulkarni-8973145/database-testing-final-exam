import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Book from "./book";

@Entity()
export default class Publisher {
    @PrimaryGeneratedColumn()
    publisher_id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    contact_email: string;

    @OneToMany(() => Book, book => book.publisher)
    books: Book[];
}
