import { DataSource } from "typeorm";
import DataConnector from "../../interfaces/dataConnector";
import Customer from "../../entities/customer";
import CustomerFilteringOptions from "../../interfaces/customerFilteringOptions";

export class CustomerRepositoryDataConnector implements DataConnector<Customer, CustomerFilteringOptions> {
    #dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.#dataSource = dataSource;
    }

    async findById(filteringOptions: CustomerFilteringOptions): Promise<Customer | null> {
        return await this.#dataSource.manager.findOne(Customer, {
            where: { customer_id: filteringOptions.customer_id }
        });
    }

    async create(entity: Customer): Promise<Customer> {
        return await this.#dataSource.manager.save(entity);
    }

    async update(entity: Customer): Promise<Customer> {
        const result = await this.#dataSource.manager.update(Customer, entity.customer_id, entity);

        if (result.affected === 0) throw new Error('Customer not found');
        
        return { ...entity, customer_id: entity.customer_id };
    }

    async delete(CustomerId: number): Promise<void> {
        await this.#dataSource.manager.delete(Customer, CustomerId);
    }

    async getAll (): Promise<Customer[]> {
        return await this.#dataSource.manager.find(Customer);
    }
}