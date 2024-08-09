import Publisher from "../../entities/publisher";
import DataConnector from "../../interfaces/dataConnector";
import PublisherFilteringOptions from "../../interfaces/publisherFilteringOptions";
import Result from "../../utils/result";

export default class PublisherRepository {
    #dataConnector: DataConnector<Publisher, PublisherFilteringOptions>

    constructor(dataConnector: DataConnector<Publisher, PublisherFilteringOptions>,) {
        this.#dataConnector = dataConnector
    }
   
    async get(id: string): Promise<Result<Publisher>> {

        const publisher_id = parseInt(id);

        if(isNaN(publisher_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (typeof publisher_id !== 'number') return { error: 'ID must be a number', errorCode: 400 };
        if (publisher_id < 0) return { error: 'Publisher ID cannot be less than 0', errorCode: 400 };

        try {
            let publisher = await this.#dataConnector.findById({ publisher_id });
            if (!publisher) return { error: 'Publisher not found', errorCode: 404 };

            return { data: publisher };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async getAll(): Promise<Result<Publisher[]>> {
        try {
            let photos = await this.#dataConnector.getAll();
            return { data: photos };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async post(publisher: Publisher): Promise<Result<Publisher>> {
        try {
            let savedPublisher = await this.#dataConnector.create(publisher);
            return { data: savedPublisher };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async put(publisher: Publisher): Promise<Result<Publisher>> {

        try {
            let savedPublisher = await this.#dataConnector.update(publisher);
            return { data: savedPublisher };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async delete(id: string): Promise<Result<void>> {
        const publisher_id = parseInt(id);

        if (isNaN(publisher_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (publisher_id < 0) return { error: 'Publisher ID cannot be less than 0', errorCode: 400 };

        try {
            const publisher = await this.#dataConnector.findById({ publisher_id });

            if (!publisher) return { error: 'Publisher not found', errorCode: 404 };

            await this.#dataConnector.delete(publisher_id); 
            
            return { data: undefined };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }
}

