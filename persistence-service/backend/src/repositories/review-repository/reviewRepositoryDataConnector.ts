import { DataSource } from "typeorm";
import DataConnector from "../../interfaces/dataConnector";
import Review from "../../entities/review";
import ReviewFilteringOptions from "../../interfaces/reviewFilteringOptions";
import Book from "../../entities/book";
import Customer from "../../entities/customer";
import CustomerFilteringOptions from "../../interfaces/customerFilteringOptions";
import BookFilteringOptions from "../../interfaces/bookFilteringOptions";

export class ReviewRepositoryDataConnector implements DataConnector<Review, ReviewFilteringOptions> {
    #dataSource: DataSource;

    constructor(dataSource: DataSource,
        bookDataConnector: DataConnector<Book, BookFilteringOptions>,
        customerDataConnector: DataConnector<Customer, CustomerFilteringOptions>
    ) {
        this.#dataSource = dataSource;
    }

    async findById(filteringOptions: ReviewFilteringOptions): Promise<Review | null> {
        return await this.#dataSource.manager.findOne(Review, {
            where: { review_id: filteringOptions.review_id }
        });
    }

    async create(entity: Review): Promise<Review> {
        return await this.#dataSource.manager.save(entity);
    }

    async update(entity: Review): Promise<Review> {
        const result = await this.#dataSource.manager.update(Review, entity.review_id, entity);

        if (result.affected === 0) throw new Error('Review not found');
        
        return { ...entity, review_id: entity.review_id };
    }

    async delete(ReviewId: number): Promise<void> {
        await this.#dataSource.manager.delete(Review, ReviewId);
    }

    async getAll (): Promise<Review[]> {
        return await this.#dataSource.manager.find(Review);
    }
}