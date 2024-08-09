import Author from "../../entities/author";
import DataConnector from "../../interfaces/dataConnector";
import AuthorFilteringOptions from "../../interfaces/authorFilteringOptions";
import Result from "../../utils/result";

export default class AuthorRepository {
    #dataConnector: DataConnector<Author, AuthorFilteringOptions>

    constructor(dataConnector: DataConnector<Author, AuthorFilteringOptions>,) {
        this.#dataConnector = dataConnector
    }
   
    async get(id: string): Promise<Result<Author>> {

        const author_id = parseInt(id);

        if(isNaN(author_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (typeof author_id !== 'number') return { error: 'ID must be a number', errorCode: 400 };
        if (author_id < 0) return { error: 'Author ID cannot be less than 0', errorCode: 400 };

        try {
            let author = await this.#dataConnector.findById({ author_id });
            if (!author) return { error: 'Author not found', errorCode: 404 };

            return { data: author };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async getAll(): Promise<Result<Author[]>> {
        try {
            let photos = await this.#dataConnector.getAll();
            return { data: photos };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async post(author: Author): Promise<Result<Author>> {
        try {
            let savedAuthor = await this.#dataConnector.create(author);
            return { data: savedAuthor };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async put(author: Author): Promise<Result<Author>> {

        try {
            let savedAuthor = await this.#dataConnector.update(author);
            return { data: savedAuthor };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async delete(id: string): Promise<Result<void>> {
        const author_id = parseInt(id);

        if (isNaN(author_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (author_id < 0) return { error: 'Author ID cannot be less than 0', errorCode: 400 };

        try {
            const author = await this.#dataConnector.findById({ author_id });

            if (!author) return { error: 'Author not found', errorCode: 404 };

            await this.#dataConnector.delete(author_id); 
            
            return { data: undefined };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }
}

