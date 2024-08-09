import Book from "../../entities/book";
import { MockBookRepositoryDataConnector } from "./mockBookRepositoryDataConnector";
import BookRepository from "./bookRepository";
import { MockAuthorRepositoryDataConnector } from "../author-repository/mockAuthorRepositoryDataConnector";
import { MockPublisherRepositoryDataConnector } from "../publisher-repository/mockPublisherRepositoryDataConnector";

describe('Book Api', () => {
    let bookApi: any;
    let authorApi: any;
    let publisherApi: any;

    beforeAll(() => {
        authorApi = new MockAuthorRepositoryDataConnector();
        publisherApi = new MockPublisherRepositoryDataConnector();
        bookApi = new BookRepository(new MockBookRepositoryDataConnector(), authorApi, publisherApi);
    });

    test('will throw an error if id is not a number', async () => {
        let book = await bookApi.get('abcd');

        expect(book.error).toBe('ID must be a number')
        expect(book.errorCode).toBe(400);
    });

    test('will throw an error if id is less than 0', async () => {
        let book = await bookApi.get('-1');

        expect(book.error).toBe('Book ID cannot be less than 0')
        expect(book.errorCode).toBe(400);
    });

    test('will throw an error if id is not found', async () => {
        let book = await bookApi.get('2');

        expect(book.error).toBe('Book not found')
        expect(book.errorCode).toBe(404);
    });

    test('a book is returned if a positive id is provided', async () => {
        let book = await bookApi.get('1');

        expect(book.data).toStrictEqual(
            {
                book_id: 1,
                title: "book 1",
                genre: "Fantasy",
                publish_date: new Date("2023-06-26"),
                format: "Hardcover",
                price: 19,
                author: {
                    author_id: 1,
                    name: "author 1",
                    bio: "author 1 bio",
                    birth_date: new Date('1992-08-25'),
                    books:[]
                },
                publisher: {
                    publisher_id: 1,
                    name: 'publisher 1',
                    address: 'publisher 1 address',
                    contact_email: 'publisher1@example.com',
                    books:[]
                },
                author_id: 1,
                publisher_id: 1
            });
    });

    test('will retrieve all books', async () => {
        let books = await bookApi.getAll();

        expect(books.data).toStrictEqual(
            [{
                book_id: 1,
                title: "book 1",
                genre: "Fantasy",
                publish_date: new Date("2023-06-26"),
                format: "Hardcover",
                price: 19,
                author: {
                    author_id: 1,
                    name: "author 1",
                    bio: "author 1 bio",
                    birth_date: new Date('1992-08-25'),
                    books:[]
                },
                publisher: {
                    publisher_id: 1,
                    name: 'publisher 1',
                    address: 'publisher 1 address',
                    contact_email: 'publisher1@example.com',
                    books:[]
                },
                author_id: 1,
                publisher_id: 1
            }]);
    });

    test('will saved the book', async () => {
        let book: Book = new Book();
        book.title = "book 2";
        book.genre = "Horror";
        book.publish_date = new Date('1967-05-28');
        book.format = "Hardcover";
        book.price = 19;
        book.author_id = 1;
        book.publisher_id = 1;


        let savedBook = await bookApi.post(book);

        expect(savedBook.data).toStrictEqual(
            {
                book_id: 2,
                title: "book 2",
                genre: "Horror",
                publish_date: new Date('1967-05-28'),
                format: "Hardcover",
                price: 19,
                author: {
                    author_id: 1,
                    name: "author 1",
                    bio: "author 1 bio",
                    birth_date: new Date('1992-08-25'),
                    books:[]
                },
                publisher: {
                    publisher_id: 1,
                    name: 'publisher 1',
                    address: 'publisher 1 address',
                    contact_email: 'publisher1@example.com',
                    books:[]
                },
                author_id: 1,
                publisher_id: 1
            });
    });

    test('will update the book', async () => {
        let book: Book = new Book();
        book.book_id = 2;
        book.title = "book 2 update title";
        book.genre = "Horror";
        book.publish_date = new Date('1967-05-28');
        book.format = "Hardcover";
        book.price = 19;
        book.author_id = 1;
        book.publisher_id = 1;

        let savedBook = await bookApi.put(book);
        
        expect(savedBook.data).toStrictEqual(
            {
                book_id: 2,
                title: "book 2 update title",
                genre: "Horror",
                publish_date: new Date('1967-05-28'),
                format: "Hardcover",
                price: 19,
                author: {
                    author_id: 1,
                    name: "author 1",
                    bio: "author 1 bio",
                    birth_date: new Date('1992-08-25'),
                    books:[]
                },
                publisher: {
                    publisher_id: 1,
                    name: 'publisher 1',
                    address: 'publisher 1 address',
                    contact_email: 'publisher1@example.com',
                    books:[]
                },
                author_id: 1,
                publisher_id: 1
            });
    });

    test('will throw an error if author is not found during insert operations', async () => {
        let book: Book = new Book();
        book.book_id = 2;
        book.title = "book 2 update title";
        book.genre = "Horror";
        book.publish_date = new Date('1967-05-28');
        book.format = "Hardcover";
        book.price = 19;
        book.author_id = 2;
        book.publisher_id = 1;

        let savedBook = await bookApi.post(book);
        
        expect(savedBook.errorCode).toBe(400);
        expect(savedBook.error).toEqual('Author not found');
    });

    test('will throw an error if publisher is not found during insert operations', async () => {
        let book: Book = new Book();
        book.book_id = 2;
        book.title = "book 2 update title";
        book.genre = "Horror";
        book.publish_date = new Date('1967-05-28');
        book.format = "Hardcover";
        book.price = 19;
        book.author_id = 1;
        book.publisher_id = 2;

        let savedBook = await bookApi.post(book);
        
        expect(savedBook.errorCode).toBe(400);
        expect(savedBook.error).toEqual('Publisher not found');
    });

        
    it('should handle deleting a non-existent book', async () => {
        const nonExistentBookId = 9999;
        let book = await bookApi.delete(nonExistentBookId)
        expect(book.error).toBe('Book not found')
        expect(book.errorCode).toBe(404);
    });

    it('should delete an existing book', async () => {
        await bookApi.delete(2);
        const deletedBook = await bookApi.get('2');
        expect(deletedBook.error).toBe('Book not found')
        expect(deletedBook.errorCode).toBe(404);
    });
});
