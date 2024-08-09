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
    describe("get method", () => {
    it("should return book data for a valid ID", async () => {
      const result = await bookApi.get("1");
      expect(result).toEqual([
        expect.objectContaining({
          book_id: 1,
          title: "A Mocked Book",
        }),
      ]);
    }, 10000);

    it("should return an error message for a negative ID", async () => {
      const result = bookApi.get("-1");
      expect(result).toBe("Book ID cannot be less than 0");
    }, 10000);

    it("should return an error message if ID is not a number", async () => {
      const result = bookApi.get("invalid");
      expect(result).toBe("ID must be a number");
    }, 10000);
  });
});