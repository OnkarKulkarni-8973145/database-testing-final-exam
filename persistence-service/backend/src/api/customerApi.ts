import { Express } from "express";
import Customer from "../entities/customer";
import CustomerRepository from "../repositories/customer-repository/customerRepository";
import Result from "../utils/result";

export default class CustomerApi {
    #customerRepository: CustomerRepository;
    #express: Express;

    constructor(customerRepository: CustomerRepository, express: Express) {
        this.#customerRepository = customerRepository;
        this.#express = express;

        this.#express.get("/customer/:id", async (req, res) => {
            try {
                const result: Result<Customer> = await this.#customerRepository.get(req.params.id);

                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        this.#express.get("/customers", async (req, res) => {
            try {
                const customers = await this.#customerRepository.getAll();
        
                res.status(200).json(customers.data);
            } catch (err) {
                console.error('Failed to retrieve customer:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.post("/customer", async (req, res) => {
            const { body } = req;
            console.log(body);

            const customer = new Customer();

            customer.name = body.name;
            customer.email = body.email;
            customer.phone = body.phone;

            try {
                let result = await this.#customerRepository.post(customer);
                
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });

        this.#express.put("/customer/:id", async (req, res) => {
            const { id } = req.params;
            const { body } = req;
        
            const customer_id = parseInt(id);
            if (isNaN(customer_id)) {
                return res.status(400).json({ message: 'ID must be a number' });
            }

            const customer: Customer = new Customer();
            customer.customer_id = customer_id;
            customer.name = body.name;
            customer.email = body.email;
            customer.phone = body.phone;

        
            try {
                let result = await this.#customerRepository.put(customer);
        
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).json(result.data);
                }
            } catch (error) {
                console.error('Update operation failed:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        
        this.#express.delete("/customer/:id", async (req, res) => {
            const { id } = req.params;

            try {
                let result = await this.#customerRepository.delete(id);
        
                if (result.error && result.errorCode) {
                    res.status(result.errorCode).json({ message: result.error });
                } else {
                    res.status(200).send();
                }
            } catch (err) {
                console.error('Delete operation failed:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}

