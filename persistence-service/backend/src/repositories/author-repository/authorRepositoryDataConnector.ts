import { DataSource } from "typeorm";
import DataConnector from "../../interfaces/dataConnector";
import Author from "../../entities/author";
import AuthorFilteringOptions from "../../interfaces/authorFilteringOptions";

export class AuthorRepositoryDataConnector implements DataConnector<Author, AuthorFilteringOptions> {
    #dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.#dataSource = dataSource;
    }

    async findById(filteringOptions: AuthorFilteringOptions): Promise<Author | null> {
        return await this.#dataSource.manager.findOne(Author, {
            where: { author_id: filteringOptions.author_id }
        });
    }

    async create(entity: Author): Promise<Author> {
        return await this.#dataSource.manager.save(entity);
    }

    async update(entity: Author): Promise<Author> {
        const result = await this.#dataSource.manager.update(Author, entity.author_id, entity);

        if (result.affected === 0) throw new Error('Author not found');
        
        return { ...entity, author_id: entity.author_id };
    }

    async delete(AuthorId: number): Promise<void> {
        await this.#dataSource.manager.delete(Author, AuthorId);
    }

    async getAll (): Promise<Author[]> {
        return await this.#dataSource.manager.find(Author);
    }
}