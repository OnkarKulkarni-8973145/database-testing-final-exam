import Book from "../../entities/book";
import DataConnector from "../../interfaces/dataConnector";
import BookFilteringOptions from "../../interfaces/bookFilteringOptions";
import Result from "../../utils/result";
import Author from "../../entities/author";
import Publisher from "../../entities/publisher";
import AuthorFilteringOptions from "../../interfaces/authorFilteringOptions";
import PublisherFilteringOptions from "../../interfaces/publisherFilteringOptions";

export default class BookRepository {
    #dataConnector: DataConnector<Book, BookFilteringOptions>;
    #authorDataConnector: DataConnector<Author, AuthorFilteringOptions>;
    #publisherDataConnector: DataConnector<Publisher, PublisherFilteringOptions>;

    constructor(
        dataConnector: DataConnector<Book, BookFilteringOptions>,
        authorDataConnector: DataConnector<Author, AuthorFilteringOptions>,
        publisherDataConnector: DataConnector<Publisher, PublisherFilteringOptions>
    ) {
        this.#dataConnector = dataConnector;
        this.#authorDataConnector = authorDataConnector;
        this.#publisherDataConnector = publisherDataConnector;
    }
   
    async get(id: string): Promise<Result<Book>> {

        const book_id = parseInt(id);

        if(isNaN(book_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (typeof book_id !== 'number') return { error: 'ID must be a number', errorCode: 400 };
        if (book_id < 0) return { error: 'Book ID cannot be less than 0', errorCode: 400 };

        try {
            let book = await this.#dataConnector.findById({ book_id });
            if (!book) return { error: 'Book not found', errorCode: 404 };

            return { data: book };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async getAll(): Promise<Result<Book[]>> {
        try {
            let photos = await this.#dataConnector.getAll();
            return { data: photos };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async post(book: Book): Promise<Result<Book>> {

        try {
            
        
            let author = await this.#authorDataConnector.findById({ author_id: book.author_id });
            if(!author) return { error: 'Author not found', errorCode: 400 };
            book.author = author;

            let publisher = await this.#publisherDataConnector.findById({ publisher_id: book.publisher_id });
            if(!publisher) return { error: 'Publisher not found', errorCode: 400 };
            book.publisher = publisher;


            let savedBook = await this.#dataConnector.create(book);
            return { data: savedBook };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async put(book: Book): Promise<Result<Book>> {

        try {
            let author = await this.#authorDataConnector.findById({ author_id: book.author_id });
            if(!author) return { error: 'Author not found', errorCode: 400 };
            book.author = author;

            let publisher = await this.#publisherDataConnector.findById({ publisher_id: book.publisher_id });
            if(!publisher) return { error: 'Publisher not found', errorCode: 400 };
            book.publisher = publisher;

            let savedBook = await this.#dataConnector.update(book);
            return { data: savedBook };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async delete(id: string): Promise<Result<void>> {
        const book_id = parseInt(id);

        if (isNaN(book_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (book_id < 0) return { error: 'Book ID cannot be less than 0', errorCode: 400 };

        try {
            const book = await this.#dataConnector.findById({ book_id });

            if (!book) return { error: 'Book not found', errorCode: 404 };

            await this.#dataConnector.delete(book_id); 
            
            return { data: undefined };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }
}

