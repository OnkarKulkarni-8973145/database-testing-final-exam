import { DataSource } from "typeorm";
import DataConnector from "../../interfaces/dataConnector";
import Publisher from "../../entities/publisher";
import PublisherFilteringOptions from "../../interfaces/publisherFilteringOptions";

export class PublisherRepositoryDataConnector implements DataConnector<Publisher, PublisherFilteringOptions> {
    #dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.#dataSource = dataSource;
    }

    async findById(filteringOptions: PublisherFilteringOptions): Promise<Publisher | null> {
        return await this.#dataSource.manager.findOne(Publisher, {
            where: { publisher_id: filteringOptions.publisher_id }
        });
    }

    async create(entity: Publisher): Promise<Publisher> {
        return await this.#dataSource.manager.save(entity);
    }

    async update(entity: Publisher): Promise<Publisher> {
        const result = await this.#dataSource.manager.update(Publisher, entity.publisher_id, entity);

        if (result.affected === 0) throw new Error('Publisher not found');
        
        return { ...entity, publisher_id: entity.publisher_id };
    }

    async delete(PublisherId: number): Promise<void> {
        await this.#dataSource.manager.delete(Publisher, PublisherId);
    }

    async getAll (): Promise<Publisher[]> {
        return await this.#dataSource.manager.find(Publisher);
    }
}