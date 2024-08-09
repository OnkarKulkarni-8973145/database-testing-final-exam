import { DataSource } from "typeorm";
import DataConnector from "../../interfaces/dataConnector";
import Book from "../../entities/book";
import BookFilteringOptions from "../../interfaces/bookFilteringOptions";

export class BookRepositoryDataConnector implements DataConnector<Book, BookFilteringOptions> {
    #dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.#dataSource = dataSource;
    }

    async findById(filteringOptions: BookFilteringOptions): Promise<Book | null> {
        return await this.#dataSource.manager.findOne(Book, {
            where: { book_id: filteringOptions.book_id },
            relations: ['author', 'publisher']
        });
    }

    async create(entity: Book): Promise<Book> {
        return await this.#dataSource.manager.save(entity);
    }

    async update(entity: Book): Promise<Book> {
        const result = await this.#dataSource.manager.update(Book, entity.book_id, entity);

        if (result.affected === 0) throw new Error('Book not found');
        
        return { ...entity, book_id: entity.book_id };
    }

    async delete(BookId: number): Promise<void> {
        await this.#dataSource.manager.delete(Book, BookId);
    }

    async getAll (): Promise<Book[]> {
        return await this.#dataSource.manager.find(Book, { relations: ['author', 'publisher'] });
    }
}