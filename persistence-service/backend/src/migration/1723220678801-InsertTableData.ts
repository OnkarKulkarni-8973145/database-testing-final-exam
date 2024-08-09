import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertTableData1723220678801 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert data into Authors
        await queryRunner.query(`
            INSERT INTO Authors (name, bio, birth_date)
            VALUES
                ('J.K. Rowling', 'Author of the Harry Potter series', '1965-07-31'),
                ('George R.R. Martin', 'Author of A Song of Ice and Fire', '1948-09-20'),
                ('J.R.R. Tolkien', 'Author of The Lord of the Rings', '1892-01-03'),
        `);

        // Insert data into Customers
        await queryRunner.query(`
            INSERT INTO Customers (name, email, phone, join_date)
            VALUES
                ('Alice Johnson', 'alice.johnson@gmail.com', '555-1234', '2023-01-15'),
                ('Bob Smith', 'bob.smith@gmail.com', '555-5678', '2023-02-20'),
                ('Charlie Brown', 'charlie.brown@outlook.com', '555-8765', '2023-03-10')
        `);

        // Insert data into Publishers
        await queryRunner.query(`
            INSERT INTO Publishers (name, address, contact_email)
            VALUES
                ('Penguin Books', '375 Hudson Street, New York, NY 10014', 'contact@penguinbooks.com'),
                ('HarperCollins', '195 Broadway, New York, NY 10007', 'info@harpercollins.com'),
                ('Random House', '1745 Broadway, New York, NY 10019', 'support@randomhouse.com')
        `);

        // Insert data into Books
        await queryRunner.query(`
            INSERT INTO Books (title, genre, publish_date, author_id, publisher_id, format, price)
            VALUES
                ('Harry Potter and the Philosopher''s Stone', 'Fantasy', '2023-06-26', 1, 1, 'Hardcover', 19.99),
                ('Harry Potter and the Chamber of Secrets', 'Fantasy', '2023-07-31', 1, 1, 'Hardcover', 21.99),
                ('A Game of Thrones', 'Fantasy', '2023-08-06', 2, 2, 'Paperback', 9.99)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Delete data from Books
        await queryRunner.query(`
            DELETE FROM Books
            WHERE title IN (
                'Harry Potter and the Philosopher''s Stone',
                'Harry Potter and the Chamber of Secrets',
                'A Game of Thrones'
            )
        `);

        // Delete data from Publishers
        await queryRunner.query(`
            DELETE FROM Publishers
            WHERE name IN (
                'Penguin Books',
                'HarperCollins',
                'Random House'
            )
        `);

        // Delete data from Customers
        await queryRunner.query(`
            DELETE FROM Customers
            WHERE name IN (
                'Alice Johnson',
                'Bob Smith',
                'Charlie Brown'
            )
        `);

        // Delete data from Authors
        await queryRunner.query(`
            DELETE FROM Authors
            WHERE name IN (
                'J.K. Rowling',
                'George R.R. Martin',
                'J.R.R. Tolkien'
            )
        `);
    }
}