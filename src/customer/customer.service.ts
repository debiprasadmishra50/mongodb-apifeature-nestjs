import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Customer } from "./entities/customer.schema";
import { APIFeatures } from "../apiFeatures";

@Injectable()
export class CustomerService {
    constructor(@InjectModel(Customer.name) private customer: Model<Customer>) {}

    async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        // const { address, description, createdAt } = createCustomerDto;

        try {
            const data = await this.customer.create(createCustomerDto);
            return data;
        } catch (err) {
            if (err.code === 11000) throw new ConflictException("Email already exists");
            else new InternalServerErrorException();
        }
    }

    async findAllCustomers(query?: any): Promise<Customer[]> {
        // If there is NO query present
        if (!Object.keys(query).length) return await this.customer.find({});

        let filter = {};

        const features = new APIFeatures(this.customer.find(filter), query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const data = await features.query;

        return data;
    }

    async findOneCustomer(id: string): Promise<Customer> {
        const customer = await this.customer.findById(id);

        if (!customer) throw new NotFoundException("Customer Not Found!");

        return customer;
    }

    async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto) {
        const customer = await this.customer.findByIdAndUpdate(id, updateCustomerDto, {
            new: true,
        });

        if (!customer) throw new NotFoundException("Customer Not Found!");

        return customer;
    }

    async removeCustomer(id: string) {
        const customer = await this.customer.findByIdAndDelete(id);

        if (!customer) throw new NotFoundException("Customer Not Found!");

        return customer;
    }
}
