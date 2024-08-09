import express, { Express } from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import bookApi from "../persistence-service/backend/src/api/bookApi";
import { book } from "../persistence-service/backend/src/entities/book";
import { MockBookApiDataConnector } from "../books/BookApi";

describe("BookApi", () => {
  let app: Express;
  let dataSource: DataSource;
  let mockDataConnector: MockBookApiDataConnector;
  let bookApi: BookApi;

  beforeEach(() => {
    app = express();
    mockDataConnector = new MockBookApiDataConnector();
    dataSource = new DataSource({ type: "sqlite", database: ":memory:", synchronize: true, entities: [Book] });
    bookApi = new BookApi(mockDataConnector, dataSource, app);
  });

    describe("GET /book/:book_id", () => {
        it("should return a book by its ID", async () => {
        const response = await request(app).get("/book/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            expect.objectContaining({
            book_id: 1,
            title: "The Mocked Book",
            }),
        ]);
        }, 10000);

        it("should return 404 if the book is not found", async () => {
        const response = await request(app).get("/book/999");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Book not found" });
        }, 10000);
    });
});