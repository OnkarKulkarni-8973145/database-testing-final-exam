import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Book from "./book";
@Entity()
export default class Author {
    @PrimaryGeneratedColumn()
    author_id: number;

    @Column()
    name: string;

    @Column("text")
    bio: string;

    @Column("date")
    birth_date: Date;

    @OneToMany(() => Book, book => book.author)
    books: Book[];
}
