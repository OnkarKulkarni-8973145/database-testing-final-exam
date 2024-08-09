import Customer from "../../entities/customer";
import DataConnector from "../../interfaces/dataConnector";
import CustomerFilteringOptions from "../../interfaces/customerFilteringOptions";
import Result from "../../utils/result";

export default class CustomerRepository {
    #dataConnector: DataConnector<Customer, CustomerFilteringOptions>

    constructor(dataConnector: DataConnector<Customer, CustomerFilteringOptions>,) {
        this.#dataConnector = dataConnector
    }
   
    async get(id: string): Promise<Result<Customer>> {

        const customer_id = parseInt(id);

        if(isNaN(customer_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (typeof customer_id !== 'number') return { error: 'ID must be a number', errorCode: 400 };
        if (customer_id < 0) return { error: 'Customer ID cannot be less than 0', errorCode: 400 };

        try {
            let customer = await this.#dataConnector.findById({ customer_id });
            if (!customer) return { error: 'Customer not found', errorCode: 404 };

            return { data: customer };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async getAll(): Promise<Result<Customer[]>> {
        try {
            let photos = await this.#dataConnector.getAll();
            return { data: photos };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async post(customer: Customer): Promise<Result<Customer>> {

        customer.join_date = new Date();

        try {
            let savedCustomer = await this.#dataConnector.create(customer);
            return { data: savedCustomer };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async put(customer: Customer): Promise<Result<Customer>> {

        try {
            let savedCustomer = await this.#dataConnector.update(customer);
            return { data: savedCustomer };
        } catch(error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }

    async delete(id: string): Promise<Result<void>> {
        const customer_id = parseInt(id);

        if (isNaN(customer_id)) return { error: 'ID must be a number', errorCode: 400 };
        if (customer_id < 0) return { error: 'Customer ID cannot be less than 0', errorCode: 400 };

        try {
            const customer = await this.#dataConnector.findById({ customer_id });

            if (!customer) return { error: 'Customer not found', errorCode: 404 };

            await this.#dataConnector.delete(customer_id); 
            
            return { data: undefined };
        } catch (error) {
            return { error: 'Database error', errorCode: 500 };
        }
    }
}

