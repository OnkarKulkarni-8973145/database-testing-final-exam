import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Author from "./author";
import Publisher from "./publisher";
import Review from "./review";

@Entity()
export default class Book{
    @PrimaryGeneratedColumn()
    book_id: number;

    @Column()
    title: string;

    @Column()
    genre: string;

    @Column()
    publish_date: Date;

    @ManyToOne(() => Author, author => author.books)
    author: Author;

    @ManyToOne(() => Publisher, publisher => publisher.books)
    publisher: Publisher;

    @Column()
    format: string;

    @Column()
    price: number;

    author_id: number;
    publisher_id: number;

    @Column()
    reviews: number;

}