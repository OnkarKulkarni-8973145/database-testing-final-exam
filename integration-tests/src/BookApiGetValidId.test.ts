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