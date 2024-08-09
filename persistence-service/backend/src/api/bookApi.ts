import { Express } from "express";
import Book from "../entities/book";
import BookRepository from "../repositories/book-repository/bookRepository";
import Result from "../utils/result";

export default class BookApi {
    #bookRepository: BookRepository;
    #express: Express;

    constructor(bookRepository: BookRepository, express: Express) {
        this.#bookRepository = bookRepository;
        this.#express = express;

        this.#express.get("/book/:id", async (req, res) => {
            try {
                const result: Result<Book> = await this.#bookRepository.get(req.params.id);

                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        this.#express.get("/books", async (req, res) => {
            try {
                const books = await this.#bookRepository.getAll();
        
                res.status(200).json(books.data);
            } catch (err) {
                console.error('Failed to retrieve book:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.post("/book", async (req, res) => {
            const { body } = req;
            console.log(body);

            const book = new Book();

            book.title = body.title;
            book.genre = body.genre;
            book.publish_date = body.publish_date;
            book.format = body.format;
            book.price = body.price;
            book.author_id = body.author_id;
            book.publisher_id = body.publisher_id


            try {
                let result = await this.#bookRepository.post(book);
                
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.put("/book/:id", async (req, res) => {
            const { id } = req.params;
            const { body } = req;
        
            const book_id = parseInt(id);
            if (isNaN(book_id)) {
                return res.status(400).json({ message: 'ID must be a number' });
            }

            const book: Book = new Book();

            book.book_id = book_id;
            book.title = body.title;
            book.genre = body.genre;
            book.publish_date = body.publish_date;
            book.format = body.format;
            book.price = body.price;
            book.author_id = body.author_id;
            book.publisher_id = body.publisher_id
        
            try {
                let result = await this.#bookRepository.put(book);
        
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        
        this.#express.delete("/book/:id", async (req, res) => {
            const { id } = req.params;

            try {
                let result = await this.#bookRepository.delete(id);
        
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).send();
                }
            } catch (err) {
                console.error('Delete operation failed:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}

