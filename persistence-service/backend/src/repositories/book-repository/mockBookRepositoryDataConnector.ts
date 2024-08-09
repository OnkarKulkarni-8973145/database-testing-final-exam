import Book from "../../entities/book";
import DataConnector from "../../interfaces/dataConnector";
import BookFilteringOptions from "../../interfaces/bookFilteringOptions";

export class MockBookRepositoryDataConnector implements DataConnector<Book, BookFilteringOptions> {
    
    private mockBooks: Book[] = [
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
        }
    ]; 

    async findById(filteringOptions: BookFilteringOptions): Promise<Book | null> {
        const book = this.mockBooks.find(p => p.book_id === filteringOptions.book_id);
        return book || null;
    }

    async getAll(): Promise<Book[]> {
        return this.mockBooks;
    } 

    async create(entity: Book): Promise<Book> {
        const newId = 2;
        let savedBook: Book = {
            ...entity,
            book_id: newId
        };
        this.mockBooks.push(savedBook);
        return savedBook;
    }

    async update (entity: Book): Promise<Book> {
        const index = this.mockBooks.findIndex(p => p.book_id === entity.book_id);

        if (index === -1) {
            throw new Error('Book not found'); // Handle the case where the book is not found
        }

        this.mockBooks[index] = {
            ...this.mockBooks[index],
            ...entity
        };
       
        return this.mockBooks[index];
    }


    async delete (id: number): Promise<void> {
        const index = this.mockBooks.findIndex(p => p.book_id === id);

        if (index === -1) throw new Error('Book not found');

        this.mockBooks.splice(index, 1);
    }
}