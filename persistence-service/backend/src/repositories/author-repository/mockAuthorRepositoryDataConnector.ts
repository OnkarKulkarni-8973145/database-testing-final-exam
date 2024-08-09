import Author from "../../entities/author";
import DataConnector from "../../interfaces/dataConnector";
import AuthorFilteringOptions from "../../interfaces/authorFilteringOptions";

export class MockAuthorRepositoryDataConnector implements DataConnector<Author, AuthorFilteringOptions> {
    
    private mockAuthors: Author[] = [
        {
            author_id: 1,
            name: 'author 1',
            bio: 'author 1 bio',
            birth_date: new Date('1992-08-25'),
            books:[]
        }
    ]; 

    async findById(filteringOptions: AuthorFilteringOptions): Promise<Author | null> {
        const author = this.mockAuthors.find(p => p.author_id === filteringOptions.author_id);
        return author || null;
    }

    async getAll(): Promise<Author[]> {
        return this.mockAuthors;
    } 

    async create(entity: Author): Promise<Author> {
        const newId = 2;
        let savedAuthor: Author = {
            ...entity,
            books: [],
            author_id: newId
        };
        this.mockAuthors.push(savedAuthor);
        return savedAuthor;
    }

    async update (entity: Author): Promise<Author> {
        const index = this.mockAuthors.findIndex(p => p.author_id === entity.author_id);

        if (index === -1) {
            throw new Error('Author not found'); // Handle the case where the author is not found
        }

        this.mockAuthors[index] = {
            ...this.mockAuthors[index],
            ...entity
        };
       
        return this.mockAuthors[index];
    }


    async delete (id: number): Promise<void> {
        const index = this.mockAuthors.findIndex(p => p.author_id === id);

        if (index === -1) throw new Error('Author not found');

        this.mockAuthors.splice(index, 1);
    }
}