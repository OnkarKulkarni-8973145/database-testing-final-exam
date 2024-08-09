import { DataSource } from "typeorm";
import { Photo } from "./entities/photo";
import Customer from "./entities/customer";
import Author from "./entities/author";
import Publisher from "./entities/publisher";
import Book from "./entities/book";
import { InsertTableData1723220678801 } from "./migration/1723220678801-InsertTableData";
import Review from "./entities/review";
import Order from "./entities/order";
import OrderItem from "./entities/orderItem";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Photo, Customer, Author, Publisher, Book, Review, Order, OrderItem],
  synchronize: true,
  logging: false,
  migrations: [InsertTableData1723220678801],
});

export { postgresDataSource as default }
