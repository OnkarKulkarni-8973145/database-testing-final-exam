import Publisher from "../../entities/publisher";
import DataConnector from "../../interfaces/dataConnector";
import PublisherFilteringOptions from "../../interfaces/publisherFilteringOptions";

export class MockPublisherRepositoryDataConnector implements DataConnector<Publisher, PublisherFilteringOptions> {
    
    private mockPublishers: Publisher[] = [
        {
            publisher_id: 1,
            name: 'publisher 1',
            address: 'publisher 1 address',
            contact_email: 'publisher1@example.com',
            books:[]
        }
    ]; 

    async findById(filteringOptions: PublisherFilteringOptions): Promise<Publisher | null> {
        const publisher = this.mockPublishers.find(p => p.publisher_id === filteringOptions.publisher_id);
        return publisher || null;
    }

    async getAll(): Promise<Publisher[]> {
        return this.mockPublishers;
    } 

    async create(entity: Publisher): Promise<Publisher> {
        const newId = 2;
        let savedPublisher: Publisher = {
            ...entity,
            books: [],
            publisher_id: newId
        };
        this.mockPublishers.push(savedPublisher);
        return savedPublisher;
    }

    async update (entity: Publisher): Promise<Publisher> {
        const index = this.mockPublishers.findIndex(p => p.publisher_id === entity.publisher_id);

        if (index === -1) {
            throw new Error('Publisher not found'); // Handle the case where the publisher is not found
        }

        this.mockPublishers[index] = {
            ...this.mockPublishers[index],
            ...entity
        };
       
        return this.mockPublishers[index];
    }


    async delete (id: number): Promise<void> {
        const index = this.mockPublishers.findIndex(p => p.publisher_id === id);

        if (index === -1) throw new Error('Publisher not found');

        this.mockPublishers.splice(index, 1);
    }
}