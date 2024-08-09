import { Express } from "express";
import Publisher from "../entities/publisher";
import PublisherRepository from "../repositories/publisher-repository/publisherRepository";
import Result from "../utils/result";

export default class PublisherApi {
    #publisherRepository: PublisherRepository;
    #express: Express;

    constructor(publisherRepository: PublisherRepository, express: Express) {
        this.#publisherRepository = publisherRepository;
        this.#express = express;

        this.#express.get("/publisher/:id", async (req, res) => {
            try {
                const result: Result<Publisher> = await this.#publisherRepository.get(req.params.id);

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

        this.#express.get("/publishers", async (req, res) => {
            try {
                const publishers = await this.#publisherRepository.getAll();
        
                res.status(200).json(publishers.data);
            } catch (err) {
                console.error('Failed to retrieve publisher:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.post("/publisher", async (req, res) => {
            const { body } = req;
            console.log(body);

            const publisher = new Publisher();

            publisher.name = body.name;
            publisher.address = body.address;
            publisher.contact_email = body.contact_email;

            try {
                let result = await this.#publisherRepository.post(publisher);
                
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

        this.#express.put("/publisher/:id", async (req, res) => {
            const { id } = req.params;
            const { body } = req;
        
            const publisher_id = parseInt(id);
            if (isNaN(publisher_id)) {
                return res.status(400).json({ message: 'ID must be a number' });
            }

            const publisher: Publisher = new Publisher();
            publisher.publisher_id = publisher_id;
            publisher.name = body.name;
            publisher.address = body.address;
            publisher.contact_email = body.contact_email;

        
            try {
                let result = await this.#publisherRepository.put(publisher);
        
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
        
        this.#express.delete("/publisher/:id", async (req, res) => {
            const { id } = req.params;

            try {
                let result = await this.#publisherRepository.delete(id);
        
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

