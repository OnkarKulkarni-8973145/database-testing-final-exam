import express, { Express } from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import bookApi from "../persistence-service/backend/src/api/bookApi";
import { book } from "../persistence-service/backend/src/entities/book";
import { MockBookApiDataConnector } from "../books/BookApi";

describe("bookApi", () => {
  let app: Express;
  let dataSource: DataSource;
  let mockDataConnector: MockBookApiDataConnector;
  let bookApi: bookApi;

  beforeEach(() => {
    app = express();
    mockDataConnector = new MockBookApiDataConnector();
    dataSource = new DataSource({ type: "sqlite", database: ":memory:", synchronize: true, entities: [book] });
    bookApi = new bookApi(mockDataConnector, dataSource, app);
  });
    describe("DELETE /book/:book_id", () => {
    it("should delete an existing book", async () => {
      const response = await request(app).delete("/book/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Book deleted successfully" });
    }, 10000);

    it("should return 404 if the book is not found", async () => {
      const response = await request(app).delete("/book/999");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Book not found" });
    }, 10000);

    it("should return 503 if there is a database error", async () => {
      jest.spyOn(dataSource.manager, "findOneBy").mockRejectedValue(new Error("DB error"));
      const response = await request(app).delete("/book/1");
      expect(response.status).toBe(503);
      expect(response.body).toEqual({ error: "Book deletion failed in db." });
    }, 10000);
  });
});