import express, { Express } from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import BookApi from "../books/BookApi";
import { Book } from "../books/Books";
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
    describe("PUT /book/:book_id", () => {
        it("should update an existing book", async () => {
        const response = await request(app).put("/book/1").send({
            title: "Updated Book Title",
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1 });
        }, 10000);

        it("should return 404 if the book is not found", async () => {
        const response = await request(app).put("/book/999").send({
            title: "Non-existent Book",
        });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Book not found" });
        }, 10000);

        it("should return 503 if there is a database error", async () => {
        jest.spyOn(dataSource.manager, "findOneBy").mockRejectedValue(new Error("DB error"));
        const response = await request(app).put("/book/1").send({
            title: "Book with DB Error",
        });
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ error: "Book update failed in db." });
        }, 10000);
    });
});