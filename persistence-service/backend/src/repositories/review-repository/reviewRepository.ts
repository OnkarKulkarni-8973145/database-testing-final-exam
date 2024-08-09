import Book from "../../entities/book";
import Customer from "../../entities/customer";
import Review from "../../entities/review";
import BookFilteringOptions from "../../interfaces/bookFilteringOptions";
import CustomerFilteringOptions from "../../interfaces/customerFilteringOptions";
import DataConnector from "../../interfaces/dataConnector";
import ReviewFilteringOptions from "../../interfaces/reviewFilteringOptions";
import Result from "../../utils/result";

export default class ReviewRepository {
    #dataConnector: DataConnector<Review, ReviewFilteringOptions>;
    #bookDataConnector: DataConnector<Book, BookFilteringOptions>;
    #customerDataConnector: DataConnector<Customer, CustomerFilteringOptions>;

    constructor(dataConnector: DataConnector<Review, ReviewFilteringOptions>,
        bookDataConnector: DataConnector<Book, BookFilteringOptions>,
        customerDataConnector: DataConnector<Customer, CustomerFilteringOptions>
    ) {
        this.#dataConnector = dataConnector;
        this.#bookDataConnector = bookDataConnector;
        this.#customerDataConnector = customerDataConnector;
    }
   
    async get(id: string): Promise<Result<Review>> {

        const review_id = parseInt(id);

        if(isNaN(review_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (typeof review_id !== 'number') return { error: 'ID must be a number', errorCode: 400 };
        if (review_id < 0) return { error: 'Review ID cannot be less than 0', errorCode: 400 };

        try {
            let review = await this.#dataConnector.findById({ review_id });
            if (!review) return { error: 'Review not found', errorCode: 404 };

            return { data: review };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async getAll(): Promise<Result<Review[]>> {
        try {
            let photos = await this.#dataConnector.getAll();
            return { data: photos };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async post(review: Review): Promise<Result<Review>> {
        try {

            let customer = await this.#customerDataConnector.findById({ customer_id: review.customer_id });
            if(!customer) return { error: 'Customer not found', errorCode: 400 };
            review.customer = customer;
    
            let book = await this.#bookDataConnector.findById({ book_id: review.book_id });
            if(!book) return { error: 'Book not found', errorCode: 400 };
            review.book = book;
            
            let savedReview = await this.#dataConnector.create(review);
            return { data: savedReview };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async put(review: Review): Promise<Result<Review>> {
        try {
            let customer = await this.#customerDataConnector.findById({ customer_id: review.customer_id });
            if(!customer) return { error: 'Customer not found', errorCode: 400 };
            review.customer = customer;
    
            let book = await this.#bookDataConnector.findById({ book_id: review.book_id });
            if(!book) return { error: 'Book not found', errorCode: 400 };
            review.book = book;

            let savedReview = await this.#dataConnector.update(review);
            return { data: savedReview };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async delete(id: string): Promise<Result<void>> {
        const review_id = parseInt(id);

        if (isNaN(review_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (review_id < 0) return { error: 'Review ID cannot be less than 0', errorCode: 400 };

        try {
            const review = await this.#dataConnector.findById({ review_id });

            if (!review) return { error: 'Review not found', errorCode: 404 };

            await this.#dataConnector.delete(review_id); 
            
            return { data: undefined };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }
}

