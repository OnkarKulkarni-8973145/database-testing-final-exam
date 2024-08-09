
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import cors from "cors";
import express, { json } from "express";
import postgresDataSource from "./configure";
import PhotoApi from "./api/photoApi";
import PhotoRepository from "./repositories/photo-repository/photoRepository";
import { PhotoRepositoryDataConnector } from './repositories/photo-repository/photoRepositoryDataConnector';
import { CustomerRepositoryDataConnector } from './repositories/customer-repository/customerRepositoryDataConnector';
import CustomerRepository from './repositories/customer-repository/customerRepository';
import CustomerApi from './api/customerApi';
import { AuthorRepositoryDataConnector } from './repositories/author-repository/authorRepositoryDataConnector';
import AuthorRepository from './repositories/author-repository/authorRepository';
import AuthorApi from './api/authorApi';
import { PublisherRepositoryDataConnector } from './repositories/publisher-repository/publisherRepositoryDataConnector';
import PublisherRepository from './repositories/publisher-repository/publisherRepository';
import PublisherApi from './api/publisherApi';
import { BookRepositoryDataConnector } from './repositories/book-repository/bookRepositoryDataConnector';
import BookRepository from './repositories/book-repository/bookRepository';
import BookApi from './api/bookApi';

(async () => {
    const app = express();
    app.use(cors());
    app.use(json());

    const datasource = await postgresDataSource.initialize();

    const photoRepositoryDataConnector = new PhotoRepositoryDataConnector(datasource);
    const photoRepository = new PhotoRepository(photoRepositoryDataConnector)

    const customerRepositoryDataConnector = new CustomerRepositoryDataConnector(datasource);
    const customerRepository = new CustomerRepository(customerRepositoryDataConnector);

    const authorRepositoryDataConnector = new AuthorRepositoryDataConnector(datasource);
    const authorRepository = new AuthorRepository(authorRepositoryDataConnector);

    const publisherRepositoryDataConnector = new PublisherRepositoryDataConnector(datasource);
    const publisherRepository = new PublisherRepository(publisherRepositoryDataConnector);

    const bookRepositoryDataConnector = new BookRepositoryDataConnector(datasource);
    const bookRepository = new BookRepository(bookRepositoryDataConnector, authorRepositoryDataConnector, publisherRepositoryDataConnector);

    new PhotoApi(photoRepository, app);
    new CustomerApi(customerRepository, app);
    new AuthorApi(authorRepository, app);
    new PublisherApi(publisherRepository, app);
    new BookApi(bookRepository, app);

    app.get("/", (_, res) => {
        return res.send("hello world");
    });

    app.listen(8000, () => {
        console.log(`express server started on 8000`);
    });
})().catch((err) => console.log(err));
