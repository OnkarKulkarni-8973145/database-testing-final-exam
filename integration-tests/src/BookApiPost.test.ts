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
    describe("POST /book", () => {
    it("should create a new book", async () => {
      const response = await request(app).post("/book").send({
        title: "New Book",
        genre: "Fiction",
        publish_date: new Date(),
        author: 1,
        publisher: 1,
        format: "Hardcover",
        price: 19,
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
    }, 10000);

    it("should return 503 if there is a database error", async () => {
      jest.spyOn(dataSource.manager, "save").mockRejectedValue(new Error("DB error"));
      const response = await request(app).post("/book").send({
        title: "Book with DB Error",
      });
      expect(response.status).toBe(503);
      expect(response.body).toEqual({ error: "Book creation failed in db." });
    }, 10000);
  });
});