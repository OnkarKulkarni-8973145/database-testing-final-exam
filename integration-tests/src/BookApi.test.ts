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

  describe("GET /books", () => {
    it("should return all books", async () => {
      const response = await request(app).get("/books");
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    }, 10000);

    it("should return 500 if there is an error", async () => {
      jest.spyOn(dataSource.manager, "find").mockRejectedValue(new Error("DB error"));
      const response = await request(app).get("/books");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error fetching books" });
    }, 10000);
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

