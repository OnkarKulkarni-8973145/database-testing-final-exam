import Author from "../../entities/author";
import { MockAuthorRepositoryDataConnector } from "./mockAuthorRepositoryDataConnector";
import AuthorRepository from "./authorRepository";

describe('Author Api', () => {
    let authorApi: any;

    beforeAll(() => {
        authorApi = new AuthorRepository(new MockAuthorRepositoryDataConnector());
    });

    test('will throw an error if id is not a number', async () => {
        let author = await authorApi.get('abcd');

        expect(author.error).toBe('ID must be a number')
        expect(author.errorCode).toBe(400);
    });

    test('will throw an error if id is less than 0', async () => {
        let author = await authorApi.get('-1');

        expect(author.error).toBe('Author ID cannot be less than 0')
        expect(author.errorCode).toBe(400);
    });

    test('will throw an error if id is not found', async () => {
        let author = await authorApi.get('2');

        expect(author.error).toBe('Author not found')
        expect(author.errorCode).toBe(404);
    });

    test('a author is returned if a positive id is provided', async () => {
        let author = await authorApi.get('1');

        expect(author.data).toStrictEqual(
            {
                author_id: 1,
                name: 'author 1',
                bio: 'author 1 bio',
                birth_date: new Date('1992-08-25'),
                books:[]
            });
    });

    test('will retrieve all authors', async () => {
        let authors = await authorApi.getAll();

        expect(authors.data).toStrictEqual(
            [{
                author_id: 1,
                name: 'author 1',
                bio: 'author 1 bio',
                birth_date: new Date('1992-08-25'),
                books:[]
            }]);
    });

    test('will saved the author', async () => {
        let author: Author = new Author();
        author.name = "author 2";
        author.bio = "author 2 bio";
        author.birth_date = new Date('1967-05-28');

        let savedAuthor = await authorApi.post(author);

        expect(savedAuthor.data).toStrictEqual(
            {
                author_id: 2,
                name: "author 2",
                bio: "author 2 bio",
                birth_date: new Date('1967-05-28'),
                books:[]
            });
    });

    test('will update the author', async () => {
        let author: Author = new Author();
        author.author_id = 2;
        author.name = "author 2";
        author.bio = "author 2 updated bio";
        author.birth_date = new Date('1967-05-28');

        let savedAuthor = await authorApi.put(author);
        
        expect(savedAuthor.data).toStrictEqual(
            {
                author_id: 2,
                name: "author 2",
                bio: "author 2 updated bio",
                birth_date: new Date('1967-05-28'),
                books:[]
            });
    });

        
    it('should handle deleting a non-existent author', async () => {
        const nonExistentAuthorId = 9999;
        let author = await authorApi.delete(nonExistentAuthorId)
        expect(author.error).toBe('Author not found')
        expect(author.errorCode).toBe(404);
    });

    it('should delete an existing author', async () => {
        await authorApi.delete(2);
        const deletedAuthor = await authorApi.get('2');
        expect(deletedAuthor.error).toBe('Author not found')
        expect(deletedAuthor.errorCode).toBe(404);
    });
});
