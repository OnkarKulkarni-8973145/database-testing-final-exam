import { Express } from "express";
import Author from "../entities/author";
import AuthorRepository from "../repositories/author-repository/authorRepository";
import Result from "../utils/result";

export default class AuthorApi {
    #authorRepository: AuthorRepository;
    #express: Express;

    constructor(authorRepository: AuthorRepository, express: Express) {
        this.#authorRepository = authorRepository;
        this.#express = express;

        this.#express.get("/author/:id", async (req, res) => {
            try {
                const result: Result<Author> = await this.#authorRepository.get(req.params.id);

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

        this.#express.get("/authors", async (req, res) => {
            try {
                const authors = await this.#authorRepository.getAll();
        
                res.status(200).json(authors.data);
            } catch (err) {
                console.error('Failed to retrieve author:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.post("/author", async (req, res) => {
            const { body } = req;
            console.log(body);

            const author = new Author();

            author.name = body.name;
            author.bio = body.bio;
            author.birth_date = body.birth_date;

            try {
                let result = await this.#authorRepository.post(author);
                
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

        this.#express.put("/author/:id", async (req, res) => {
            const { id } = req.params;
            const { body } = req;
        
            const author_id = parseInt(id);
            if (isNaN(author_id)) {
                return res.status(400).json({ message: 'ID must be a number' });
            }

            const author: Author = new Author();
            author.author_id = author_id;
            author.name = body.name;
            author.bio = body.email;
            author.birth_date = body.phone;

        
            try {
                let result = await this.#authorRepository.put(author);
        
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
        
        this.#express.delete("/author/:id", async (req, res) => {
            const { id } = req.params;

            try {
                let result = await this.#authorRepository.delete(id);
        
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

