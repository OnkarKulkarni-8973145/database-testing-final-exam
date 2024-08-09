import Publisher from "../../entities/publisher";
import { MockPublisherRepositoryDataConnector } from "./mockPublisherRepositoryDataConnector";
import PublisherRepository from "./publisherRepository";

describe('Publisher Api', () => {
    let publisherApi: any;

    beforeAll(() => {
        publisherApi = new PublisherRepository(new MockPublisherRepositoryDataConnector());
    });

    test('will throw an error if id is not a number', async () => {
        let publisher = await publisherApi.get('abcd');

        expect(publisher.error).toBe('ID must be a number')
        expect(publisher.errorCode).toBe(400);
    });

    test('will throw an error if id is less than 0', async () => {
        let publisher = await publisherApi.get('-1');

        expect(publisher.error).toBe('Publisher ID cannot be less than 0')
        expect(publisher.errorCode).toBe(400);
    });

    test('will throw an error if id is not found', async () => {
        let publisher = await publisherApi.get('2');

        expect(publisher.error).toBe('Publisher not found')
        expect(publisher.errorCode).toBe(404);
    });

    test('a publisher is returned if a positive id is provided', async () => {
        let publisher = await publisherApi.get('1');

        expect(publisher.data).toStrictEqual(
            {
                publisher_id: 1,
                name: 'publisher 1',
                address: 'publisher 1 address',
                contact_email: 'publisher1@example.com',
                books:[]
            });
    });

    test('will retrieve all publishers', async () => {
        let publishers = await publisherApi.getAll();

        expect(publishers.data).toStrictEqual(
            [{
                publisher_id: 1,
                name: 'publisher 1',
                address: 'publisher 1 address',
                contact_email: 'publisher1@example.com',
                books:[]
            }]);
    });

    test('will saved the publisher', async () => {
        let publisher: Publisher = new Publisher();
        publisher.name = "publisher 2";
        publisher.address = "publisher 2 address";
        publisher.contact_email = "publisher2@example.com";

        let savedPublisher = await publisherApi.post(publisher);

        expect(savedPublisher.data).toStrictEqual(
            {
                publisher_id: 2,
                name: "publisher 2",
                address: "publisher 2 address",
                contact_email: "publisher2@example.com",
                books:[]
            });
    });

    test('will update the publisher', async () => {
        let publisher: Publisher = new Publisher();
        publisher.publisher_id = 2;
        publisher.name = "publisher 2";
        publisher.address = "publisher 2 updated address";
        publisher.contact_email = "publisher2@example.com";

        let savedPublisher = await publisherApi.put(publisher);
        
        expect(savedPublisher.data).toStrictEqual(
            {
                publisher_id: 2,
                name: "publisher 2",
                address: "publisher 2 updated address",
                contact_email: "publisher2@example.com",
                books:[]
            });
    });

        
    it('should handle deleting a non-existent publisher', async () => {
        const nonExistentPublisherId = 9999;
        let publisher = await publisherApi.delete(nonExistentPublisherId)
        expect(publisher.error).toBe('Publisher not found')
        expect(publisher.errorCode).toBe(404);
    });

    it('should delete an existing publisher', async () => {
        await publisherApi.delete(2);
        const deletedPublisher = await publisherApi.get('2');
        expect(deletedPublisher.error).toBe('Publisher not found')
        expect(deletedPublisher.errorCode).toBe(404);
    });
});
